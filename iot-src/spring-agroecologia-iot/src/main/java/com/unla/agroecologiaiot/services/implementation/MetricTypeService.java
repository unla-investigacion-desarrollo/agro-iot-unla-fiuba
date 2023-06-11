package com.unla.agroecologiaiot.services.implementation;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.unla.agroecologiaiot.entities.MetricType;
import com.unla.agroecologiaiot.helpers.MessageHelper.Message;
import com.unla.agroecologiaiot.models.MetricTypeModel;
import com.unla.agroecologiaiot.repositories.MetricTypeRepository;
import com.unla.agroecologiaiot.services.IMetricTypeService;

@Service("metricTypeService")
public class MetricTypeService implements IMetricTypeService {

    @Autowired
    @Qualifier("metricTypeRepository")
    private MetricTypeRepository metricTypeRepository;

    private ModelMapper modelMapper = new ModelMapper();

    @Override
    public ResponseEntity<String> getByCode(String code) {

        try {
            Optional<MetricType> metricType = metricTypeRepository.findById(code);

            if (metricType.isPresent()) {
                return Message.Ok(modelMapper.map(metricType.get(), MetricTypeModel.class));
            }
            return Message.ErrorSearchEntity();

        } catch (Exception e) {

            return Message.ErrorException(e);
        }

    }

    public ResponseEntity<String> put(MetricTypeModel metricTypeModel, String code) {
        try {
            MetricType metricType = metricTypeRepository.getById(code);

            if (metricType != null) {
                metricType.setDescription(metricTypeModel.getDescription());
                metricTypeRepository.save(metricType);

                return Message.Ok(metricType.getCode());
            }

            return Message.ErrorSearchEntity();

        } catch (Exception e) {
            return Message.ErrorException(e);
        }
    }

    public ResponseEntity<String> getAll() {
        try {
            List<MetricType> metricTypes = metricTypeRepository.findAll();

            List<MetricTypeModel> metricTypeModels = new ArrayList<MetricTypeModel>();
            for (MetricType metricType : metricTypes) {
                metricTypeModels.add(modelMapper.map(metricType, MetricTypeModel.class));
            }
            return Message.Ok(metricTypeModels);

        } catch (Exception e) {
            return Message.ErrorException(e);
        }
    }
}
