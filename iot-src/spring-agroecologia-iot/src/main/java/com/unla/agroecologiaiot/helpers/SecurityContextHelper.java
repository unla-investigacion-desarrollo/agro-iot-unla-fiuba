package com.unla.agroecologiaiot.helpers;

import java.util.Map;
import java.util.Optional;

import org.springframework.security.core.context.SecurityContextHolder;

import com.unla.agroecologiaiot.entities.Role;

public class SecurityContextHelper {
    public static class SecurityContext {

        public static Role getRoleContext() {
            return (Role) SecurityContextHolder.getContext().getAuthentication().getAuthorities().toArray()[0];
        }

        @SuppressWarnings("unchecked")
        public static Optional<Long> getUserIdContext() {
            var principal = ((Map<String, String>) SecurityContextHolder.getContext().getAuthentication().getPrincipal());
            return Optional.of(Long.parseLong(principal.get("sub")));
        }
    }
}
