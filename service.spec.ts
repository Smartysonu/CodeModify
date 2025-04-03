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
import java.util.Enumeration;

public class CumminsPartReviseListener extends AbstractCumminsEvents {

private static final Logger LOGGER = LogManager.getLogger(CumminsPartReviseListener.class);
@Override
public void apply(Object obj) throws WTException {
    LOGGER.debug("in Apply Method CumminsPartReviseListener: " + obj);
    if (obj instanceof WTPart) {
        WTPart part = (WTPart) obj;
        boolean doOperation = !WorkInProgressHelper.isCheckedOut(part) && !WorkInProgressHelper.isWorkingCopy(part);
        LOGGER.debug("doOperation: " + doOperation);

        if (doOperation) {
            LOGGER.debug("doOperation Part: " + part.getDisplayIdentity());

            WTPart previousPart = null;
            Enumeration forums = null;
            try {
                previousPart = CumminsValidatePlantItems.getPreviousVersionViewPart(part);
                LOGGER.debug("Previous Part: " + previousPart);
            } catch (Exception e) {
                LOGGER.debug("no part found", e);
            }

            forums = (previousPart != null) ? ForumHelper.service.getForums(previousPart) : ForumHelper.service.getForums(part);
            LOGGER.debug("forums: " + forums);

            if (forums.hasMoreElements()) {
                DiscussionForum forum = (DiscussionForum) forums.nextElement();
                DiscussionForum newDiscussionForum = ForumHelper.service.createForum(
                        forum.getParent().getDefinition().getName(), forum.getName(), part, null);
                newDiscussionForum = ForumHelper.service.saveForum(part.getContainer(), newDiscussionForum);
                LOGGER.debug("newDiscussionForum: " + newDiscussionForum);
                Enumeration topics = forum.getTopics();
                while (topics.hasMoreElements()) {
                    DiscussionTopic topic = (DiscussionTopic) topics.nextElement();
                    QueryResult postings = (QueryResult) topic.getPostings();
                    LOGGER.debug("topic: " + topic);
                    LOGGER.debug("postings: " + postings);
                    // Call Create Forum,Discussion,Posting Method
                  CumminsCNReviseFormProcessor.createForumTopicPostingOnNewRevision(part, newDiscussionForum, topic, postings);
                }
            } else {
                LOGGER.debug("No Forum for Part: " + part.getDisplayIdentity());
            }
        }
    }
  }
}
