package com.pxs.corporatecontact.client.salesforce;

import com.pxs.corporatecontact.client.salesforce.model.SalesForceAnswer;
import com.pxs.corporatecontact.client.salesforce.model.ServiceData;
import com.pxs.middleware.exceptions.FunctionalMiddlewareException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.Mockito;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;

class SalesForceInternalContactServiceTest {

    @InjectMocks
    private SalesForceInternalContactService salesForceInternalContactService;

    @Mock
    private RestTemplate restTemplate;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testFindCorporateContactByCustomerId_Success() {
        // Arrange
        String customerId = "12345";
        String limit = "10";
        SalesForceAnswer salesForceAnswer = new SalesForceAnswer();
        ServiceData serviceData = new ServiceData();
        salesForceAnswer.setServicedata(serviceData);
        ResponseEntity<SalesForceAnswer> responseEntity = ResponseEntity.ok(salesForceAnswer);

        // Mock the RestTemplate response
        Mockito.when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(SalesForceAnswer.class)))
                .thenReturn(responseEntity);

        // Act
        ServiceData result = salesForceInternalContactService.findCorporateContactByCustomerId(customerId, limit);

        // Assert
        assertNotNull(result);
        assertEquals(serviceData, result);
    }

    @Test
    void testFindCorporateContactByCustomerId_ContactNotFound() {
        // Arrange
        String customerId = "12345";
        String limit = "10";
        SalesForceAnswer salesForceAnswer = new SalesForceAnswer();
        salesForceAnswer.setDescription("CONTACT_NOT_FOUND");
        salesForceAnswer.setServicedata(null);
        ResponseEntity<SalesForceAnswer> responseEntity = ResponseEntity.ok(salesForceAnswer);

        // Mock the RestTemplate response
        Mockito.when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(SalesForceAnswer.class)))
                .thenReturn(responseEntity);

        // Act
        ServiceData result = salesForceInternalContactService.findCorporateContactByCustomerId(customerId, limit);

        // Assert
        assertNotNull(result);
        assertTrue(result.getContact().isEmpty());
        assertTrue(result.getReferenceObjects().isEmpty());
    }

    @Test
    void testFindCorporateContactByCustomerId_FunctionalError() {
        // Arrange
        String customerId = "12345";
        String limit = "10";
        SalesForceAnswer salesForceAnswer = new SalesForceAnswer();
        salesForceAnswer.setDescription("Some error occurred");
        ResponseEntity<SalesForceAnswer> responseEntity = ResponseEntity.ok(salesForceAnswer);

        // Mock the RestTemplate response
        Mockito.when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(SalesForceAnswer.class)))
                .thenReturn(responseEntity);

        // Act & Assert
        FunctionalMiddlewareException thrown = assertThrows(FunctionalMiddlewareException.class, () ->
                salesForceInternalContactService.findCorporateContactByCustomerId(customerId, limit)
        );

        assertEquals("Some error occurred", thrown.getMessage());
    }
}
