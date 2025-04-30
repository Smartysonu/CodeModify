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
        List<Map<String, Object>> topicList = new ArrayList<>();
        
        if (o instanceof WTPart) {
            WTPart part = (WTPart) o;
            Enumeration<?> forums = ForumHelper.service.getForums(part);
            if (forums.hasMoreElements()) {
                DiscussionForum forum = (DiscussionForum) forums.nextElement();
                Enumeration<?> topics = forum.getTopics();
                
                while (topics.hasMoreElements()) {
                    DiscussionTopic topic = (DiscussionTopic) topics.nextElement();
                    
                    // Create a UrlDisplayComponent for each topic
                    UrlDisplayComponent urlDisplay = new UrlDisplayComponent(s, null, null, null);
                    
                    // Fetch necessary details like subject, message, and timestamps
                    String createTimestamp = String.valueOf(forum.getCreateTimestamp());
                    String changeTimestamp = String.valueOf(forum.getModifyTimestamp());
                    String subject = String.valueOf(forum.getSubject());
                    String modifyTimestamp = String.valueOf(forum.getPersistInfo().getModifyStamp());

                    System.out.println("createTimestamp: " + createTimestamp);
                    System.out.println("changeTimestamp: " + changeTimestamp);
                    System.out.println("subject: " + subject);
                    System.out.println("modifyTimestamp: " + modifyTimestamp);

                    // Prepare the URL
                    HashMap<String, Object> hashmap = new HashMap<>();
                    hashmap.put("action", "ObjProps");
                    ObjectReference objectReference = ObjectReference.newObjectReference(topic);
                    ReferenceFactory referenceFactory = new ReferenceFactory();
                    hashmap.put("oid", referenceFactory.getReferenceString(objectReference));
                    URLFactory urlFactory = new wt.httpgw.URLFactory();

                    // Build the URL for the topic
                    String url = GatewayServletHelper.buildAuthenticatedHREF(urlFactory, "wt.enterprise.URLProcessor", "URLTemplateAction", null, hashmap);
                    urlDisplay.setLink(url);
                    urlDisplay.setLabel(topic.getName());
                    urlDisplay.setName(topic.getName());
                    urlDisplay.setLabelForTheLink(topic.getName());
                    urlDisplay.setTarget("_blank");

                    // Create a Map to store the additional attributes
                    Map<String, Object> topicData = new HashMap<>();
                    topicData.put("urlDisplay", urlDisplay);
                    topicData.put("subject", subject);
                    topicData.put("message", String.valueOf(topic.getMessage()));  // Assuming getMessage() exists
                    topicData.put("createdDate", createTimestamp);
                    topicData.put("modificationDate", modifyTimestamp);

                    // Add the topic data to the list
                    topicList.add(topicData);
                }
            }
        }
        return topicList;
    }
}
