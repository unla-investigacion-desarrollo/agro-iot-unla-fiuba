package com.unla.agroecologiaiot.entities;

import java.util.Set;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "sector")
@EntityListeners(AuditingEntityListener.class)
public class Sector extends AuditableEntity<Long> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long sectorId;
    private String name;
    private String centralizerKey;
    private String crops;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gardenId", nullable = false, foreignKey = @ForeignKey(name = "FK_Garden_Sector"))
    @JsonBackReference
    private Garden garden;

    @ManyToOne
    @JoinColumn(name = "metricAcceptationRangeId", nullable = false, foreignKey = @ForeignKey(name = "FK_Sector_MetricAcceptationRange"))
    private MetricAcceptationRange metricAcceptationRange;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "sector")
    @OrderBy("readingDate ASC")
    @JsonManagedReference
    private Set<MetricReading> metricReadings;
}
