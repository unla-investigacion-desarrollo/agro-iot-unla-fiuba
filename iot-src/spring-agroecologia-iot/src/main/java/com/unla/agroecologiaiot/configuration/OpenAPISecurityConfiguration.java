package com.unla.agroecologiaiot.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityScheme.Type;

@Configuration
@OpenAPIDefinition(info = @Info(title = "Agroecologia IoT API", version = "1.0"))
public class OpenAPISecurityConfiguration {

        @Bean
        public OpenAPI customizeOpenAPI() {
                final String securitySchemeName = "bearerAuth";
                return new OpenAPI()
                                .addSecurityItem(new SecurityRequirement()
                                                .addList(securitySchemeName))
                                .components(new Components().addSecuritySchemes(securitySchemeName,
                                                new SecurityScheme().name(securitySchemeName)
                                                                .type(Type.HTTP)
                                                                .scheme("bearer")
                                                                .bearerFormat("JWT")));

        }
}