package com.unla.agroecologiaiot.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.unla.agroecologiaiot.models.RoleModel;
import com.unla.agroecologiaiot.services.IRoleService;

@RestController
@RequestMapping("api/v1/roles")
public class RolesController {

    @Autowired
    @Qualifier("roleService")
    private IRoleService roleService;

    @GetMapping("{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> get(@PathVariable long id) {
        return roleService.getById(id);
    }

    @PutMapping("{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> put(@RequestBody RoleModel roleModel, @PathVariable long id) {
        return roleService.put(roleModel, id);
    }

    @GetMapping("all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> getAll() {
        return roleService.getAll();
    }
}
