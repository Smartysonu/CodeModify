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
import wt.workflow.forum.DiscussionForum;
import wt.workflow.forum.DiscussionTopic;
import wt.workflow.forum.ForumHelper;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

@ComponentBuilder("ext.cummins.part.mvc.builders.TestDiscussionTable")
public class TestDiscussionTable extends AbstractComponentBuilder {
    private static final String CLASSNAME = TestDiscussionTable.class.getName();
    private static final Logger LOGGER = LogManager.getLogger(CLASSNAME);
    private static final String TYPE = "Type";
    private static final String VERSION = "Version";
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

        ColumnConfig col2 = factory.newColumnConfig(VERSION, true);
        col2.setLabel(VERSION);
        table.addComponent(col2);

        ColumnConfig col3 = factory.newColumnConfig(TOPICS, true);
        col3.setLabel(TOPICS);
        table.addComponent(col3);

        ColumnConfig col4 = factory.newColumnConfig(COMMENTS, true);
        col4.setLabel(COMMENTS);
        table.addComponent(col4);

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
        ArrayList<Map<String, String>> discussionData = new ArrayList<>();

        // Process only if the request object is a WTPart
        if (requestObj instanceof WTPart) {
            wtpart = (WTPart) requestObj;

            LOGGER.debug("Request object is a WTPart: " + wtpart.getDisplayIdentifier());

            // Fetch all versions of the WTPart using VersionControlHelper
            QueryResult versionQuery = VersionControlHelper.service.allVersionsOf(wtpart);

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

                    // Add the version to the map (e.g., Version ID)
                    Map<String, String> rowData = new HashMap<>();
                    rowData.put(VERSION_VIEW_DISPLAY_NAME, versionPart.getVersionInfo().getVersionId()); // Fetching version ID

                    // Fetch discussion forums related to this part version
                    Enumeration forums = ForumHelper.service.getForums(versionPart);
                    while (forums.hasMoreElements()) {
                        DiscussionForum forum = (DiscussionForum) forums.nextElement();
                        Enumeration topics = ForumHelper.service.getTopics(forum);

                        // Iterate through each topic
                        while (topics.hasMoreElements()) {
                            DiscussionTopic topic = (DiscussionTopic) topics.nextElement();
                            Enumeration messages = ForumHelper.service.getPostings(topic);

                            // Iterate through the messages in the topic
                            while (messages.hasMoreElements()) {
                                // Fetch the discussion message (you can retrieve more details here if needed)
                                rowData.put(TOPICS, topic.getName());
                                rowData.put(COMMENTS, "Discussion content for " + topic.getName());  // Mockup: Replace with real message content

                                // Add the data to the list for each version/topic combination
                                discussionData.add(rowData); 
                                LOGGER.debug("Fetched discussion: " + rowData);
                            }
                        }
                    }
                    LOGGER.debug("Fetched version: " + versionPart.getDisplayIdentifier());
                }
            }
        } else {
            LOGGER.debug("Request object is not a WTPart.");
        }

        // Log the final number of discussions fetched
        LOGGER.debug("Total discussions fetched: " + discussionData.size());

        // Return the discussion data for the table
        return discussionData;
    }
}
