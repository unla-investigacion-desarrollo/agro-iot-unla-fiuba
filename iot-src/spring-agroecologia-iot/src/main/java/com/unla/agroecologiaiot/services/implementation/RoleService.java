package com.unla.agroecologiaiot.services.implementation;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.unla.agroecologiaiot.entities.Role;
import com.unla.agroecologiaiot.helpers.MessageHelper.Message;
import com.unla.agroecologiaiot.models.RoleModel;
import com.unla.agroecologiaiot.repositories.RoleRepository;
import com.unla.agroecologiaiot.services.IRoleService;

@Service("roleService")
public class RoleService implements IRoleService {

    @Autowired
    @Qualifier("roleRepository")
    private RoleRepository roleRepository;

    private ModelMapper modelMapper = new ModelMapper();

    @Override
    public ResponseEntity<String> getById(long id) {

        try {
            Optional<Role> role = roleRepository.findById(id);

            if (role.isPresent()) {
                return Message.Ok(modelMapper.map(role.get(), RoleModel.class));
            }
            return Message.ErrorSearchEntity();

        } catch (Exception e) {

            return Message.ErrorException(e);
        }

    }

    public ResponseEntity<String> put(RoleModel roleModel, long id) {
        try {
            Role role = roleRepository.getById(id);

            if (role != null) {
                role.setName(roleModel.getName());
                roleRepository.save(role);

                return Message.Ok(role.getRoleId());
            }

            return Message.ErrorSearchEntity();

        } catch (Exception e) {
            return Message.ErrorException(e);
        }
    }

    public ResponseEntity<String> getAll() {
        try {
            List<Role> roles = roleRepository.findAll();

            List<RoleModel> rolesModel = new ArrayList<RoleModel>();
            for (Role role : roles) {
                rolesModel.add(modelMapper.map(role, RoleModel.class));
            }
            return Message.Ok(rolesModel);

        } catch (Exception e) {
            return Message.ErrorException(e);
        }
    }
}
