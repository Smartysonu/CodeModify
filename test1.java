package com.pxs.corporatecontact.client.salesforce;

import com.pxs.corporatecontact.client.salesforce.model.SalesForceAnswer;
import com.pxs.corporatecontact.client.salesforce.model.ServiceData;
import com.pxs.middleware.exceptions.FunctionalMiddlewareException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SalesForceInternalContactServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private SalesForceInternalContactService service;

    private String customerId;
    private String limit;

    @BeforeEach
    void setUp() {
        customerId = "12345";
        limit = "10";
    }

    @Test
    void testSuccessResponse() {
        ServiceData mockServiceData = ServiceData.builder()
                .contact(Collections.emptyList())
                .referenceObjects(Collections.emptyList())
                .build();

        SalesForceAnswer answer = new SalesForceAnswer();
        answer.setDescription("Valid");
        answer.setServicedata(mockServiceData);

        when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(SalesForceAnswer.class)))
                .thenReturn(ResponseEntity.ok(answer));

        ServiceData result = service.findCorporateContactByCustomerId(customerId, limit);

        assertNotNull(result);
        assertEquals(mockServiceData, result);
    }

    @Test
    void testContactNotFound() {
        SalesForceAnswer answer = new SalesForceAnswer();
        answer.setDescription("CONTACT_NOT_FOUND");

        ServiceData emptyData = ServiceData.builder()
                .contact(Collections.emptyList())
                .referenceObjects(Collections.emptyList())
                .build();
        answer.setServicedata(emptyData);

        when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(SalesForceAnswer.class)))
                .thenReturn(ResponseEntity.ok(answer));

        ServiceData result = service.findCorporateContactByCustomerId(customerId, limit);

        assertNotNull(result);
        assertTrue(result.getContact().isEmpty());
        assertTrue(result.getReferenceObjects().isEmpty());
    }

    @Test
    void testFunctionalError() {
        SalesForceAnswer answer = new SalesForceAnswer();
        answer.setDescription("Something went wrong");

        when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(SalesForceAnswer.class)))
                .thenReturn(ResponseEntity.ok(answer));

        FunctionalMiddlewareException ex = assertThrows(FunctionalMiddlewareException.class,
                () -> service.findCorporateContactByCustomerId(customerId, limit));

        assertEquals("Something went wrong", ex.getMessage());
    }

    @Test
    void testNullResponseBody() {
        when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(SalesForceAnswer.class)))
                .thenReturn(ResponseEntity.ok(null));

        FunctionalMiddlewareException ex = assertThrows(FunctionalMiddlewareException.class,
                () -> service.findCorporateContactByCustomerId(customerId, limit));

        assertNotNull(ex.getMessage());
    }

    @Test
    void testBlankDescription() {
        SalesForceAnswer answer = new SalesForceAnswer();
        answer.setDescription(""); // blank description

        when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(SalesForceAnswer.class)))
                .thenReturn(ResponseEntity.ok(answer));

        FunctionalMiddlewareException ex = assertThrows(FunctionalMiddlewareException.class,
                () -> service.findCorporateContactByCustomerId(customerId, limit));

        assertNotNull(ex.getMessage());
    }
}
