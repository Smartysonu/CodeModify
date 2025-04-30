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
import org.apache.logging.log4j.*;
import wt.part.WTPart;
import wt.util.WTException;
import wt.vc.VersionControlHelper;
import wt.vc.Versioned;
import wt.workflow.forum.DiscussionForum;
import wt.workflow.forum.DiscussionPosting;
import wt.workflow.forum.DiscussionTopic;
import wt.workflow.forum.ForumHelper;

import java.util.Arrays;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Enumeration;
import java.util.HashSet;
import java.util.Set;

@ComponentBuilder("ext.cummins.part.mvc.builders.DiscussionHistoryTableBuilder")
public class DiscussionHistoryTableBuilder extends AbstractComponentBuilder {

    private static final String CLASSNAME = DiscussionHistoryTableBuilder.class.getName();
    private static final Logger LOGGER = LogManager.getLogger(CLASSNAME);

    private static final String TYPE = "Type";
    private static final String TOPICS = "Topics/Comments";
    private static final String COMMENTS = "Comments";
    private static final String VERSION_VIEW_DISPLAY_NAME = "Version";
    private static String isDataUtilityIdPresent;

    @Override
    public ComponentConfig buildComponentConfig(ComponentParams params) throws WTException {
        LOGGER.debug("Enter >> DiscussionHistoryTableBuilder");

        ComponentConfigFactory factory = getComponentConfigFactory();
        TableConfig table = factory.newTableConfig();
        table.setLabel("Discussion History");
        table.setId("ext.cummins.part.mvc.builders.CumminsDiscussionHistoryTableBuilder");
        table.setSelectable(true);
        table.setShowCount(true);
        table.setActionModel("unsubscribed forum with out delete actions");
        table.setShowCustomViewLink(false);
	table.setHelpContext("");
	table.setRowBasedObjectHandle(true);
        table.setShowCustomViewLink(true);

 
        // Add columns
        ColumnConfig col1 = factory.newColumnConfig(ICON, true);
        col1.setLabel(TYPE);
        table.addComponent(col1);

        ColumnConfig col3 = factory.newColumnConfig("versionInfo.identifier.versionId", true);
        col3.setLabel(VERSION_VIEW_DISPLAY_NAME);
        table.addComponent(col3);

         

        ColumnConfig col4 = factory.newColumnConfig("url", false);
        col4.setDataUtilityId("getDiscussions");
        col4.setLabel(TOPICS);
        table.addComponent(col4);


        LOGGER.debug("End >> CumminsDiscussionHistoryTableBuilder");
        return table;
    }

   @Override
public Object buildComponentData(ComponentConfig config, ComponentParams paramComponentParams) throws WTException, IOException {
    NmHelperBean nmHelperBean = ((JcaComponentParams) paramComponentParams).getHelperBean();
    NmCommandBean nmCommandBean = nmHelperBean.getNmCommandBean();

    Persistable requestObj = nmCommandBean.getPrimaryOid().getWtRef().getObject();
    WTPart wtpart = null;
    ArrayList<Object> listobj = new ArrayList<>();
    
    if (requestObj instanceof WTPart) {
        wtpart = (WTPart) requestObj;
        System.out.println("Request object is a WTPart: " + wtpart.getDisplayIdentifier());

        // Query for all versions
        QueryResult versionQuery = VersionControlHelper.service.allVersionsOf(wtpart);
        if (versionQuery.size() == 0) {
            System.out.println("No versions found for part: " + wtpart.getDisplayIdentifier());
        } else {
            System.out.println("Found " + versionQuery.size() + " versions for part: " + wtpart.getDisplayIdentifier());
        }

        Set<String> versionIdentifiers = new HashSet<>();
        while (versionQuery.hasMoreElements()) {
            Versioned versioned = (Versioned) versionQuery.nextElement();
            if (versioned instanceof WTPart) {
                WTPart versionPart = (WTPart) versioned;
                String versionIdentifier = versionPart.getVersionIdentifier().getValue();
                System.out.println("versionIdentifier: " + versionIdentifier);

                // Fetch the URL using CumminsGetDiscussionDataUtility
                CumminsGetDiscussionDataUtility discussionUtility = new CumminsGetDiscussionDataUtility();
                List<AttributeGuiComponent> topicList = (List<AttributeGuiComponent>) discussionUtility.getDataValue("col5", versionPart, null);

                // Check if there are any topics with URLs
                boolean hasValidUrl = false;
                for (AttributeGuiComponent component : topicList) {
                    if (component instanceof UrlDisplayComponent) {
                        UrlDisplayComponent urlDisplay = (UrlDisplayComponent) component;
                        String url = urlDisplay.getLink();  // Get the URL from the component
                        if (url != null && !url.isEmpty()) {
                            hasValidUrl = true;
                            break;
                        }
                    }
                }

                // If col5 URL exists and is valid, add the version part to the list
                if (hasValidUrl) {
                    if (!versionIdentifiers.add(versionIdentifier)) {
                        System.out.println("Duplicate version found: " + versionIdentifier);
                    } else {
                        listobj.add(versionPart);
                        System.out.println("Fetched version: " + versionPart.getDisplayIdentifier());
                    }
                } else {
                    System.out.println("col5 URL is empty or null for version: " + versionIdentifier);
                }
            }
        }
    } else {
        LOGGER.debug("Request object is not a WTPart.");
    }

    LOGGER.debug("Total elements fetched: " + listobj.size());
    return listobj;
}

}
