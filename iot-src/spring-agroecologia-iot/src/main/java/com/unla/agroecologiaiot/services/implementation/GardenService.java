package com.unla.agroecologiaiot.services.implementation;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.unla.agroecologiaiot.constants.Constants;
import com.unla.agroecologiaiot.entities.ApplicationUser;
import com.unla.agroecologiaiot.entities.Garden;
import com.unla.agroecologiaiot.entities.MetricAcceptationRange;
import com.unla.agroecologiaiot.entities.MetricReading;
import com.unla.agroecologiaiot.entities.MetricType;
import com.unla.agroecologiaiot.entities.Sector;
import com.unla.agroecologiaiot.helpers.FilterHelper.Filter;
import com.unla.agroecologiaiot.helpers.MessageHelper.Message;
import com.unla.agroecologiaiot.models.GardenBasicInfoModel;
import com.unla.agroecologiaiot.models.GardenModel;
import com.unla.agroecologiaiot.models.MetricReadingDTOModel;
import com.unla.agroecologiaiot.models.MetricReadingModel;
import com.unla.agroecologiaiot.models.ReadingModel;
import com.unla.agroecologiaiot.models.SectorBasicDataModel;
import com.unla.agroecologiaiot.models.SectorMetricDataModel;
import com.unla.agroecologiaiot.models.SectorMetricRangeModel;
import com.unla.agroecologiaiot.models.SectorModel;
import com.unla.agroecologiaiot.repositories.ApplicationUserRepository;
import com.unla.agroecologiaiot.repositories.GardenRepository;
import com.unla.agroecologiaiot.repositories.MetricAcceptationRangeRepository;
import com.unla.agroecologiaiot.repositories.MetricReadingRepository;
import com.unla.agroecologiaiot.repositories.MetricTypeRepository;
import com.unla.agroecologiaiot.repositories.SectorRepository;
import com.unla.agroecologiaiot.services.IGardenService;
import com.unla.agroecologiaiot.shared.paginated.PagerParameters;
import com.unla.agroecologiaiot.shared.paginated.PagerParametersModel;
import com.unla.agroecologiaiot.shared.paginated.PaginatedList;
import com.unla.agroecologiaiot.shared.paginated.SearchEspecification;
import com.unla.agroecologiaiot.shared.paginated.especification.FieldType;
import com.unla.agroecologiaiot.shared.paginated.especification.FilterRequest;
import com.unla.agroecologiaiot.helpers.ModelMapperHelper.MappingHelper;
import com.unla.agroecologiaiot.helpers.PageHelper.Paged;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service("gardenService")
public class GardenService implements IGardenService {
    private ModelMapper modelMapper = new ModelMapper();

    @Autowired
    @Qualifier("gardenRepository")
    private GardenRepository gardenRepository;

    @Autowired
    @Qualifier("applicationUserRepository")
    private ApplicationUserRepository applicationUserRepository;

    @Autowired
    @Qualifier("sectorRepository")
    private SectorRepository sectorRepository;

    @Autowired
    @Qualifier("metricAcceptationRangeRepository")
    private MetricAcceptationRangeRepository metricAcceptationRangeRepository;

    @Autowired
    @Qualifier("metricReadingRepository")
    private MetricReadingRepository metricReadingRepository;

    @Autowired
    @Qualifier("metricTypeRepository")
    private MetricTypeRepository metricTypeRepository;

    @Override
    public ResponseEntity<String> saveOrUpdate(GardenModel model, long idOwner) {
        try {
            Optional<Garden> dbGarden = gardenRepository.findByName(model.getName());

            if (dbGarden.isPresent()) {
                return Message.ErrorValidation();
            }

            ApplicationUser user = applicationUserRepository.getById(idOwner);

            if (user == null) {
                return Message.ErrorValidation();
            }

            model.setGardenId(0);
            Garden garden = modelMapper.map(model, Garden.class);
            garden.setOwner(user);

            long response = gardenRepository.save(garden).getGardenId();

            Garden gardenInserted = gardenRepository.getById(response);

            List<Sector> sectors = MappingHelper.mapList(model.getSectors(), Sector.class);
            for (Sector sector : sectors) {
                sector.setGarden(gardenInserted);

                var metricAcceptationRanges = metricAcceptationRangeRepository
                        .findAllById(sector.getMetricAcceptationRangeIds());
                sector.setMetricAcceptationRanges(Set.copyOf(metricAcceptationRanges));
            }

            sectorRepository.saveAll(sectors);

            return Message.Ok(response);

        } catch (Exception e) {
            return Message.ErrorException(e);
        }
    }

    @Override
    public ResponseEntity<String> put(GardenModel model, long id) {
        try {
            Garden garden = gardenRepository.getById(id);

            if (garden == null) {
                return Message.ErrorSearchEntity();
            }

            garden.setSectors(null);
            garden.setDescription(model.getDescription());
            garden.setName(model.getName());
            garden.setLocation(model.getLocation());

            Garden insertedGarden = gardenRepository.save(garden);
            long response = insertedGarden.getGardenId();

            List<Sector> sectors = MappingHelper.mapList(model.getSectors(), Sector.class);

            for (Sector sector : sectors) {
                sector.setGarden(garden);
                var metricAcceptationRanges = metricAcceptationRangeRepository
                        .findAllById(sector.getMetricAcceptationRangeIds());
                sector.setMetricAcceptationRanges(Set.copyOf(metricAcceptationRanges));
            }

            var currentSectors = sectorRepository.findByGarden(insertedGarden);

            if (!currentSectors.isEmpty()) {
                var idsToKeep = sectors.stream().filter(sector -> sector.getSectorId() > 0)
                        .map(sector -> sector.getSectorId()).collect(Collectors.toList());

                for (var sector : currentSectors) {
                    if (!idsToKeep.contains(sector.getSectorId())) {
                        sector.setDeleted(true);
                    }
                }

                sectors.addAll(currentSectors);
            }

            sectorRepository.saveAll(sectors);

            return Message.Ok(response);

        } catch (Exception e) {
            return Message.ErrorException(e);
        }
    }

    @Override
    public ResponseEntity<String> delete(long id) {
        try {
            Garden garden = gardenRepository.getById(id);
            List<Sector> sectors = sectorRepository.findByGarden(garden);

            if (garden == null || sectors == null) {
                return Message.ErrorSearchEntity();
            }

            garden.setDeleted(true);
            gardenRepository.save(garden);

            for (Sector sector : sectors) {
                sector.setDeleted(true);
                sector.setMetricAcceptationRanges(null);
            }

            sectorRepository.saveAll(sectors);

            return Message.Ok(true);

        } catch (Exception e) {
            return Message.ErrorException(e);
        }
    }

    @Override
    public ResponseEntity<String> getById(long id, boolean isAdmin, long userId) {
        try {
            Optional<Garden> garden = gardenRepository.findByGardenIdAndIsDeleted(id, false);

            if (garden.isPresent()) {

                if (gardenAccessIsValid(garden.get(), isAdmin, userId)) {

                    GardenModel gardenModel = modelMapper.map(garden, GardenModel.class);

                    List<Sector> sectorsList = new ArrayList<>(garden.get().getSectors()).stream()
                            .filter(sector -> !sector.isDeleted()).collect(Collectors.toList());
                    gardenModel.setSectors(MappingHelper.mapList(sectorsList, SectorModel.class));

                    // Set MetricAcceptationRangeIds into Model
                    for (SectorModel sectorModel : gardenModel.getSectors()) {

                        var metricAcceptationRanges = sectorsList.stream()
                                .filter(sector -> sector.getSectorId() == sectorModel.getSectorId()).findAny().get()
                                .getMetricAcceptationRanges();

                        sectorModel.setMetricAcceptationRangeIds(metricAcceptationRanges.stream()
                                .flatMap(x -> Stream.of(x.getMetricAcceptationRangeId()))
                                .collect(Collectors.toList()));
                    }
                    return Message.Ok(gardenModel);
                }
            }

            return Message.ErrorSearchEntity();

        } catch (

        Exception e) {
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

            PaginatedList<GardenModel> paginatedList = new PaginatedList<>();
            List<FilterRequest> filters = new ArrayList<FilterRequest>();
            filters.add(Filter.AddFilterPropertyEqual("isDeleted", false, FieldType.BOOLEAN));

            if (!isAdmin) {
                filters.add(Filter.AddFilterPropertyEqual("owner", idUser, FieldType.LONG));
            }

            pageParameters.setFilters(filters);
            SearchEspecification<Garden> especification = new SearchEspecification<>(pageParameters);
            Page<Garden> dbGarden = gardenRepository.findAll(especification, page);

            List<GardenModel> gardenModels = new ArrayList<GardenModel>();

            for (Garden garden : dbGarden.toList()) {
                GardenModel gardenModel = modelMapper.map(garden, GardenModel.class);

                List<Sector> sectorsList = new ArrayList<>(garden.getSectors());
                gardenModel.setSectors(MappingHelper.mapList(sectorsList, SectorModel.class));

                gardenModels.add(gardenModel);
            }

            paginatedList.setList(gardenModels);
            paginatedList.setCount(dbGarden.getTotalElements());
            paginatedList.setIndex(dbGarden.getNumber());

            return Message.Ok(paginatedList);

        } catch (Exception e) {
            return Message.ErrorException(e);
        }
    }

    @Override
    public ResponseEntity<String> getBasicInfo(long id, boolean isAdmin, long idUser) {
        try {

            Optional<Garden> garden = gardenRepository.findByGardenIdAndIsDeleted(id, false);

            if (garden.isPresent()) {

                if (gardenAccessIsValid(garden.get(), isAdmin, idUser)) {

                    GardenBasicInfoModel gardenBasicInfoModel = modelMapper.map(garden, GardenBasicInfoModel.class);

                    List<Sector> sectorsList = new ArrayList<>(garden.get().getSectors()).stream()
                            .filter(sector -> !sector.isDeleted()).collect(Collectors.toList());

                    gardenBasicInfoModel
                            .setSectorRangesBasicData(MappingHelper.mapList(sectorsList, SectorBasicDataModel.class));

                    for (SectorBasicDataModel sectorBasicDataModel : gardenBasicInfoModel.getSectorRangesBasicData()) {

                        var metricAcceptationRanges = sectorsList.stream()
                                .filter(sector -> sector.getSectorId() == sectorBasicDataModel.getSectorId()).findAny()
                                .get()
                                .getMetricAcceptationRanges().stream()
                                .collect(Collectors.toList());

                        List<SectorMetricRangeModel> sectorMetricRangeModel = MappingHelper.mapList(
                                metricAcceptationRanges,
                                SectorMetricRangeModel.class);

                        sectorMetricRangeModel
                                .sort(Comparator.comparing(SectorMetricRangeModel::getMetricTypeDescription));

                        sectorBasicDataModel.setSectorMetricRanges(sectorMetricRangeModel);
                    }
                    return Message.Ok(gardenBasicInfoModel);
                }
            }
            return Message.ErrorSearchEntity();

        } catch (Exception e) {
            return Message.ErrorException(e);
        }
    }

    @Override
    public ResponseEntity<String> getSectorsMetricData(long id, boolean isAdmin, long idUser) {
        try {
            Optional<Garden> garden = gardenRepository.findByGardenIdAndIsDeleted(id, false);

            if (garden.isPresent()) {

                if (gardenAccessIsValid(garden.get(), isAdmin, idUser)) {

                    List<SectorMetricDataModel> sectorMetricDataModels = new ArrayList<SectorMetricDataModel>();

                    for (Sector sector : garden.get().getSectors()) {
                        SectorMetricDataModel sectorMetricDataModel = new SectorMetricDataModel();
                        List<MetricReadingDTOModel> metricReadingsDTOModel = new ArrayList<MetricReadingDTOModel>();

                        sectorMetricDataModel.setSectorId(sector.getSectorId());
                        sectorMetricDataModel.setName(sector.getName());

                        metricReadingsDTOModel = MappingHelper.mapList(
                                metricReadingRepository.findBySectorAndOrderByReadingDate(sector.getSectorId()),
                                MetricReadingDTOModel.class);

                        if (!metricReadingsDTOModel.isEmpty()) {

                            for (MetricAcceptationRange range : sector.getMetricAcceptationRanges()) {

                                var mostRecentMetric = metricReadingsDTOModel.stream().filter(
                                        reading -> reading.getMetricTypeCode() == range.getMetricType().getCode())
                                        .findAny();

                                if (mostRecentMetric.isPresent())
                                    mostRecentMetric.get().setCurrentReading(true);

                            }

                            sectorMetricDataModel.setReadings(metricReadingsDTOModel);
                            sectorMetricDataModels.add(sectorMetricDataModel);
                        }
                    }

                    return Message.Ok(sectorMetricDataModels);

                }
            }

            return Message.ErrorSearchEntity();

        } catch (

        Exception e) {
            return Message.ErrorException(e);
        }
    }

    @Override
    public ResponseEntity<String> saveMetricReading(MetricReadingModel model) {
        try {
            Optional<Sector> dbSector = sectorRepository.findByCentralizerKey(model.getToken());

            if (!dbSector.isPresent()) {
                return Message.ErrorSearchEntity("El sector no existe");
            }

            List<MetricReading> metricReadings = new ArrayList<MetricReading>();

            for (ReadingModel readingModel : model.getReadings()) {

                Optional<MetricType> metricType = metricTypeRepository.findById(readingModel.getType());

                if (metricType.isPresent()) {
                    MetricReading metricReading = new MetricReading();

                    metricReading.setMetricType(metricType.get());
                    metricReading.setSector(dbSector.get());
                    metricReading.setReadingDate(LocalDateTime.now());
                    metricReading.setValue(readingModel.getValue());
                    metricReading.setValueType(Constants.MetricValueTypes.DOUBLE);

                    metricReadings.add(metricReading);
                }
            }

            metricReadingRepository.saveAll(metricReadings);

            return Message.Ok();

        } catch (Exception e) {
            return Message.ErrorException(e);
        }
    }

    private boolean gardenAccessIsValid(Garden garden, boolean isAdmin, long idUser) {
        return isAdmin || garden.getOwner().getUserId() == idUser;
    }
}
