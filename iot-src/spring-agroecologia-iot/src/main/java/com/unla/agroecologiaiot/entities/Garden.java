package com.unla.agroecologiaiot.entities;

import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ForeignKey;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "garden")
@EntityListeners(AuditingEntityListener.class)
public class Garden extends AuditableEntity<Long>{
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long gardenId;

    private String name;
    private String description;
    private String location;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ownerUserId", nullable = false, foreignKey = @ForeignKey(name = "FK_Garden_User"))
    private ApplicationUser owner;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "garden")
    private Set<Sector> sectors;

}
