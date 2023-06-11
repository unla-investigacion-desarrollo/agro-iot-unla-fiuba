package com.unla.agroecologiaiot.entities;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.FetchType;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "applicationuser")
@EntityListeners(AuditingEntityListener.class)
public class ApplicationUser extends AuditableEntity<Long> implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long userId;

    private String username;
    private String password;

    private String name;
    private String surname;
    private String email;

    private boolean enabled;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "roleId", nullable = false, foreignKey = @ForeignKey(name = "FK_User_Role"))
    private Role role;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "owner")
    private Set<Garden> garden;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "owner")
    private Set<MetricAcceptationRange> metricAcceptationRanges;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        var authorities = new HashSet<Role>();
        authorities.add(role);
        return authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

}
