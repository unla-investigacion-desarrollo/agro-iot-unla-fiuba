package com.unla.agroecologiaiot.services.implementation;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.unla.agroecologiaiot.entities.ApplicationUser;
import com.unla.agroecologiaiot.entities.MetricAcceptationRange;
import com.unla.agroecologiaiot.entities.MetricType;
import com.unla.agroecologiaiot.entities.Sector;
import com.unla.agroecologiaiot.helpers.FilterHelper.Filter;
import com.unla.agroecologiaiot.helpers.MessageHelper.Message;
import com.unla.agroecologiaiot.helpers.ModelMapperHelper.MappingHelper;
import com.unla.agroecologiaiot.helpers.PageHelper.Paged;
import com.unla.agroecologiaiot.models.MetricAcceptationRangeModel;
import com.unla.agroecologiaiot.repositories.ApplicationUserRepository;
import com.unla.agroecologiaiot.repositories.GardenRepository;
import com.unla.agroecologiaiot.repositories.MetricAcceptationRangeRepository;
import com.unla.agroecologiaiot.repositories.MetricTypeRepository;
import com.unla.agroecologiaiot.repositories.SectorRepository;
import com.unla.agroecologiaiot.services.IMetricAcceptationRangeService;
import com.unla.agroecologiaiot.shared.paginated.PagerParametersModel;
import com.unla.agroecologiaiot.shared.paginated.PaginatedList;
import com.unla.agroecologiaiot.shared.paginated.especification.FilterRequest;
import com.unla.agroecologiaiot.shared.paginated.SearchEspecification;
import com.unla.agroecologiaiot.shared.paginated.especification.FieldType;
import com.unla.agroecologiaiot.shared.paginated.PagerParameters;

@Service("metricAcceptationRangeService")
public class MetricAcceptationRangeService implements IMetricAcceptationRangeService {
    private ModelMapper modelMapper = new ModelMapper();

    @Autowired
    @Qualifier("metricAcceptationRangeRepository")
    private MetricAcceptationRangeRepository metricAcceptationRangeRepository;

    @Autowired
    @Qualifier("sectorRepository")
    private SectorRepository sectorRepository;

    @Autowired
    @Qualifier("applicationUserRepository")
    private ApplicationUserRepository applicationUserRepository;

    @Autowired
    @Qualifier("metricTypeRepository")
    private MetricTypeRepository metricTypeRepository;

    @Autowired
    @Qualifier("gardenRepository")
    private GardenRepository gardenRepository;

    @Override
    public ResponseEntity<String> saveOrUpdate(MetricAcceptationRangeModel model, long idOwner) {
        try {
            if (!(model.getStartValue() >= 0 && model.getEndValue() <= 100)) {
                return Message.ErrorValidation();
            }

            Optional<MetricAcceptationRange> dbMetricAcceptationRange = metricAcceptationRangeRepository
                    .findByName(model.getName());

            if (dbMetricAcceptationRange.isPresent()) {
                return Message.ErrorValidation();
            }

            ApplicationUser user = applicationUserRepository.getById(idOwner);

            if (user == null) {
                return Message.ErrorValidation();
            }

            MetricType metricType = metricTypeRepository.findByCode(model.getMetricTypeCode());

            if (metricType == null) {
                return Message.ErrorValidation();
            }

            model.setMetricAcceptationRangeId(0);
            MetricAcceptationRange metricAcceptationRange = modelMapper.map(model, MetricAcceptationRange.class);
            metricAcceptationRange.setOwner(user);
            metricAcceptationRange.setMetricType(metricType);

            long response = metricAcceptationRangeRepository.save(metricAcceptationRange).getMetricAcceptationRangeId();

            return Message.Ok(response);

        } catch (Exception e) {
            return Message.ErrorException(e);
        }
    }

    @Override
    public ResponseEntity<String> getGardenList(long userId, long gardenId, boolean isAdmin) {
        try {

            if (gardenId != 0 && isAdmin) {

                var garden = gardenRepository.findById(gardenId);

                if (!garden.isPresent())
                    return Message.ErrorSearchEntity("No se encontró la huerta");

                return Message.Ok(MappingHelper.mapList(
                        metricAcceptationRangeRepository.findByOwnerUserIdAndIsDeleted(
                                garden.get().getOwner().getUserId(), false),
                        MetricAcceptationRangeModel.class));

            } else {

                return Message
                        .Ok(MappingHelper.mapList(metricAcceptationRangeRepository.findByOwnerUserIdAndIsDeleted(userId,
                                false), MetricAcceptationRangeModel.class));

            }

        } catch (Exception e) {
            return Message.ErrorException(e);
        }
    }

    @Override
    public ResponseEntity<String> put(MetricAcceptationRangeModel model, long id) {
        try {
            MetricAcceptationRange metricAcceptationRange = metricAcceptationRangeRepository.getById(id);

            if (metricAcceptationRange == null) {
                return Message.ErrorSearchEntity();
            }

            metricAcceptationRange.setName(model.getName());
            metricAcceptationRange.setStartValue(model.getStartValue());
            metricAcceptationRange.setEndValue(model.getEndValue());

            long response = metricAcceptationRangeRepository.save(metricAcceptationRange).getMetricAcceptationRangeId();

            return Message.Ok(response);

        } catch (Exception e) {
            return Message.ErrorException(e);
        }
    }

    @Override
    public ResponseEntity<String> delete(long id) {
        try {
            Optional<MetricAcceptationRange> metricAcceptationRange = metricAcceptationRangeRepository
                    .findByMetricAcceptationRangeIdAndIsDeleted(id, false);

            if (!metricAcceptationRange.isPresent()) {
                return Message.ErrorSearchEntity();
            }

            metricAcceptationRange.get().setDeleted(true);

            for (Sector sector : metricAcceptationRange.get().getSectors()) {
                sector.setMetricAcceptationRanges(
                        sector.getMetricAcceptationRanges().stream().filter(sectorMetric -> sectorMetric
                                .getMetricAcceptationRangeId() != metricAcceptationRange.get()
                                        .getMetricAcceptationRangeId())
                                .collect(Collectors.toSet()));
            }

            metricAcceptationRangeRepository.save(metricAcceptationRange.get());

            return Message.Ok(true);

        } catch (Exception e) {
            return Message.ErrorException(e);
        }
    }

    @Override
    public ResponseEntity<String> getById(long id, boolean isAdmin, long userId) {
        try {
            Optional<MetricAcceptationRange> metricAcceptationRange = metricAcceptationRangeRepository
                    .findByMetricAcceptationRangeIdAndIsDeleted(id, false);

            if (metricAcceptationRange.isPresent()) {

                if (rangeAccessIsValid(metricAcceptationRange.get(), isAdmin, userId)) {
                    MetricAcceptationRangeModel metricAcceptationRangeModel = modelMapper.map(metricAcceptationRange,
                            MetricAcceptationRangeModel.class);
                    return Message.Ok(metricAcceptationRangeModel);
                }
            }
            return Message.ErrorSearchEntity();

        } catch (Exception e) {
            return Message.ErrorException(e);
        }
    }

    @Override
    public ResponseEntity<String> getList(PagerParametersModel pageParametersModel, boolean isAdmin, long idUser) {
        try {
            PagerParameters pageParameters = modelMapper.map(pageParametersModel, PagerParameters.class);

            if (pageParameters.getPageSize() == 0) {
                pageParameters.setPageSize(10);
            }

            Pageable page = Paged.CreatePage(pageParameters);

            if (page == null) {
                return Message.ErrorValidation();
            }

            PaginatedList<MetricAcceptationRangeModel> paginatedList = new PaginatedList<>();
            List<FilterRequest> filters = new ArrayList<FilterRequest>();
            filters.add(Filter.AddFilterPropertyEqual("isDeleted", false, FieldType.BOOLEAN));

            if (!isAdmin) {
                filters.add(Filter.AddFilterPropertyEqual("owner", idUser, FieldType.LONG));
            }

            pageParameters.setFilters(filters);
            SearchEspecification<MetricAcceptationRange> especification = new SearchEspecification<>(pageParameters);
            Page<MetricAcceptationRange> dbMetricAcceptationRange = metricAcceptationRangeRepository
                    .findAll(especification, page);

            List<MetricAcceptationRangeModel> metricAcceptationRangeModels = new ArrayList<MetricAcceptationRangeModel>();

            for (MetricAcceptationRange metricAcceptationRange : dbMetricAcceptationRange.toList()) {
                MetricAcceptationRangeModel metricAcceptationRangeModel = modelMapper.map(metricAcceptationRange,
                        MetricAcceptationRangeModel.class);
                metricAcceptationRangeModels.add(metricAcceptationRangeModel);
            }

            paginatedList.setList(metricAcceptationRangeModels);
            paginatedList.setCount(dbMetricAcceptationRange.getTotalElements());
            paginatedList.setIndex(dbMetricAcceptationRange.getNumber());

            return Message.Ok(paginatedList);

        } catch (Exception e) {
            return Message.ErrorException(e);
        }
    }

    private boolean rangeAccessIsValid(MetricAcceptationRange acceptationRange, boolean isAdmin, long idUser) {
        return isAdmin || acceptationRange.getOwner().getUserId() == idUser;
    }
}
