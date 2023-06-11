package com.unla.agroecologiaiot.repositories;

import org.springframework.stereotype.Repository;

import com.unla.agroecologiaiot.entities.MetricAcceptationRange;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository("metricAcceptationRangeRepository")
public interface MetricAcceptationRangeRepository
                extends JpaRepository<MetricAcceptationRange, Long>, JpaSpecificationExecutor<MetricAcceptationRange> {

        public abstract Optional<MetricAcceptationRange> findByName(String name);

        public abstract Optional<MetricAcceptationRange> findByMetricAcceptationRangeIdAndIsDeleted(
                        long metricAcceptationRangeId, boolean isDeleted);

        @Query("SELECT c FROM MetricAcceptationRange c JOIN FETCH c.sectors s WHERE c.metricAcceptationRangeId = (:id) and c.isDeleted = false")
        public abstract MetricAcceptationRange findByIdAndFetchSectorsEagerly(@Param("id") long id);

        public abstract List<MetricAcceptationRange> findByOwnerUserIdAndIsDeleted(long ownerUserId, boolean isDeleted);
}
