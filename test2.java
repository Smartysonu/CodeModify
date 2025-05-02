@Test
void testFindCorporateContactByCustomerId_NullResponse() {
    // Arrange
    String customerId = "12345";
    String limit = "10";

    // Mock the RestTemplate response to return null
    Mockito.when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(SalesForceAnswer.class)))
            .thenReturn(null);

    // Act & Assert
    assertThrows(NullPointerException.class, () -> 
        salesForceInternalContactService.findCorporateContactByCustomerId(customerId, limit)
    );
}
@Test
void testFindCorporateContactByCustomerId_Timeout() {
    // Arrange
    String customerId = "12345";
    String limit = "10";

    // Mock the RestTemplate to throw an exception (simulating a timeout)
    Mockito.when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(SalesForceAnswer.class)))
            .thenThrow(new ResourceAccessException("Timeout occurred"));

    // Act & Assert
    assertThrows(ResourceAccessException.class, () -> 
        salesForceInternalContactService.findCorporateContactByCustomerId(customerId, limit)
    );
}
@Test
void testFindCorporateContactByCustomerId_InvalidUrl() {
    // Arrange
    String customerId = "12345";
    String limit = "10";

    // Simulate an invalid URL by using an incorrect base URL
    String invalidUrl = "http://invalid-url";
    salesForceInternalContactService = new SalesForceInternalContactService(invalidUrl, restTemplate);

    // Act & Assert
    assertThrows(MalformedURLException.class, () -> 
        salesForceInternalContactService.findCorporateContactByCustomerId(customerId, limit)
    );
}
