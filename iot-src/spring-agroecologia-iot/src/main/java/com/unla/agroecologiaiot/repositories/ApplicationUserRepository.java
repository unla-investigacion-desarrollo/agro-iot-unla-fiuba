package com.unla.agroecologiaiot.repositories;

import java.util.List;
import java.util.Optional;

// import org.springframework.data.domain.Page;
// import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.unla.agroecologiaiot.entities.ApplicationUser;

@Repository("applicationUserRepository")
public interface ApplicationUserRepository extends JpaRepository<ApplicationUser, Long>, JpaSpecificationExecutor<ApplicationUser> {

    public abstract Optional<ApplicationUser> findByUsername(String username);

    @Query("SELECT u FROM ApplicationUser u JOIN FETCH u.role where u.userId = (:id) and u.isDeleted = false")
    public abstract Optional<ApplicationUser> findByIdAndFetchRoleEagerly(@Param("id") long id);

    @Query("SELECT u FROM ApplicationUser u JOIN FETCH u.role where u.username = (:username) and u.isDeleted = false")
    public abstract Optional<ApplicationUser> findByUsernameAndFetchRoleEagerly(@Param("username") String username);

    @Query("SELECT u FROM ApplicationUser u JOIN FETCH u.role r where r.roleId = (:id) and u.isDeleted = false")
    public abstract List<ApplicationUser> findAllUsersByRoleId(@Param("id") long id);

    
    //Forma de busqueda filtrado 1
    // Page<ApplicationUser> findByUsernameContaining(String username, Pageable pageable);

}
