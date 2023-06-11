package com.unla.agroecologiaiot.helpers;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import com.unla.agroecologiaiot.shared.paginated.PagerParameters;

public class PageHelper {

    public static final String ASCENDING = "ascend";
    public static final String DESCENDING = "descend";
    
    public static class Paged {
        public static Pageable CreatePage(PagerParameters parameters){
            Pageable page = null;

            if(!parameters.getSortField().isEmpty() && 
                (!parameters.getSortDirection().isEmpty() && parameters.getSortDirection().equals(PageHelper.ASCENDING))){
                page = PageRequest.of(parameters.getPageIndex(), parameters.getPageSize(), Sort.by(parameters.getSortField()).ascending());
             }
       
             if(!parameters.getSortField().isEmpty() && 
                (!parameters.getSortDirection().isEmpty() && parameters.getSortDirection().equals(PageHelper.DESCENDING))){
                page = PageRequest.of(parameters.getPageIndex(), parameters.getPageSize(), Sort.by(parameters.getSortField()).descending());
             }

             if(!parameters.getSortField().isEmpty() 
                && (parameters.getSortDirection().isEmpty())){
                page = PageRequest.of(parameters.getPageIndex(), parameters.getPageSize(), Sort.by(parameters.getSortField()));
             }

             return page;
        }

    }
}
