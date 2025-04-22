package ext.cummins.part.mvc.builders;

import com.ptc.jca.mvc.components.JcaComponentParams;
import com.ptc.mvc.components.*;
import com.ptc.netmarkets.util.beans.NmCommandBean;
import com.ptc.netmarkets.util.beans.NmHelperBean;
import static com.ptc.core.components.descriptor.DescriptorConstants.ColumnIdentifiers.ICON;
import wt.fc.Persistable;
import wt.fc.QueryResult;
import wt.fc.WTObject;
import wt.log4j.LogManager;
import wt.log4j.Logger;
import wt.part.WTPart;
import wt.util.WTException;
import wt.vc.VersionControlHelper;
import wt.vc.Versioned;
import java.io.IOException;
import java.util.ArrayList;

@ComponentBuilder("ext.cummins.part.mvc.builders.PartVersionDiscussionTable")
public class PartVersionDiscussionTable extends AbstractComponentBuilder {
    private static final String CLASSNAME = PartVersionDiscussionTable.class.getName();
    private static final Logger LOGGER = LogManager.getLogger(CLASSNAME);
    private static final String TYPE = "Type";
    private static final String VERSION = "Version";
    private static final String TOPIC = "Topic";
    private static final String DISCUSSION = "Discussion";
    private static final String VERSION_VIEW_DISPLAY_NAME = "Version";

    @Override
    public ComponentConfig buildComponentConfig(ComponentParams params) throws WTException {
        LOGGER.debug("Enter >> PartVersionDiscussionTable");
        ComponentConfigFactory factory = getComponentConfigFactory();

        // Define the table
        TableConfig table = factory.newTableConfig();
        table.setLabel("Part Versions & Discussions");
        table.setId("ext.cummins.part.mvc.builders.PartVersionDiscussionTable");
        table.setSelectable(false);
        table.setShowCount(true);
        table.setActionModel("");

        // Set columns for the table
        ColumnConfig col1 = factory.newColumnConfig(ICON, true);
        col1.setLabel(TYPE);
        table.addComponent(col1);

        ColumnConfig col2 = factory.newColumnConfig(VERSION, true);
        col2.setLabel(VERSION);
        table.addComponent(col2);

        ColumnConfig col3 = factory.newColumnConfig(TOPIC, true);
        col3.setLabel(TOPIC);
        table.addComponent(col3);

        ColumnConfig col4 = factory.newColumnConfig(DISCUSSION, true);
        col4.setLabel(DISCUSSION);
        table.addComponent(col4);

        LOGGER.debug("End >> PartVersionDiscussionTable");
        return table;
    }

    @Override
    public Object buildComponentData(ComponentConfig config, ComponentParams paramComponentParams) throws WTException, IOException {
        NmHelperBean nmHelperBean = ((JcaComponentParams) paramComponentParams).getHelperBean();
        NmCommandBean nmCommandBean = nmHelperBean.getNmCommandBean();

        // Get the primary object (WTPart)
        Persistable requestObj = nmCommandBean.getPrimaryOid().getWtRef().getObject();
        WTPart wtpart = null;
        ArrayList<Object[]> listobj = new ArrayList<>();

        // Process only if the request object is a WTPart
        if (requestObj instanceof WTPart) {
            wtpart = (WTPart) requestObj;
            LOGGER.debug("Request object is a WTPart: " + wtpart.getDisplayIdentifier());

            // Fetch all versions of the WTPart using VersionControlHelper
            QueryResult versionQuery = VersionControlHelper.service.allVersions(wtpart);

            // Check if any versions are found
            if (versionQuery.size() == 0) {
                LOGGER.debug("No versions found for part: " + wtpart.getDisplayIdentifier());
            } else {
                LOGGER.debug("Found " + versionQuery.size() + " versions for part: " + wtpart.getDisplayIdentifier());
            }

            // Iterate through the result to fetch part versions and associated discussions
            while (versionQuery.hasMoreElements()) {
                Versioned versioned = (Versioned) versionQuery.nextElement();
                if (versioned instanceof WTPart) {
                    WTPart versionPart = (WTPart) versioned;

                    // Retrieve the version ID for the part version
                    String versionId = versionPart.getVersionInfo().getVersionId(); // Fetching Version ID

                    // Retrieve the topic and discussion for this part version using Windchill's existing relationships
                    String topic = getTopicFromVersion(versionPart);  // Get the actual topic based on part version
                    String discussion = getDiscussionFromVersion(versionPart);  // Get the actual discussion for the part version

                    // Add the version, topic, and discussion to the list
                    listobj.add(new Object[]{versionPart.getDisplayIdentifier(), versionId, topic, discussion});
                    LOGGER.debug("Fetched version: " + versionPart.getDisplayIdentifier());
                }
            }
        } else {
            LOGGER.debug("Request object is not a WTPart.");
        }
     
        // Log the final number of versions fetched
        LOGGER.debug("Total versions and discussions fetched: " + listobj.size());

        // Return the list of versions, topics, and discussions as the data for the table
        return listobj;
    }

   // String topic = getTopicFromRelatedObject(versionPart);
//String discussion = getDiscussionFromRelatedObject(versionPart);

    // Method to get the topic for a version (replace with actual logic to get topics)
    private String getTopicFromVersion(WTPart versionPart) {
        // Replace with actual logic to get the topic associated with the part version
        return "Topic for version " + versionPart.getDisplayIdentifier();
    }

    // Method to get the discussion for a version (replace with actual logic to get discussions)
    private String getDiscussionFromVersion(WTPart versionPart) {
        // Replace with actual logic to get the discussion associated with the part version
        return "Discussion for version " + versionPart.getDisplayIdentifier();
    }
}
