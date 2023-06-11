package com.unla.agroecologiaiot.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;

import com.unla.agroecologiaiot.helpers.SecurityContextHelper.SecurityContext;
import com.unla.agroecologiaiot.models.MetricAcceptationRangeModel;
import com.unla.agroecologiaiot.services.IMetricAcceptationRangeService;
import com.unla.agroecologiaiot.shared.paginated.PagerParametersModel;

@RestController
@RequestMapping("api/v1/metric-acceptation-ranges")
public class MetricAcceptationRangeController {

    @Autowired
    @Qualifier("metricAcceptationRangeService")
    private IMetricAcceptationRangeService metricAcceptationRangeService;

    @GetMapping("")
    @PreAuthorize("hasAuthority('ADMIN')" + "|| hasAuthority('GARDEN_MANAGER')")
    public ResponseEntity<String> getList(PagerParametersModel pageParameters) {
        boolean isAdmin = SecurityContext.getRoleContext().getCode().equals("ADMIN")
                ? true
                : false;
        return metricAcceptationRangeService.getList(pageParameters, isAdmin, SecurityContext.getUserIdContext().get());
    }

    @GetMapping("garden")
    @PreAuthorize("hasAuthority('ADMIN')" + "|| hasAuthority('GARDEN_MANAGER')")
    public ResponseEntity<String> getGardenList(Long gardenId) {
        var userId = SecurityContext.getUserIdContext().get();
        var isAdmin = SecurityContext.getRoleContext().getCode().equals("ADMIN");

        return metricAcceptationRangeService.getGardenList(userId, gardenId, isAdmin);

    }

    @PostMapping("")
    @PreAuthorize("hasAuthority('ADMIN')" + "|| hasAuthority('GARDEN_MANAGER')")
    public ResponseEntity<String> post(@RequestBody MetricAcceptationRangeModel model) {
        return metricAcceptationRangeService.saveOrUpdate(model, SecurityContext.getUserIdContext().get());
    }

    @PutMapping("{id}")
    @PreAuthorize("hasAuthority('ADMIN')" + "|| hasAuthority('GARDEN_MANAGER')")
    public ResponseEntity<String> put(@RequestBody MetricAcceptationRangeModel model, @PathVariable long id) {
        return metricAcceptationRangeService.put(model, id);
    }

    @GetMapping("{id}")
    @PreAuthorize("hasAuthority('ADMIN')" + "|| hasAuthority('GARDEN_MANAGER')")
    public ResponseEntity<String> get(@PathVariable long id) {
        var userId = SecurityContext.getUserIdContext().get();
        var isAdmin = SecurityContext.getRoleContext().getCode().equals("ADMIN");

        return metricAcceptationRangeService.getById(id, isAdmin, userId);
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasAuthority('ADMIN')" + "|| hasAuthority('GARDEN_MANAGER')")
    public ResponseEntity<String> delete(@PathVariable long id) {
        return metricAcceptationRangeService.delete(id);
    }

}
