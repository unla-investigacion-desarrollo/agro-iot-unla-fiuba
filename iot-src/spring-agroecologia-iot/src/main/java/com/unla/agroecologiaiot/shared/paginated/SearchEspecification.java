package com.unla.agroecologiaiot.shared.paginated;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.data.jpa.domain.Specification;

import com.unla.agroecologiaiot.shared.paginated.especification.FilterRequest;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class SearchEspecification<T> implements Specification<T> {

    private final transient PagerParameters request;

    @Override
    public Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
        Predicate predicate = cb.equal(cb.literal(Boolean.TRUE), Boolean.TRUE);

        for (FilterRequest filter : this.request.getFilters()) {
            predicate = filter.getOperator().build(root, cb, filter, predicate);
        }

        return predicate;
    }
}