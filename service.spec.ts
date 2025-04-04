package ext.cummins.part.listener;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import ext.cummins.mpml.builder.CumminsValidatePlantItems;
import ext.cummins.change.forms.processor.CumminsCNReviseFormProcessor;
import ext.cummins.listner.AbstractCumminsEvents;
import wt.fc.QueryResult;
import wt.part.WTPart;
import wt.util.WTException;
import wt.vc.wip.WorkInProgressHelper;
import wt.workflow.forum.DiscussionForum;
import wt.workflow.forum.DiscussionTopic;
import wt.workflow.forum.ForumHelper;
import java.util.Enumeration;
import java.util.Optional;

public class CumminsPartReviseListener extends AbstractCumminsEvents {

    private static final Logger LOGGER = LogManager.getLogger(CumminsPartReviseListener.class);

    @Override
    public void apply(Object obj) throws WTException {
        LOGGER.debug("in Apply Method CumminsPartReviseListener: {}", obj);

        if (obj instanceof WTPart) {
            WTPart part = (WTPart) obj;
            boolean doOperation = !(WorkInProgressHelper.isCheckedOut(part) || WorkInProgressHelper.isWorkingCopy(part));
            LOGGER.debug("doOperation: {}", doOperation);

            if (doOperation) {
                LOGGER.debug("Processing Part: {}", part.getDisplayIdentity());

                // Handle previous part retrieval with exception handling
                Optional<WTPart> previousPart = Optional.empty();
                try {
                    previousPart = Optional.ofNullable(CumminsValidatePlantItems.getPreviousVersionViewPart(part));
                    previousPart.ifPresent(p -> LOGGER.debug("Previous Part: {}", p));
                } catch (WTException e) {
                    LOGGER.debug("No previous part found for part: {}", part.getDisplayIdentity(), e);
                }

                // Get forums for the appropriate part (current or previous part)
                Enumeration forums = previousPart
                        .map(p -> ForumHelper.service.getForums(p))
                        .orElse(ForumHelper.service.getForums(part));

                LOGGER.debug("forums: {}", forums);

                if (forums.hasMoreElements()) {
                    DiscussionForum forum = (DiscussionForum) forums.nextElement();
                    try {
                        // Create a new discussion forum for the new part revision
                        DiscussionForum newDiscussionForum = ForumHelper.service.createForum(
                                forum.getParent().getDefinition().getName(), forum.getName(), part, null);
                        newDiscussionForum = ForumHelper.service.saveForum(part.getContainer(), newDiscussionForum);
                        LOGGER.debug("Created new discussion forum: {}", newDiscussionForum);

                        // Process topics and postings in the forum
                        Enumeration topics = forum.getTopics();
                        while (topics.hasMoreElements()) {
                            DiscussionTopic topic = (DiscussionTopic) topics.nextElement();
                            QueryResult postings = (QueryResult) topic.getPostings();
                            LOGGER.debug("Processing topic: {}", topic);
                            LOGGER.debug("Postings: {}", postings);
                            CumminsCNReviseFormProcessor.createForumTopicPostingOnNewRevision(part, newDiscussionForum, topic, postings);
                        }
                    } catch (WTException e) {
                        LOGGER.error("Error processing forum for part: {}", part.getDisplayIdentity(), e);
                    }
                } else {
                    LOGGER.debug("No Forum for Part: {}", part.getDisplayIdentity());
                }
            }
        }
    }
}
