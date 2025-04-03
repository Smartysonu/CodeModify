package ext.cummins.part.listener;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import ext.cummins.mpml.builder.CumminsValidatePlantItems;
import ext.cummins.change.forms.processor.CumminsCNReviseFormProcessor;
import ext.cummins.listner.AbstractCumminsEvents;
import ext.cummins.utils.CumminsUtils;
import wt.fc.QueryResult;
import wt.part.WTPart;
import wt.util.WTException;
import wt.vc.wip.WorkInProgressHelper;
import wt.workflow.forum.DiscussionForum;
import wt.workflow.forum.DiscussionTopic;
import wt.workflow.forum.ForumHelper;
import java.util.Optional;

public class CumminsPartReviseListener extends AbstractCumminsEvents {

    private static final Logger LOGGER = LogManager.getLogger(CumminsPartReviseListener.class);

    @Override
    public void apply(Object obj) throws WTException {
        LOGGER.debug("in Apply Method CumminsPartReviseListener: " + obj);

        if (obj instanceof WTPart) {
            WTPart part = (WTPart) obj;
            boolean doOperation = !(WorkInProgressHelper.isCheckedOut(part) || WorkInProgressHelper.isWorkingCopy(part));
            LOGGER.debug("doOperation: " + doOperation);

            if (doOperation) {
                LOGGER.debug("doOperation Part: " + part.getDisplayIdentity());

                Optional<WTPart> previousPart = Optional.ofNullable(CumminsValidatePlantItems.getPreviousVersionViewPart(part));
                previousPart.ifPresentOrElse(
                        p -> LOGGER.debug("Previous Part: " + p),
                        () -> LOGGER.debug("No previous part found")
                );

                // Fetch forums for either the previous part or the current part
                Iterable<DiscussionForum> forums = (previousPart.isPresent()) ?
                        ForumHelper.service.getForums(previousPart.get()) :
                        ForumHelper.service.getForums(part);

                forums.forEach(forum -> {
                    LOGGER.debug("Forum: " + forum.getName());
                    try {
                        // Create a new discussion forum for the new part revision
                        DiscussionForum newDiscussionForum = ForumHelper.service.createForum(
                                forum.getParent().getDefinition().getName(), forum.getName(), part, null);
                        newDiscussionForum = ForumHelper.service.saveForum(part.getContainer(), newDiscussionForum);
                        LOGGER.debug("Created new discussion forum: " + newDiscussionForum);

                        // Handle topics and postings within the forum
                        forum.getTopics().forEachRemaining(topic -> {
                            QueryResult postings = (QueryResult) topic.getPostings();
                            LOGGER.debug("Topic: " + topic);
                            LOGGER.debug("Postings: " + postings);
                            CumminsCNReviseFormProcessor.createForumTopicPostingOnNewRevision(part, newDiscussionForum, topic, postings);
                        });

                    } catch (WTException e) {
                        LOGGER.error("Error processing forum for part: " + part.getDisplayIdentity(), e);
                    }
                });

                // If no forums were found, log the message
                if (!forums.iterator().hasNext()) {
                    LOGGER.debug("No Forum for Part: " + part.getDisplayIdentity());
                }
            }
        }
    }
}
