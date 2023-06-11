package com.unla.agroecologiaiot.controllers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.unla.agroecologiaiot.helpers.SecurityContextHelper;
import com.unla.agroecologiaiot.models.ApplicationUserModel;
import com.unla.agroecologiaiot.services.IApplicationUserService;
import com.unla.agroecologiaiot.shared.paginated.PagerParametersModel;

@RestController
@RequestMapping("api/v1/users")
public class UserController {

    @Autowired
    @Qualifier("applicationUserService")
    private IApplicationUserService applicationUserService;

    @PostMapping("")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> post(@RequestBody ApplicationUserModel model) {
        return applicationUserService.saveOrUpdate(model);
    }

    @PutMapping("{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> put(@RequestBody ApplicationUserModel model, @PathVariable long id) {
        return applicationUserService.put(model, id);
    }

    @GetMapping("{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> get(@PathVariable long id) {
        return applicationUserService.getById(id);
    }

    @GetMapping("username")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> get(@RequestParam String username) {
        return applicationUserService.getByUsername(username);
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> delete(@PathVariable long id) {
        return applicationUserService.delete(id);
    }

    @GetMapping("")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> getList(PagerParametersModel pageParameters) {
        Optional<Long> userId = SecurityContextHelper.SecurityContext.getUserIdContext();
        return applicationUserService.getList(pageParameters, userId);
    }

    @GetMapping("role/{roleId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> getListByRoleId(@PathVariable long roleId) {
        return applicationUserService.getListByRoleId(roleId);
    }
}
