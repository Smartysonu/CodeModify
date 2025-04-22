package ext.cummins.part.mvc.builders;

import com.ptc.jca.mvc.components.JcaComponentParams;
import com.ptc.mvc.components.*;
import com.ptc.netmarkets.util.beans.NmCommandBean;
import com.ptc.netmarkets.util.beans.NmHelperBean;
import static com.ptc.core.components.descriptor.DescriptorConstants.ColumnIdentifiers.ICON;
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
import wt.vc.config.LatestConfigSpec;
import java.io.IOException;
import java.util.ArrayList;

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

        // Define the table
        TableConfig table = factory.newTableConfig();
        table.setLabel("Discussion History");
        table.setId("ext.cummins.part.mvc.builders.TestDiscussionTable");
        table.setSelectable(false);
        table.setShowCount(true);
        table.setActionModel("");

        // Set columns for the table
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

        // Get the primary object (WTPart)
        Persistable requestObj = nmCommandBean.getPrimaryOid().getWtRef().getObject();
        WTPart wtpart = null;
        ArrayList<WTObject> listobj = new ArrayList<>();
        QueryResult result = new QueryResult();

        // Process only if the request object is a WTPart
        if (requestObj instanceof WTPart) {
            wtpart = (WTPart) requestObj;
            LOGGER.debug("Request object is a WTPart: " + wtpart.getDisplayIdentifier());

            // Find upstream equivalent parts
            result = WTAssociativityHelper.service.findUpstreamEquivalent(wtpart);
            
            // Apply LatestConfigSpec processing if needed
            LatestConfigSpec configSpec = new LatestConfigSpec();
            result = configSpec.process(result);

            // Log the size of the result set
            LOGGER.debug("Size of the QueryResult: " + result.size());

            // If no results, log the message
            if (result.size() == 0) {
                LOGGER.debug("No upstream equivalent parts found for part: " + wtpart.getDisplayIdentifier());
            } else {
                LOGGER.debug("Found " + result.size() + " upstream equivalent parts.");
            }

            // Iterate through the result to fetch parts
            while (result.hasMoreElements()) {
                WTPart upstreamwtpart = (WTPart) result.nextElement();
                listobj.add(upstreamwtpart);
                LOGGER.debug("Fetched part: " + upstreamwtpart.getDisplayIdentifier());
            }
        } else {
            LOGGER.debug("Request object is not a WTPart.");
        }

        // Log the final number of parts fetched
        LOGGER.debug("Total parts fetched: " + listobj.size());

        // Return the list of parts as the data for the table
        return listobj;
    }
}
