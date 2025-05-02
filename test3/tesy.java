@Test
void testBlankDescription() {
    // Arrange
    SalesForceAnswer answer = new SalesForceAnswer();
    answer.setDescription(""); // blank description
    
    // Mocking the ServiceData that will be returned when the description is blank
    ServiceData serviceData = new ServiceData();
    serviceData.setContact(Collections.emptyList()); // Ensuring contact is empty
    serviceData.setReferenceObjects(Collections.emptyList()); // Ensuring reference objects are empty

    answer.setServicedata(serviceData); // Setting ServiceData in the mock response

    String customerId = "12345";
    String limit = "10";

    // Mock the RestTemplate response to return the SalesForceAnswer with a blank description and valid ServiceData
    when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(SalesForceAnswer.class)))
            .thenReturn(ResponseEntity.ok(answer));

    // Act
    ServiceData result = salesForceInternalContactService.findCorporateContactByCustomerId(customerId, limit);

    // Assert that the result is not null
    assertNotNull(result, "The result should not be null");

    // Assert that the returned ServiceData has empty contact and referenceObjects
    assertTrue(result.getContact().isEmpty(), "Contact list should be empty");
    assertTrue(result.getReferenceObjects().isEmpty(), "Reference objects list should be empty");
}

@Test
void testContactNotFoundDescription() {
    // Arrange
    SalesForceAnswer answer = new SalesForceAnswer();
    answer.setDescription("CONTACT_NOT_FOUND"); // description equals "CONTACT_NOT_FOUND"
    
    // Mocking the ServiceData that will be returned when the description is "CONTACT_NOT_FOUND"
    ServiceData serviceData = new ServiceData();
    serviceData.setContact(Collections.emptyList()); // Ensuring contact is empty
    serviceData.setReferenceObjects(Collections.emptyList()); // Ensuring reference objects are empty

    answer.setServicedata(serviceData); // Setting ServiceData in the mock response

    String customerId = "12345";
    String limit = "10";

    // Mock the RestTemplate response to return the SalesForceAnswer with "CONTACT_NOT_FOUND" description
    when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(SalesForceAnswer.class)))
            .thenReturn(ResponseEntity.ok(answer));

    // Act
    ServiceData result = salesForceInternalContactService.findCorporateContactByCustomerId(customerId, limit);

    // Assert that the result is not null
    assertNotNull(result, "The result should not be null");

    // Assert that the returned ServiceData has empty contact and referenceObjects
    assertTrue(result.getContact().isEmpty(), "Contact list should be empty");
    assertTrue(result.getReferenceObjects().isEmpty(), "Reference objects list should be empty");
}

@Test
void testFunctionalMiddlewareException() {
    // Arrange
    SalesForceAnswer answer = new SalesForceAnswer();
    answer.setDescription("Some error occurred"); // description is not blank or "CONTACT_NOT_FOUND"
    
    // Mocking the ServiceData that will be returned
    ServiceData serviceData = new ServiceData(); // This will not be used, since an exception will be thrown
    answer.setServicedata(serviceData); // Setting ServiceData in the mock response

    String customerId = "12345";
    String limit = "10";

    // Mock the RestTemplate response to return the SalesForceAnswer with a description that is neither blank nor "CONTACT_NOT_FOUND"
    when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(SalesForceAnswer.class)))
            .thenReturn(ResponseEntity.ok(answer));

    // Act & Assert
    FunctionalMiddlewareException ex = assertThrows(FunctionalMiddlewareException.class, 
            () -> salesForceInternalContactService.findCorporateContactByCustomerId(customerId, limit));

    // Assert that the exception message contains the description (i.e., "Some error occurred")
    assertNotNull(ex.getMessage());
    assertTrue(ex.getMessage().contains("Some error occurred"));
}
