package ext.cummins.part.dataUtilities;

import com.ptc.core.components.descriptor.ModelContext;
import com.ptc.core.components.factory.dataUtilities.DefaultDataUtility;
import com.ptc.core.components.rendering.guicomponents.TextDisplayComponent;
import com.ptc.core.components.rendering.guicomponents.UrlDisplayComponent;

import wt.fc.ObjectReference;
import wt.fc.ReferenceFactory;
import wt.httpgw.GatewayServletHelper;
import wt.httpgw.URLFactory;
import wt.part.WTPart;
import wt.util.WTException;
import wt.workflow.forum.DiscussionForum;
import wt.workflow.forum.DiscussionPosting;
import wt.workflow.forum.DiscussionTopic;
import wt.workflow.forum.ForumHelper;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;

public class CumminsGetDiscussionDataUtility extends DefaultDataUtility {

    @Override
    public Object getDataValue(String columnName, Object object, ModelContext modelContext) throws WTException {
   System.out.println("columnName:" + columnName);
        List<Object> components = new ArrayList<>();

        if (object instanceof WTPart) {
            WTPart part = (WTPart) object;
            Enumeration<?> forums = ForumHelper.service.getForums(part);

            if (forums.hasMoreElements()) {
                DiscussionForum forum = (DiscussionForum) forums.nextElement();
                Enumeration<?> topics = forum.getTopics();

                while (topics.hasMoreElements()) {
                    DiscussionTopic topic = (DiscussionTopic) topics.nextElement();
                    Enumeration<?> postings = topic.getPostings();

                    while (postings.hasMoreElements()) {
                        DiscussionPosting posting = (DiscussionPosting) postings.nextElement();

                        String subject = topic.getName() != null ? topic.getName() : "";
                        String message = posting.getMessage() != null ? posting.getMessage() : "";
                        Timestamp created = posting.getCreateTimestamp();
                        Timestamp modified = posting.getModifyTimestamp();

                        switch (columnName) {
                            case "subject":
                                components.add(new TextDisplayComponent("subject", subject));
                                break;
                            case "message":
                                components.add(new TextDisplayComponent("message", message));
                                break;
                            case "createdDate":
                                components.add(new TextDisplayComponent("createdDate", created != null ? created.toString() : ""));
                                break;
                            case "modificationDate":
                                components.add(new TextDisplayComponent("modificationDate", modified != null ? modified.toString() : ""));
                                break;
                           case "url":
			    UrlDisplayComponent urlDisplay = new UrlDisplayComponent(columnName, null, null, null);
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

			    //String topicName = topic.getName() != null ? topic.getName() : "Untitled Topic";
			    urlDisplay.setLink(url);
		            urlDisplay.setLabel(topic.getName());
		            urlDisplay.setName(topic.getName());
		            urlDisplay.setTarget("_blank");

                            components.add(urlDisplay);
			  
                            System.out.println("Generated URL for topic: " + topic.getName() + " -> " + url);
			    break;              
                         }
                    }
                }
            }
        }

    
        return components;
    }
}
