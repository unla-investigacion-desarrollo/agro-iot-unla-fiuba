package com.unla.agroecologiaiot.services;

import org.springframework.http.ResponseEntity;

import com.unla.agroecologiaiot.models.GardenModel;
import com.unla.agroecologiaiot.models.MetricReadingModel;
import com.unla.agroecologiaiot.shared.paginated.PagerParametersModel;

public interface IGardenService {

    public ResponseEntity<String> saveOrUpdate(GardenModel model, long idOwner);

    public ResponseEntity<String> saveMetricReading(MetricReadingModel model);

    public ResponseEntity<String> put(GardenModel model, long id);

    public ResponseEntity<String> delete(long id);

    public ResponseEntity<String> getById(long id, boolean isAdmin, long userId);

    public ResponseEntity<String> getBasicInfo(long id, boolean isAdmin, long idUser);

    public ResponseEntity<String> getSectorsMetricData(long id, boolean isAdmin, long idUser);

    public ResponseEntity<String> getList(PagerParametersModel pageParameters, boolean isAdmin, long idUser);
}
