package com.pxs.corporatecontact.client.salesforce;

import com.pxs.corporatecontact.client.salesforce.model.SalesForceAnswer;
import com.pxs.corporatecontact.client.salesforce.model.ServiceData;
import com.pxs.middleware.exceptions.FunctionalMiddlewareException;
import org.apache.commons.lang.StringUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class SalesForceInternalContactServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private SalesForceInternalContactService salesForceInternalContactService;

    private static final String CUSTOMER_ID = "12345";
    private static final String LIMIT = "10";

    @BeforeEach
    void setUp() {
        // Setup before each test, if needed
    }

    @Test
    void testFindCorporateContactByCustomerId_whenContactNotFound() {
        // Arrange
        String apimUrl = "http://localhost:8000/CNTCTMINT/internalcontact/V2?customerIdentifier.idContext=CDB-F&customerIdentifier.idScope-SFAPM&customerIdentifier.id=12345&limit=10";
        
        SalesForceAnswer salesForceAnswer = new SalesForceAnswer();
        salesForceAnswer.setDescription("CONTACT_NOT_FOUND");

        ResponseEntity<SalesForceAnswer> responseEntity = ResponseEntity.ok(salesForceAnswer);

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("X-Transaction-MessageId", "messageId" + System.currentTimeMillis());
        httpHeaders.add("X-Transaction-DateTimeCreated", "2025-05-02T00:00:00");

        when(restTemplate.exchange(eq(apimUrl), eq(HttpMethod.GET), any(HttpEntity.class), eq(SalesForceAnswer.class)))
                .thenReturn(responseEntity);

        // Act
        ServiceData result = salesForceInternalContactService.findCorporateContactByCustomerId(CUSTOMER_ID, LIMIT);

        // Assert
        assertNotNull(result);
        assertTrue(result.getContact().isEmpty());
        assertTrue(result.getReferenceObjects().isEmpty());

        verify(restTemplate, times(1)).exchange(eq(apimUrl), eq(HttpMethod.GET), any(HttpEntity.class), eq(SalesForceAnswer.class));
    }

    @Test
    void testFindCorporateContactByCustomerId_whenFunctionalErrorOccurs() {
        // Arrange
        String apimUrl = "http://localhost:8000/CNTCTMINT/internalcontact/V2?customerIdentifier.idContext=CDB-F&customerIdentifier.idScope-SFAPM&customerIdentifier.id=12345&limit=10";
        
        SalesForceAnswer salesForceAnswer = new SalesForceAnswer();
        salesForceAnswer.setDescription("Some functional error occurred");

        ResponseEntity<SalesForceAnswer> responseEntity = ResponseEntity.ok(salesForceAnswer);

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("X-Transaction-MessageId", "messageId" + System.currentTimeMillis());
        httpHeaders.add("X-Transaction-DateTimeCreated", "2025-05-02T00:00:00");

        when(restTemplate.exchange(eq(apimUrl), eq(HttpMethod.GET), any(HttpEntity.class), eq(SalesForceAnswer.class)))
                .thenReturn(responseEntity);

        // Act & Assert
        FunctionalMiddlewareException exception = assertThrows(FunctionalMiddlewareException.class, () -> {
            salesForceInternalContactService.findCorporateContactByCustomerId(CUSTOMER_ID, LIMIT);
        });

        assertEquals("Some functional error occurred", exception.getMessage());
    }

    @Test
    void testFindCorporateContactByCustomerId_whenValidResponse() {
        // Arrange
        String apimUrl = "http://localhost:8000/CNTCTMINT/internalcontact/V2?customerIdentifier.idContext=CDB-F&customerIdentifier.idScope-SFAPM&customerIdentifier.id=12345&limit=10";
        
        SalesForceAnswer salesForceAnswer = new SalesForceAnswer();
        salesForceAnswer.setDescription("Valid Response");

        ServiceData serviceData = new ServiceData();
        // Set valid data in serviceData

        salesForceAnswer.setServicedata(serviceData);
        ResponseEntity<SalesForceAnswer> responseEntity = ResponseEntity.ok(salesForceAnswer);

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("X-Transaction-MessageId", "messageId" + System.currentTimeMillis());
        httpHeaders.add("X-Transaction-DateTimeCreated", "2025-05-02T00:00:00");

        when(restTemplate.exchange(eq(apimUrl), eq(HttpMethod.GET), any(HttpEntity.class), eq(SalesForceAnswer.class)))
                .thenReturn(responseEntity);

        // Act
        ServiceData result = salesForceInternalContactService.findCorporateContactByCustomerId(CUSTOMER_ID, LIMIT);

        // Assert
        assertNotNull(result);
        // Add additional assertions for serviceData if necessary

        verify(restTemplate, times(1)).exchange(eq(apimUrl), eq(HttpMethod.GET), any(HttpEntity.class), eq(SalesForceAnswer.class));
    }
}
