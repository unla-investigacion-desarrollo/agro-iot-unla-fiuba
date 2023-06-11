package com.unla.agroecologiaiot.constants;

public class SecurityConstants {

    public static final String SIGN_UP_URL = "/api/v1/users";
    public static final String SECRET = "w9z$B&E)H@McQfTjWnZr4u7x!A%D*F-JaNdRgUkXp2s5v8y/B?E(H+KbPeShVmYq"; // allkeysgenerator.com
    public static final String AUTHORIZATION_HEADER_NAME = "Authorization";
    public static final Long EXPIRATION_TIME = 1000L * 60 * 60 * 24; // 24 hours

    public static final String LOGIN_URL = "/api/v1/auth/login";
    public static final String REFRESH_TOKEN_URL = "/api/v1/auth/refreshtoken";
    public static final String SIGN_UP = "api/v1/users";
    public static final String METRIC_READINGS = "/api/v1/gardens/metric-readings";
    public static final String INTERNO = "/api/v1/auth/internoPost";

    public static final String[] SWAGGER_URL_WHITELIST = {
            "/v3/api-docs/**",
            "/swagger-ui/**"
    };

    public static class CustomSecurityClaims {

        public static final String ROLE = "role";
        public static final String EMAIL = "email";
        public static final String USERNAME = "username";

    }

}
