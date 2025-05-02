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

    // Discussion Link (col3)
    ColumnConfig col3 = factory.newColumnConfig("url", false);  // Use this for URL display
    col3.setDataUtilityId("getDiscussions");
    col3.setLabel("Discussion Link");
    table.addComponent(col3);

    // Subject (col4)
    ColumnConfig col4 = factory.newColumnConfig("subject", false);
    col4.setDataUtilityId("getDiscussions");
    col4.setLabel("Subject");
    table.addComponent(col4);

    // Message (col5)
    ColumnConfig col5 = factory.newColumnConfig("message", false); // Display message
    col5.setDataUtilityId("getDiscussions");
    col5.setLabel("Message");
    table.addComponent(col5);

    // Created Date (col6)
    ColumnConfig col6 = factory.newColumnConfig("createdDate", false);
    col6.setDataUtilityId("getDiscussions");
    col6.setLabel("Created Date");
    table.addComponent(col6);

    // Modification Date (col7)
    ColumnConfig col7 = factory.newColumnConfig("modificationDate", false);
    col7.setDataUtilityId("getDiscussions");
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

                // Fetch the data from CumminsGetDiscussionDataUtility
                CumminsGetDiscussionDataUtility discussionUtility = new CumminsGetDiscussionDataUtility();
                List<List<String>> topicList = (List<List<String>>) discussionUtility.getDataValue("col5", versionPart, null);

                // Process the data and add it to listobj
                for (List<String> topicData : topicList) {
                    String url = topicData.get(0);  // URL for Discussion Link
                    String subject = topicData.get(1);  // Subject
                    String message = topicData.get(2);  // Message
                    String createdDate = topicData.get(3);  // Created Date
                    String modificationDate = topicData.get(4);  // Modification Date

                    // Add data to row for this topic
                    HashMap<String, Object> row = new HashMap<>();
                    row.put("url", url);  // URL for Discussion Link
                    row.put("subject", subject);  // Subject
                    row.put("message", message);  // Message
                    row.put("createdDate", createdDate);  // Created Date
                    row.put("modificationDate", modificationDate);  // Modification Date

                    listobj.add(row);
                    System.out.println("Fetched version: " + versionPart.getDisplayIdentifier());
                }
            }
        }
    } else {
        LOGGER.debug("Request object is not a WTPart.");
    }

    LOGGER.debug("Total elements fetched: " + listobj.size());
    return listobj;
}
