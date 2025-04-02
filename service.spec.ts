import wt.part.WTPart;
import wt.doc.WTDocument;
import wt.util.WTException;
import wt.vc.wip.WorkInProgressHelper;
import wt.vc.Versioned;
import wt.util.WTLogger;
import wt.util.WTMessage;
import wt.forum.ForumHelper;
import wt.forum.ForumThread;
import wt.forum.ForumPost;
import wt.forum.ForumTopic;
import wt.forum.ForumSubscription;

import java.util.Iterator;

public class CumminsPartDocCADReviseListener extends AbstractCumminsEvents {

    private static final String ENGINEERING = "Engineering";
    private static final String ZZ_Revision = "ZZ";
    private static final String RESOURCE = CumminsPartResource.class.getName();
    private static final WTLogger LOGGER = WTLogger.getLogger(CumminsPartDocCADReviseListener.class.getName());

    @Override
    public void apply(Object obj) throws WTException {

        if (obj != null && obj instanceof WTPart) {
            WTPart part = (WTPart) obj;

            boolean doOperation = WorkInProgressHelper.isCheckedOut(part)
                    || WorkInProgressHelper.isWorkingCopy(part) ? false : true;
            boolean isValidationApplicable = CumminsUtils.getOrganizationPreference(part.getOrganizationName(),
                    "PART_DOC_CAD_REVISE_VALIDATION");

            if (doOperation && isValidationApplicable) {
                String partSeriesName = part.getMaster().getSeries();
                String partVersion = part.getVersionIdentifier().getValue();
                String partNumber = part.getNumber();

                // Log the part series, version, and number
                LOGGER.debug("Series : " + partSeriesName);
                LOGGER.debug("partNumber : " + partNumber + ", partVersion :" + partVersion);

                // Fetch and log the part revisions and associated discussions in one method
                findPartRevisionsAndDiscussions(part);

                if ((partSeriesName.equalsIgnoreCase("wt.series.HarvardSeries.PGBUCumminsPartSeries")
                        || partSeriesName.equalsIgnoreCase("wt.series.HarvardSeries.PGBUCumminsPartSeries_Legacy"))
                        && partVersion.equalsIgnoreCase(ZZ_Revision)
                        && part.getViewName().equalsIgnoreCase(ENGINEERING)) {
                    throw new WTException(new WTMessage(RESOURCE,
                            CumminsPartResource.ERR_ZZ_Revision, new Object[]{}));
                }
            }
        }
    }

    /**
     * Fetches and logs both part revisions (version history) and associated forum threads/posts
     * for the given part in one method using ForumHelper. It also forwards discussion, topic, 
     * posting, and subscription to the next revision.
     */
    private void findPartRevisionsAndDiscussions(WTPart part) {
        try {
            // Fetch the part's version history
            Iterator<?> revisionIterator = part.getMaster().getVersionHistory();

            // Iterate through the history and log each part revision
            while (revisionIterator.hasNext()) {
                Versioned versioned = (Versioned) revisionIterator.next();
                String revisionNumber = versioned.getVersionIdentifier().getValue();
                String partNumber = part.getNumber(); // Same part number for all revisions
                LOGGER.debug("Part Number: " + partNumber + " | Revision: " + revisionNumber);

                // Fetch the associated forums or threads using ForumHelper
                ForumHelper service = ForumHelper.service;
                Iterator<ForumThread> forumThreads = service.getThreadsForObject(part); // Get threads related to the part

                // Iterate through each forum thread and log associated posts
                while (forumThreads.hasNext()) {
                    ForumThread forumThread = forumThreads.next();
                    LOGGER.debug("Forum Thread: " + forumThread.getName() + " | Thread ID: " + forumThread.getId());

                    // Forward the forum thread and its posts to the new revision
                    forwardForumToNextRevision(part, forumThread);

                    // Fetch all posts in the thread
                    Iterator<ForumPost> forumPosts = forumThread.getPosts();
                    while (forumPosts.hasNext()) {
                        ForumPost forumPost = forumPosts.next();
                        LOGGER.debug("Forum Post: " + forumPost.getSubject() + " | Post ID: " + forumPost.getId());
                    }

                    // Fetch and log the associated topics for each thread
                    Iterator<ForumTopic> forumTopics = forumThread.getTopics();
                    while (forumTopics.hasNext()) {
                        ForumTopic forumTopic = forumTopics.next();
                        LOGGER.debug("Forum Topic: " + forumTopic.getName() + " | Topic ID: " + forumTopic.getId());
                    }

                    // Fetch subscriptions related to this forum thread
                    Iterator<ForumSubscription> forumSubscriptions = forumThread.getSubscriptions();
                    while (forumSubscriptions.hasNext()) {
                        ForumSubscription subscription = forumSubscriptions.next();
                        LOGGER.debug("Forum Subscription: " + subscription.getSubscriber().getName() + " | Subscriber ID: " + subscription.getId());
                    }
                }
            }
        } catch (WTException e) {
            LOGGER.error("Error fetching part revision history and discussions for part: " + part.getNumber(), e);
        }
    }

    /**
     * Forwards the forum thread and associated data (topic, posting, subscription) to the next revision of the part.
     */
    private void forwardForumToNextRevision(WTPart part, ForumThread forumThread) {
        try {
            // Get the next revision of the part
            WTPart nextRevision = (WTPart) part.createRevision();

            // Log that the forum thread and associated data are being forwarded
            LOGGER.debug("Forwarding Forum Thread: " + forumThread.getName() + " to next revision of part " + part.getNumber());

            // Here you would need to create logic to associate the forum thread and related data with the new part revision
            // This could involve linking the forum thread to the next revision (through references or custom relationships)

            // This is a placeholder for actual logic to forward forum data to next revision
            // Note that Windchill may not directly support associating forum threads with part revisions automatically
            // You might need to create custom relationships or references if required.

        } catch (WTException e) {
            LOGGER.error("Error forwarding forum thread to next revision for part: " + part.getNumber(), e);
        }
    }
}
