package ext.cummins.part.dataUtilities;

import com.ptc.core.components.descriptor.ModelContext;
import com.ptc.core.components.factory.dataUtilities.DefaultDataUtility;
import wt.fc.ObjectReference;
import wt.fc.ReferenceFactory;
import wt.httpgw.GatewayServletHelper;
import wt.httpgw.URLFactory;
import wt.part.WTPart;
import wt.util.WTException;
import wt.workflow.forum.DiscussionForum;
import wt.workflow.forum.DiscussionTopic;
import wt.workflow.forum.ForumHelper;
import wt.workflow.forum.DiscussionPosting;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;

public class CumminsGetDiscussionDataUtility extends DefaultDataUtility {

    @Override
    public Object getDataValue(String s, Object o, ModelContext modelContext) throws WTException {
        List<List<String>> topicList = new ArrayList<>();

        if (o instanceof WTPart) {
            WTPart part = (WTPart) o;
            Enumeration<?> forums = ForumHelper.service.getForums(part);

            if (forums.hasMoreElements()) {
                DiscussionForum forum = (DiscussionForum) forums.nextElement();
                Enumeration<?> topics = forum.getTopics();

                while (topics.hasMoreElements()) {
                    DiscussionTopic topic = (DiscussionTopic) topics.nextElement();
                    Enumeration<?> postings = topic.getPostings();

                    while (postings.hasMoreElements()) {
                        DiscussionPosting posting = (DiscussionPosting) postings.nextElement();

                        // Extract required details
                        String message = posting.getBody(); // Posting message
                        Timestamp created = posting.getCreateTimestamp();
                        Timestamp modified = posting.getModifyTimestamp();
                        String modifiedBy = posting.getModifierFullName(); // or use getModifiedBy() if needed

                        // Prepare URL for topic
                        String url = buildUrl(topic);

                        // Prepare row data for each topic
                        List<String> rowData = new ArrayList<>();
                        rowData.add(url);  // URL for Discussion Link (col3)
                        rowData.add(topic.getName());  // Subject (col4)
                        rowData.add(message);  // Message (col5)
                        rowData.add(created.toString());  // Created Date (col6)
                        rowData.add(modified.toString());  // Modification Date (col7)

                        // Add the row data to the list
                        topicList.add(rowData);
                    }
                }
            }
        }
        return topicList;
    }

    private String buildUrl(DiscussionTopic topic) {
        // Prepare the URL for the topic
        HashMap<String, Object> hashmap = new HashMap<>();
        hashmap.put("action", "ObjProps");
        ObjectReference objectReference = ObjectReference.newObjectReference(topic);
        ReferenceFactory referenceFactory = new ReferenceFactory();
        hashmap.put("oid", referenceFactory.getReferenceString(objectReference));
        URLFactory urlFactory = new URLFactory();

        return GatewayServletHelper.buildAuthenticatedHREF(
                urlFactory,
                "wt.enterprise.URLProcessor",
                "URLTemplateAction",
                null,
                hashmap
        );
    }
}
