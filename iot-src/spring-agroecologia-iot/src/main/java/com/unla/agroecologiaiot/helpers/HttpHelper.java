package com.unla.agroecologiaiot.helpers;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

public class HttpHelper {

    private static HttpHeaders headers = new HttpHeaders();

    public static class Http {

        public static HttpHeaders getContentType_Json() {
            headers.setContentType(MediaType.APPLICATION_JSON);
            return headers;
        }

    }

}