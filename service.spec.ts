@Override
public ComponentConfig buildComponentConfig(ComponentParams params) throws WTException {
    LOGGER.debug("Enter >> DiscussionHistoryTableBuilder");

    ComponentConfigFactory factory = getComponentConfigFactory();
    TableConfig table = factory.newTableConfig();
    table.setLabel("Discussion History");
    table.setId("ext.cummins.part.mvc.builders.CumminsDiscussionHistoryTableBuilder");
    table.setSelectable(true);
    table.setShowCount(true);
    table.setActionModel("unsubscribed forum without delete actions");
    table.setShowCustomViewLink(false);
    table.setHelpContext("");
    table.setRowBasedObjectHandle(true);
    table.setShowCustomViewLink(true);

    // Add existing columns
    ColumnConfig col1 = factory.newColumnConfig(ICON, true);
    col1.setLabel(TYPE);
    table.addComponent(col1);

    ColumnConfig col2 = factory.newColumnConfig("versionInfo.identifier.versionId", true);
    col2.setLabel(VERSION_VIEW_DISPLAY_NAME);
    table.addComponent(col2);

    ColumnConfig col3 = factory.newColumnConfig("url", false);
    col3.setDataUtilityId("getDiscussions");
    col3.setLabel(TOPICS);
    table.addComponent(col3);

    // Add new columns for subject, message, created date, modification date
    ColumnConfig col4 = factory.newColumnConfig("subject", false);
    col4.setLabel("Subject From Forum");
    table.addComponent(col4);

    ColumnConfig col5 = factory.newColumnConfig("message", false);
    col5.setLabel("Message");
    table.addComponent(col5);

    ColumnConfig col6 = factory.newColumnConfig("createdDate", false);
    col6.setLabel("Created Date");
    table.addComponent(col6);

    ColumnConfig col7 = factory.newColumnConfig("modificationDate", false);
    col7.setLabel("Modification Date");
    table.addComponent(col7);

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

                // Fetch the URL and other details using CumminsGetDiscussionDataUtility
                CumminsGetDiscussionDataUtility discussionUtility = new CumminsGetDiscussionDataUtility();
                List<Map<String, Object>> topicList = (List<Map<String, Object>>) discussionUtility.getDataValue("col5", versionPart, null);

                // Check if there are any topics with URLs
                boolean hasValidUrl = false;
                String subject = "";
                String message = "";
                String createdDate = "";
                String modificationDate = "";

                for (Map<String, Object> topicData : topicList) {
                    UrlDisplayComponent urlDisplay = (UrlDisplayComponent) topicData.get("urlDisplay");
                    String url = urlDisplay.getLink();  // Get the URL from the component
                    subject = (String) topicData.get("subject");
                    message = (String) topicData.get("message");
                    createdDate = (String) topicData.get("createdDate");
                    modificationDate = (String) topicData.get("modificationDate");

                    if (url != null && !url.isEmpty()) {
                        hasValidUrl = true;
                        break;
                    }
                }

                // If col5 URL exists and is valid, add the version part to the list
                if (hasValidUrl) {
                    if (!versionIdentifiers.add(versionIdentifier)) {
                        System.out.println("Duplicate version found: " + versionIdentifier);
                    } else {
                        // Add the relevant details to the list for the row
                        HashMap<String, Object> row = new HashMap<>();
                        row.put("versionInfo.identifier.versionId", versionIdentifier);
                        row.put("url", message);  // Using message as the URL value
                        row.put("subject", subject);  // Subject from forum
                        row.put("message", message);  // Message
                        row.put("createdDate", createdDate);  // Created Date
                        row.put("modificationDate", modificationDate);  // Modification Date

                        listobj.add(row);
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
