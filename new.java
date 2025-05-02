package ext.cummins.part.dataUtilities;

import com.ptc.core.components.descriptor.ModelContext;
import com.ptc.core.components.factory.dataUtilities.DefaultDataUtility;
import com.ptc.core.components.rendering.guicomponents.AttributeGuiComponent;
import com.ptc.core.components.rendering.guicomponents.UrlDisplayComponent;
import wt.fc.ObjectReference;
import wt.fc.ReferenceFactory;
import wt.httpgw.GatewayServletHelper;
import wt.httpgw.URLFactory;
import wt.part.WTPart;
import wt.util.WTException;
import wt.workflow.forum.DiscussionForum;
import wt.workflow.forum.DiscussionTopic;
import wt.workflow.forum.ForumHelper;

import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CumminsGetDiscussionDataUtility extends DefaultDataUtility  {

    

@Override
public Object getDataValue(String s, Object o, ModelContext modelContext) throws WTException {
    System.out.println("s:" + s);
    List<AttributeGuiComponent> topicList = new ArrayList<>();

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

                    // Format string to show in column (can be enhanced with HTML or line breaks)
                    String displayText = "Topic: " + topic.getName() +
                            "\nMessage: " + message +
                            "\nCreated: " + created +
                            "\nModified: " + modified +
                            "\nModified By: " + modifiedBy;

                    UrlDisplayComponent urlDisplay = new UrlDisplayComponent(s, null, null, null);

                    // Create link to topic
                    HashMap<String, String> hashmap = new HashMap<>();
                    hashmap.put("action", "ObjProps");
                    ObjectReference objectreference = ObjectReference.newObjectReference(topic);
                    ReferenceFactory referencefactory = new ReferenceFactory();
                    hashmap.put("oid", referencefactory.getReferenceString(objectreference));
                    URLFactory urlfactory = new URLFactory();
                    String url = GatewayServletHelper.buildAuthenticatedHREF(
                            urlfactory,
                            "wt.enterprise.URLProcessor",
                            "URLTemplateAction",
                            null,
                            hashmap
                    );

                    urlDisplay.setLink(url);
                    urlDisplay.setLabel(topic.getName());
                    urlDisplay.setName(topic.getName());
                    urlDisplay.setLabelForTheLink(displayText);  // This will show the full content on hover
                    urlDisplay.setTarget("_blank");

                    topicList.add(urlDisplay);
                }
            }
        }
    }

    return topicList;
}}
--> in this code we we are displayText  in urlDisplay, but i need to add field on column value like-->  ColumnConfig col3 = factory.newColumnConfig("url", false);
        col3.setDataUtilityId("getDiscussions");
        col3.setLabel("Discussion Link");
        table.addComponent(col3);

        ColumnConfig col4 = factory.newColumnConfig("subject", false);
        col4.setDataUtilityId("getDiscussions");
        col4.setLabel("Subject");
        table.addComponent(col4);

        ColumnConfig col5 = factory.newColumnConfig("message", false); // false = NOT multiple
        col5.setLabel("Message");
        col5.setDataUtilityId("getDiscussions");
        table.addComponent(col5);

        ColumnConfig col6 = factory.newColumnConfig("createdDate", false);
        col6.setDataUtilityId("getDiscussions");
        col6.setLabel("Created Date");
        table.addComponent(col6);

        ColumnConfig col7 = factory.newColumnConfig("modificationDate", false);
        col7.setDataUtilityId("getDiscussions");
        col7.setLabel("Modification Date");
        table.addComponent(col7);
		
}
