package ext.cummins.part.mvc.builders;

import com.ptc.jca.mvc.components.JcaComponentParams;
import com.ptc.mvc.components.*;
import com.ptc.netmarkets.util.beans.NmCommandBean;
import com.ptc.netmarkets.util.beans.NmHelperBean;

import static com.ptc.core.components.descriptor.DescriptorConstants.ColumnIdentifiers.ICON;
import static ext.cummins.change.forms.processor.CumminsCNReviseFormProcessor.createPosting;
import static ext.cummins.change.forms.processor.CumminsCNReviseFormProcessor.createTopic;

import ext.cummins.change.forms.processor.CumminsCNReviseFormProcessor;
import ext.cummins.part.CumminsPartConstantIF;
import ext.cummins.utils.CumminsUtils;

import wt.associativity.WTAssociativityHelper;
import wt.fc.Persistable;
import wt.fc.QueryResult;
import wt.fc.WTObject;
import wt.log4j.LogManager;
import wt.log4j.Logger;
import wt.part.WTPart;
import wt.util.WTException;
import wt.vc.VersionControlHelper;
import wt.vc.Versioned;
import wt.workflow.forum.DiscussionForum;
import wt.workflow.forum.DiscussionPosting;
import wt.workflow.forum.DiscussionTopic;
import wt.workflow.forum.ForumHelper;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Enumeration;

@ComponentBuilder("ext.cummins.part.mvc.builders.TestDiscussionTable")
public class TestDiscussionTable extends AbstractComponentBuilder {

    private static final String CLASSNAME = TestDiscussionTable.class.getName();
    private static final Logger LOGGER = LogManager.getLogger(CLASSNAME);

    private static final String TYPE = "Type";
    private static final String TOPICS = "Topics/Comments";
    private static final String COMMENTS = "Comments";
    private static final String VERSION_VIEW_DISPLAY_NAME = "Version";

    @Override
    public ComponentConfig buildComponentConfig(ComponentParams params) throws WTException {
        LOGGER.debug("Enter >> TestDiscussionTable");

        ComponentConfigFactory factory = getComponentConfigFactory();
        TableConfig table = factory.newTableConfig();
        table.setLabel("Discussion History");
        table.setId("ext.cummins.part.mvc.builders.TestDiscussionTable");
        table.setSelectable(false);
        table.setShowCount(true);
        table.setActionModel("");

        // Add columns
        ColumnConfig col1 = factory.newColumnConfig(ICON, true);
        col1.setLabel(TYPE);
        table.addComponent(col1);

        ColumnConfig col2 = factory.newColumnConfig(TOPICS, false);
        col2.setLabel(TOPICS);
        table.addComponent(col2);

        ColumnConfig col4 = factory.newColumnConfig("versionInfo.identifier.versionId", true);
        col4.setLabel(VERSION_VIEW_DISPLAY_NAME);
        table.addComponent(col4);

        ColumnConfig col5 = factory.newColumnConfig(COMMENTS, true);
        col5.setLabel(COMMENTS);
        table.addComponent(col5);

        LOGGER.debug("End >> TestDiscussionTable");
        return table;
    }

    @Override
    public Object buildComponentData(ComponentConfig config, ComponentParams paramComponentParams) throws WTException, IOException {
        NmHelperBean nmHelperBean = ((JcaComponentParams) paramComponentParams).getHelperBean();
        NmCommandBean nmCommandBean = nmHelperBean.getNmCommandBean();

        Persistable requestObj = nmCommandBean.getPrimaryOid().getWtRef().getObject();
        WTPart wtpart = null;
        ArrayList<WTPart> listobj = new ArrayList<>();

        if (requestObj instanceof WTPart) {
            wtpart = (WTPart) requestObj;
           System.out.println("Request object is a WTPart: " + wtpart.getDisplayIdentifier());

            QueryResult versionQuery = VersionControlHelper.service.allVersionsOf(wtpart);
            Enumeration<?> forums = ForumHelper.service.getForums(wtpart);

            if (forums.hasMoreElements()) {
                DiscussionForum forum = (DiscussionForum) forums.nextElement();
                try {
                    DiscussionForum newDiscussionForum = ForumHelper.service.createForum(
                            forum.getParent().getDefinition().getName(), forum.getName(), wtpart, null);

                    System.out.println("Created new discussion forum: " + newDiscussionForum);

                    Enumeration<?> topics = forum.getTopics();
                    while (topics.hasMoreElements()) {
                        DiscussionTopic topic = (DiscussionTopic) topics.nextElement();
                        QueryResult postings = (QueryResult) topic.getPostings();

                        System.out.println("Processing topic: " + topic.getName());

                        DiscussionTopic newDiscussionTopic = createTopic(newDiscussionForum, topic);
                        System.out.println("Created new discussion topic: " + newDiscussionTopic);

                        while (postings.hasMoreElements()) {
                            DiscussionPosting posting = (DiscussionPosting) postings.nextElement();
                            createPosting(wtpart, newDiscussionTopic, posting);
                        }
                    }
                } catch (WTException e) {
                    LOGGER.error("Error processing forum for part: " + wtpart.getDisplayIdentity(), e);
                }
            }

            if (versionQuery.size() == 0) {
                System.out.println("No versions found for part: " + wtpart.getDisplayIdentifier());
            } else {
                System.out.println("Found " + versionQuery.size() + " versions for part: " + wtpart.getDisplayIdentifier());
            }

            while (versionQuery.hasMoreElements()) {
                Versioned versioned = (Versioned) versionQuery.nextElement();
                if (versioned instanceof WTPart) {
                    WTPart versionPart = (WTPart) versioned;
                    listobj.add(versionPart);
                    System.out.println("Fetched version: " + versionPart.getDisplayIdentifier());
                }
            }
        } else {
            System.out.println("Request object is not a WTPart.");
        }

        System.out.println("Total versions fetched: " + listobj.size());
        return listobj;
    }
}
