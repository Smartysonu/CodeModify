package ext.cummins.part.mvc.builders;

import com.ptc.jca.mvc.components.JcaComponentParams;
import com.ptc.mvc.components.*;
import com.ptc.netmarkets.util.beans.NmCommandBean;
import com.ptc.netmarkets.util.beans.NmHelperBean;
import static com.ptc.core.components.descriptor.DescriptorConstants.ColumnIdentifiers.ICON;
import ext.cummins.part.CumminsPartConstantIF;
import ext.cummins.utils.CumminsUtils;
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

@ComponentBuilder("ext.cummins.part.mvc.builders.PartVersionTable")
public class PartVersionTable extends AbstractComponentBuilder {
    private static final String CLASSNAME = PartVersionTable.class.getName();
    private static final Logger LOGGER = LogManager.getLogger(CLASSNAME);
    private static final String TYPE = "Type";
    private static final String VERSION = "Version";
    private static final String COMMENTS = "Comments";
    private static final String VERSION_VIEW_DISPLAY_NAME = "Version";

    @Override
    public ComponentConfig buildComponentConfig(ComponentParams params) throws WTException {
        LOGGER.debug("Enter >> PartVersionTable");
        ComponentConfigFactory factory = getComponentConfigFactory();

        // Define the table
        TableConfig table = factory.newTableConfig();
        table.setLabel("Part Versions");
        table.setId("ext.cummins.part.mvc.builders.PartVersionTable");
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

        ColumnConfig col3 = factory.newColumnConfig(COMMENTS, true);
        col3.setLabel(COMMENTS);
        table.addComponent(col3);

        LOGGER.debug("End >> PartVersionTable");
        return table;
    }

    @Override
    public Object buildComponentData(ComponentConfig config, ComponentParams paramComponentParams) throws WTException, IOException {
        NmHelperBean nmHelperBean = ((JcaComponentParams) paramComponentParams).getHelperBean();
        NmCommandBean nmCommandBean = nmHelperBean.getNmCommandBean();

        // Get the primary object (WTPart)
        Persistable requestObj = nmCommandBean.getPrimaryOid().getWtRef().getObject();
        WTPart wtpart = null;
        ArrayList<WTPart> listobj = new ArrayList<>();

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

            // Iterate through the result to fetch part versions
            while (versionQuery.hasMoreElements()) {
                Versioned versioned = (Versioned) versionQuery.nextElement();
                if (versioned instanceof WTPart) {
                    WTPart versionPart = (WTPart) versioned;
                    listobj.add(versionPart);
                    LOGGER.debug("Fetched version: " + versionPart.getDisplayIdentifier());
                }
            }
        } else {
            LOGGER.debug("Request object is not a WTPart.");
        }

        // Log the final number of parts fetched
        LOGGER.debug("Total versions fetched: " + listobj.size());

        // Return the list of versions as the data for the table
        return listobj;
    }
}
