package com.unla.agroecologiaiot.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import com.unla.agroecologiaiot.shared.paginated.PagerParametersModel;
import com.unla.agroecologiaiot.helpers.SecurityContextHelper.SecurityContext;
import com.unla.agroecologiaiot.models.GardenModel;
import com.unla.agroecologiaiot.models.MetricReadingModel;
import com.unla.agroecologiaiot.services.IGardenService;

@RestController
@RequestMapping("api/v1/gardens")
public class GardenController {

    @Autowired
    @Qualifier("gardenService")
    private IGardenService gardenService;

    @PostMapping("")
    @PreAuthorize("hasAuthority('ADMIN')" + "|| hasAuthority('GARDEN_MANAGER')")
    public ResponseEntity<String> post(@RequestBody GardenModel model) {
        return gardenService.saveOrUpdate(model, SecurityContext.getUserIdContext().get());
    }

    @PostMapping("metric-readings")
    public ResponseEntity<String> postMetricsReadings(@RequestBody MetricReadingModel model) {
        return gardenService.saveMetricReading(model);
    }

    @PutMapping("{id}")
    @PreAuthorize("hasAuthority('ADMIN')" + "|| hasAuthority('GARDEN_MANAGER')")
    public ResponseEntity<String> put(@RequestBody GardenModel model, @PathVariable long id) {
        return gardenService.put(model, id);
    }

    @GetMapping("{id}")
    @PreAuthorize("hasAuthority('ADMIN')" + "|| hasAuthority('GARDEN_MANAGER')")
    public ResponseEntity<String> get(@PathVariable long id) {
        var userId = SecurityContext.getUserIdContext().get();
        var isAdmin = SecurityContext.getRoleContext().getCode().equals("ADMIN");
        return gardenService.getById(id, isAdmin, userId);
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasAuthority('ADMIN')" + "|| hasAuthority('GARDEN_MANAGER')")
    public ResponseEntity<String> delete(@PathVariable long id) {
        return gardenService.delete(id);
    }

    @GetMapping("")
    @PreAuthorize("hasAuthority('ADMIN')" + "|| hasAuthority('GARDEN_MANAGER')")
    public ResponseEntity<String> getList(PagerParametersModel pageParameters) {
        boolean isAdmin = SecurityContext.getRoleContext().getCode().equals("ADMIN");
        return gardenService.getList(pageParameters, isAdmin, SecurityContext.getUserIdContext().get());
    }

    @GetMapping("{id}/basic-info")
    @PreAuthorize("hasAuthority('ADMIN')" + "|| hasAuthority('GARDEN_MANAGER')")
    public ResponseEntity<String> getBasicInfo(@PathVariable long id) {

        boolean isAdmin = SecurityContext.getRoleContext().getCode().equals("ADMIN");
        long userId = SecurityContext.getUserIdContext().get();

        return gardenService.getBasicInfo(id, isAdmin, userId);
    }

    @GetMapping("{id}/sectors-metric-data")
    @PreAuthorize("hasAuthority('ADMIN')" + "|| hasAuthority('GARDEN_MANAGER')")
    public ResponseEntity<String> getSectorsMetricData(@PathVariable long id) {

        boolean isAdmin = SecurityContext.getRoleContext().getCode().equals("ADMIN");
        long userId = SecurityContext.getUserIdContext().get();

        return gardenService.getSectorsMetricData(id, isAdmin, userId);
    }
}
