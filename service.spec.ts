@Override
public Object buildComponentData(ComponentConfig config, ComponentParams paramComponentParams) throws WTException, IOException {
    NmHelperBean nmHelperBean = ((JcaComponentParams) paramComponentParams).getHelperBean();
    NmCommandBean nmCommandBean = nmHelperBean.getNmCommandBean();

    Persistable requestObj = nmCommandBean.getPrimaryOid().getWtRef().getObject();
    WTPart wtpart = null;
    ArrayList<Map<String, String>> discussionData = new ArrayList<>();

    if (requestObj instanceof WTPart) {
        wtpart = (WTPart) requestObj;
        LOGGER.debug("Request object is a WTPart: " + wtpart.getDisplayIdentifier());

        // Query to fetch all versions of the WTPart
        QueryResult versionQuery = VersionControlHelper.service.allVersionsOf(wtpart);

        // Check if there are versions for the part
        if (versionQuery.size() == 0) {
            LOGGER.debug("No versions found for part: " + wtpart.getDisplayIdentifier());
        } else {
            LOGGER.debug("Found " + versionQuery.size() + " versions for part: " + wtpart.getDisplayIdentifier());
        }

        // Fetch forums associated with the part
        Enumeration<?> forums = ForumHelper.service.getForums(wtpart);

        // Iterate through the versions, forums, topics, and comments
        while (versionQuery.hasMoreElements()) {
            Versioned versioned = (Versioned) versionQuery.nextElement();
            if (versioned instanceof WTPart) {
                WTPart versionPart = (WTPart) versioned;
                String versionId = versionPart.getVersionIdentifier().getValue();  // Get version ID
                LOGGER.debug("Version ID: " + versionId);

                // Iterate through forums for each version
                while (forums.hasMoreElements()) {
                    DiscussionForum forum = (DiscussionForum) forums.nextElement();
                    Enumeration<?> topics = ForumHelper.service.getTopics(forum);

                    // Iterate through each topic and fetch the comments (postings)
                    while (topics.hasMoreElements()) {
                        DiscussionTopic topic = (DiscussionTopic) topics.nextElement();
                        Enumeration<?> messages = ForumHelper.service.getPostings(topic);

                        // Collect the discussions for the topic and version
                        while (messages.hasMoreElements()) {
                            DiscussionPosting posting = (DiscussionPosting) messages.nextElement();

                            // Prepare the data for the table row
                            Map<String, String> rowData = new HashMap<>();
                            rowData.put(VERSION_VIEW_DISPLAY_NAME, versionId);  // Add version ID
                            rowData.put(TOPICS, topic.getName());  // Add topic name
                            rowData.put(COMMENTS, posting.getText());  // Add the comment content (assuming getText is used)

                            // Add the rowData to the list for each version/topic/posting
                            discussionData.add(rowData);
                            LOGGER.debug("Fetched discussion: " + rowData);
                        }
                    }
                }
            }
        }
    } else {
        LOGGER.debug("Request object is not a WTPart.");
    }

    LOGGER.debug("Total discussions fetched: " + discussionData.size());
    return discussionData;
}
