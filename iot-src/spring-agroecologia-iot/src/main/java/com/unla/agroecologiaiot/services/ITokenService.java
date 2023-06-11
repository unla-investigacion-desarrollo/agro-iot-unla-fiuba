package com.unla.agroecologiaiot.services;

import java.util.Date;

import org.springframework.http.ResponseEntity;

import com.unla.agroecologiaiot.entities.ApplicationUser;
import java.time.LocalDateTime;
import io.jsonwebtoken.Claims;

public interface ITokenService {
    
    public String createToken(ApplicationUser user, Date exp);
    public Claims createClaims(ApplicationUser user);
    public ResponseEntity<String> refreshToken(Date exp, LocalDateTime dateExpires, String oldToken);
}
