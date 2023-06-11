package com.unla.agroecologiaiot.filters;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.unla.agroecologiaiot.helpers.JsonParse.JsonParser;
import com.unla.agroecologiaiot.constants.Constants;
import com.unla.agroecologiaiot.constants.SecurityConstants;
import com.unla.agroecologiaiot.entities.ApplicationUser;
import com.unla.agroecologiaiot.entities.Session;
import com.unla.agroecologiaiot.models.auth.LoginDTO;
import com.unla.agroecologiaiot.models.auth.LoginResponse;
import com.unla.agroecologiaiot.models.auth.ProfileDTO;
import com.unla.agroecologiaiot.repositories.ApplicationUserRepository;
import com.unla.agroecologiaiot.repositories.SessionRepository;
import com.unla.agroecologiaiot.services.ITokenService;

import org.springframework.security.core.userdetails.User;

public class AuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private AuthenticationManager authenticationManager;
    private ApplicationUserRepository applicationUserRepository;
    private SessionRepository sessionRepository;
    private ITokenService tokenService;

    public AuthenticationFilter(AuthenticationManager authenticationManager,
            ApplicationUserRepository applicationUserRepository, SessionRepository sessionRepository, ITokenService tokenService) {
        this.authenticationManager = authenticationManager;
        this.applicationUserRepository = applicationUserRepository;
        this.sessionRepository = sessionRepository;
        this.tokenService = tokenService;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest req, HttpServletResponse res)
            throws AuthenticationException {

        try {
            LoginDTO user = new ObjectMapper().readValue(req.getInputStream(), LoginDTO.class);
            return authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest req, HttpServletResponse res, FilterChain chain,
            Authentication auth) throws IOException, ServletException {

        Date exp = new Date(System.currentTimeMillis() + SecurityConstants.EXPIRATION_TIME);

        ApplicationUser validatedUser = applicationUserRepository
                .findByUsernameAndFetchRoleEagerly(((User) auth.getPrincipal()).getUsername()).get();

        String token = tokenService.createToken(validatedUser, exp);

        Session session = Session.builder()
                .token(token)
                .isActive(true)
                .issuedAt(LocalDateTime.now())
                .expiresAt(exp.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime())
                .user(validatedUser)
                .build();

        sessionRepository.save(session);

        ProfileDTO profile = ProfileDTO.builder().username(validatedUser.getUsername()).name(validatedUser.getName())
                .surname(validatedUser.getSurname()).roleCode(validatedUser.getRole().getCode()).build();

        // Create response which will be stored in Web App
        LoginResponse response = new LoginResponse(token, profile,
                exp.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime().toString());
        // Set custom servlet response
        res.setStatus(HttpServletResponse.SC_OK);
        res.setContentType(Constants.ContentTypes.APPLICATION_JSON);
        res.getWriter().print(JsonParser.toJson(response));
        res.getWriter().flush();
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest req, HttpServletResponse res,
            AuthenticationException e) throws IOException, ServletException {

        res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        res.setContentType(Constants.ContentTypes.APPLICATION_JSON);
        res.getWriter().print(JsonParser.toJson("Revise sus credenciales"));
        res.getWriter().flush();
    }
}
