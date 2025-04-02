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
     * Fetches and logs part revisions and associated forum threads/posts using ForumHelper.
     */
    private void findPartRevisionsAndDiscussions(WTPart part) {
        try {
            // Accessing forums for the part using ForumHelper.service
            Enumeration forums = ForumHelper.service.getForum(part); // Fetch forums associated with the part
            
            // Iterate through the forums and log details about each forum
            while (forums.hasMoreElements()) {
                ForumThread forumThread = (ForumThread) forums.nextElement();
                LOGGER.debug("Forum Thread: " + forumThread.getName() + " | Thread ID: " + forumThread.getId());

                // Fetch all posts in the thread
                Iterator<ForumPost> forumPosts = forumThread.getPosts();
                while (forumPosts.hasNext()) {
                    ForumPost forumPost = forumPosts.next();
                    LOGGER.debug("Forum Post: " + forumPost.getSubject() + " | Post ID: " + forumPost.getId());
                }
            }
        } catch (WTException e) {
            LOGGER.error("Error fetching forums and discussions for part: " + part.getNumber(), e);
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
