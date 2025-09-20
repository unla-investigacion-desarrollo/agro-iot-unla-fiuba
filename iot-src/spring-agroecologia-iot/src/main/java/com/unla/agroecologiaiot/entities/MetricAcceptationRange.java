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
import javax.persistence.OneToMany;
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
    
    @Column(name = "description")
    private String description;

    @Column(name = "ta_start_value", precision = 2)
    private Double taStartValue;

    @Column(name = "ta_end_value", precision = 2)
    private Double taEndValue;

    @Column(name = "hr_start_value", precision = 2)
    private Double hrStartValue;

    @Column(name = "hr_end_value", precision = 2)
    private Double hrEndValue;

    @Column(name = "hs_start_value", precision = 2)
    private Double hsStartValue;

    @Column(name = "hs_end_value", precision = 2)
    private Double hsEndValue;

    @OneToMany(mappedBy = "metricAcceptationRange", fetch = FetchType.LAZY)
    private Set<Sector> sectors;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ownerUserId", nullable = false, foreignKey = @ForeignKey(name = "FK_MetricAcceptationRange_User"))
    private ApplicationUser owner;

    //@ManyToOne(fetch = FetchType.LAZY)
    //@JoinColumn(name = "metricTypeId", nullable = false, foreignKey = @ForeignKey(name = "FK_MetricAcceptationRange_MetricType"))
    //private MetricType metricType;

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        MetricAcceptationRange other = (MetricAcceptationRange) obj;
        if (name == null) {
            if (other.name != null)
                return false;
        } else if (!name.equals(other.name))
            return false;
        if (description == null) {
            if (other.description != null)
                return false;
        } else if (!description.equals(other.description))
            return false;
        if (taStartValue == null) {
            if (other.taStartValue != null)
                return false;
        } else if (!taStartValue.equals(other.taStartValue))
            return false;
        if (taEndValue == null) {
            if (other.taEndValue != null)
                return false;
        } else if (!taEndValue.equals(other.taEndValue))
            return false;
        if (hrStartValue == null) {
            if (other.hrStartValue != null)
                return false;
        } else if (!hrStartValue.equals(other.hrStartValue))
            return false;
        if (hrEndValue == null) {
            if (other.hrEndValue != null)
                return false;
        } else if (!hrEndValue.equals(other.hrEndValue))
            return false;
        if (hsStartValue == null) {
            if (other.hsStartValue != null)
                return false;
        } else if (!hsStartValue.equals(other.hsStartValue))
            return false;
        if (hsEndValue == null) {
            if (other.hsEndValue != null)
                return false;
        } else if (!hsEndValue.equals(other.hsEndValue))
            return false;
        return true;
    }
}
