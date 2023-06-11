package com.unla.agroecologiaiot.models.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@ToString
public class LoginResponse {

    private String token;
    private ProfileDTO profile;
    public String expiration;

}
