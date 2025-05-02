@Test
void testBlankDescription() {
    // Arrange
    SalesForceAnswer answer = new SalesForceAnswer();
    answer.setDescription(""); // blank description

    String customerId = "12345";
    String limit = "10";

    // Mock the RestTemplate response to return the SalesForceAnswer with a blank description
    when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(SalesForceAnswer.class)))
            .thenReturn(ResponseEntity.ok(answer));

    // Act
    ServiceData result = salesForceInternalContactService.findCorporateContactByCustomerId(customerId, limit);

    // Assert that the returned ServiceData has empty contact and referenceObjects, as no exception should be thrown
    assertNotNull(result);
    assertTrue(result.getContact().isEmpty(), "Contact list should be empty");
    assertTrue(result.getReferenceObjects().isEmpty(), "Reference objects list should be empty");
}
