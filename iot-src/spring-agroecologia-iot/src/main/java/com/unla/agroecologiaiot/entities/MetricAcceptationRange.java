package com.unla.agroecologiaiot.entities;

import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.ForeignKey;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "metricAcceptationRange")
@EntityListeners(AuditingEntityListener.class)
public class MetricAcceptationRange extends AuditableEntity<Long> {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long metricAcceptationRangeId;

    private String name;

    @Column(precision = 2)
    private Double startValue;

    @Column(precision = 2)
    private Double endValue;

    @ManyToMany(mappedBy = "metricAcceptationRanges")
    private Set<Sector> sectors;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ownerUserId", nullable = false, foreignKey = @ForeignKey(name = "FK_MetricAcceptationRange_User"))
    private ApplicationUser owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "metricTypeId", nullable = false, foreignKey = @ForeignKey(name = "FK_MetricAcceptationRange_MetricType"))
    private MetricType metricType;
}
