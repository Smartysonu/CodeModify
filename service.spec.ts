package ext.cummins.part.dataUtilities;

import com.ptc.core.components.descriptor.ModelContext;
import com.ptc.core.components.factory.dataUtilities.DefaultDataUtility;
import com.ptc.core.components.rendering.guicomponents.AttributeGuiComponent;
import com.ptc.core.components.rendering.guicomponents.UrlDisplayComponent;
import wt.fc.ObjectReference;
import wt.fc.QueryResult;
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

public class CumminsGetDiscussionDataUtility extends DefaultDataUtility  {

    @Override
    public Object getDataValue(String s, Object o, ModelContext modelContext) throws WTException {
        System.out.println("s:"+s);



        List<AttributeGuiComponent> topicList = new ArrayList<AttributeGuiComponent>();
        if(o instanceof WTPart){
            WTPart part = (WTPart)o;
            Enumeration<?> forums = ForumHelper.service.getForums(part);
            if(forums.hasMoreElements()){
                DiscussionForum  forum = (DiscussionForum) forums.nextElement();
                Enumeration<?> topics = forum.getTopics();
                while (topics.hasMoreElements()) {
                    DiscussionTopic topic = (DiscussionTopic) topics.nextElement();
                    UrlDisplayComponent urlDisplay = new UrlDisplayComponent(s, null, null, null);

                    HashMap hashmap = new HashMap();
                    hashmap.put("action", "ObjProps");
                    ObjectReference objectreference = ObjectReference.newObjectReference(topic);
                    ReferenceFactory referencefactory = new ReferenceFactory();
                    hashmap.put("oid", referencefactory.getReferenceString(objectreference));
                    URLFactory urlfactory = new wt.httpgw.URLFactory();

                    String url= GatewayServletHelper.buildAuthenticatedHREF(urlfactory,"wt.enterprise.URLProcessor", "URLTemplateAction", null, hashmap);
                    urlDisplay.setLink(url);
                    urlDisplay.setLabel(topic.getName());
                    urlDisplay.setName(topic.getName());
                    urlDisplay.setLabelForTheLink(topic.getName());
                    topicList.add(urlDisplay);
                }

            }
        }
        return topicList;
    }
}
