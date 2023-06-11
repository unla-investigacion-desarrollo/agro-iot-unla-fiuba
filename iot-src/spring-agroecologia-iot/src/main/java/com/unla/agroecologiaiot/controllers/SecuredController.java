package com.unla.agroecologiaiot.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/secure")
public class SecuredController {

        @GetMapping("admin")
        @PreAuthorize("hasAuthority('ADMIN')")
        public ResponseEntity<String> getAdminSecuredEndpoint() {

                return new ResponseEntity<String>(
                                "If you are seeing this, you have reached a ADMINISTRATOR secured endpoint! Your claims are: "
                                                + SecurityContextHolder.getContext().getAuthentication().getPrincipal(),
                                HttpStatus.OK);
        }

        @GetMapping("garden-manager")
        @PreAuthorize("hasAuthority('GARDEN_MANAGER')")
        public ResponseEntity<String> getGardenManagerSecuredEndpoint() {

                return new ResponseEntity<String>(
                                "If you are seeing this, you have reached a GARDEN MANAGER secured endpoint! Your claims are: "
                                                + SecurityContextHolder.getContext().getAuthentication().getPrincipal(),
                                HttpStatus.OK);
        }

        @GetMapping("visitor")
        @PreAuthorize("hasAuthority('VISITOR')")
        public ResponseEntity<String> getVisitorSecuredEndpoint() {

                return new ResponseEntity<String>(
                                "If you are seeing this, you have reached a GARDEN MANAGER secured endpoint! Your claims are: "
                                                + SecurityContextHolder.getContext().getAuthentication().getPrincipal(),
                                HttpStatus.OK);
        }

}
