package com.unla.agroecologiaiot.repositories;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.unla.agroecologiaiot.entities.Garden;

@Repository("gardenRepository")
public interface GardenRepository extends JpaRepository<Garden, Long>, JpaSpecificationExecutor<Garden> {

    public abstract Optional<Garden> findByName(String name);

    public abstract Optional<Garden> findByGardenIdAndIsDeleted(long gardenId,
            boolean isDeleted);
}
