package com.unla.agroecologiaiot.services;

import org.springframework.http.ResponseEntity;
import com.unla.agroecologiaiot.models.MetricAcceptationRangeModel;
import com.unla.agroecologiaiot.shared.paginated.PagerParametersModel;

public interface IMetricAcceptationRangeService {

    public ResponseEntity<String> saveOrUpdate(MetricAcceptationRangeModel model, long idOwner);

    public ResponseEntity<String> put(MetricAcceptationRangeModel model, long id);

    public ResponseEntity<String> delete(long id);

    public ResponseEntity<String> getById(long id, boolean isAdmin, long userId);

    public ResponseEntity<String> getList(PagerParametersModel pageParametersModel, boolean isAdmin, long idUser);

    public ResponseEntity<String> getGardenList(long userId, long gardenId, boolean isAdmin);
}
