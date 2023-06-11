package com.unla.agroecologiaiot.configuration;

import java.util.Optional;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.unla.agroecologiaiot.helpers.SecurityContextHelper.SecurityContext;

public class AuditorAwareImpl implements AuditorAware<Long>{
                
        @Override
        public Optional<Long> getCurrentAuditor() {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

                if (authentication == null || !authentication.isAuthenticated()) {
                 return null;
                }

                return SecurityContext.getUserIdContext();
        }
}
