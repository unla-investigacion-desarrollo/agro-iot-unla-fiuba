import { Card, Col, Empty, Divider, message, Row, Spin, Select } from "antd";
//import CollapsePanel from "antd/lib/collapse/CollapsePanel";

import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router";
import GardensService from "../../api/gardens/GardensService";
import { IGardenBasicInfo } from "../../api/gardens/models";
import { ISectorBasicData, ISectorMetricData } from "../../api/sectors/models";
import { READING_FETCH_WAIT_TIME } from "../../config/general-config";
import ErrorPage from "../../pages/ErrorPage";
import BackButton from "../BackButton/BackButton";
import { GardenBasicInfo } from "./GardenBasicInfo";
import MetricCurrentData from "./MetricCurrentData";
import SectorMetricsGrid from "./SectorMetricsGrid";

const GardenLiveMetricData = () => {
  const [gardenBasicInfo, setGardenBasicInfo] = useState<IGardenBasicInfo>({
    name: "",
    description: "",
    gardenId: 0,
    location: "",
    sectorRangesBasicData: [],
  });

  const [basicInformationFetched, setBasicInformationFetched] = useState(false);

  const [sectorsMetricData, setSectorsMetricData] = useState<
    ISectorMetricData[]
  >([]);

  const { Option } = Select;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedSector, setSelectedSector] = useState<ISectorBasicData | undefined>(undefined);

  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const preselectedSectorId = queryParams.get("sectorId");

  const getMetricCurrentReading = (sectorId: number) => {
    const sectorData = sectorsMetricData.find((smd) => smd.sectorId === sectorId);
    return sectorData ? sectorData.readings.find((r) => r.isCurrentReading) : undefined;
  };

  const getSectorCurrentReadings = (sectorId: number) => {
    return sectorsMetricData.find((smd) => smd.sectorId === sectorId)
      ? sectorsMetricData.find((smd) => smd.sectorId === sectorId)!.readings
      : [];
  };

  //Initial fetch: only once, when the view is rendered
  useEffect(() => {
    const fetchGardenBasicInfo = async () => {
      try {
        if (id) {
          setIsLoading(true);
          const response = await GardensService.fetchGardenBasicInfo(id);
          setGardenBasicInfo(response);
          setBasicInformationFetched(true);
        }
      } catch (error) {
        setError(true);
        if (error.message) message.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGardenBasicInfo();
  }, [id]);

  //Continous fetch: after basic info is loaded and then every x seconds based in config
  useEffect(() => {
    const fetchSectorsMetricData = async () => {
      if (
        !error &&
        basicInformationFetched &&
        gardenBasicInfo.sectorRangesBasicData.length > 0
      ) {
        try {
          const response = await GardensService.fetchSectorsMetricData(id!);
          setSectorsMetricData(response);
        } catch (error) {
          if (error.message) message.error(error.message);
        }
      }
    };

    //Interval to handle continous fetching of metric readings
    const readingFetchInterval = setInterval(() => {
      fetchSectorsMetricData();
    }, READING_FETCH_WAIT_TIME);
    return () => clearInterval(readingFetchInterval);
  }, [error, id, basicInformationFetched, gardenBasicInfo]);

  useEffect(() => {
    if (preselectedSectorId && gardenBasicInfo.sectorRangesBasicData.length > 0) {
      const found = gardenBasicInfo.sectorRangesBasicData.find(
        (s) => s.sectorId === Number(preselectedSectorId)
      );
      if (found) setSelectedSector(found);
    }
  }, [preselectedSectorId, gardenBasicInfo]);

  if (error) return <ErrorPage />;

  return (
  <div className="container">
    <Card title={<BackButton title="Huerta en vivo" />}>
      {isLoading ? (
        <div className="loading">
          <Spin />
        </div>
      ) : (
        <>
          <GardenBasicInfo garden={gardenBasicInfo} />
          <Divider>Sectores</Divider>

          {!gardenBasicInfo.sectorRangesBasicData.length ? (
            <Empty description="La huerta no posee sectores" />
          ) : (
            <>
              <Select
                style={{ width: 300, marginBottom: 20 }}
                placeholder="Seleccionar sector"
                value={selectedSector?.sectorId}
                onChange={(sectorId) => {
                  const selected = gardenBasicInfo.sectorRangesBasicData.find(
                    (s) => s.sectorId === sectorId
                  );
                  setSelectedSector(selected);
                }}
              >
                {gardenBasicInfo.sectorRangesBasicData.map((sector) => (
                  <Option key={sector.sectorId} value={sector.sectorId}>
                    {sector.name}
                  </Option>
                ))}
              </Select>

              {selectedSector && (
                <>
                  <Divider>Métricas aceptadas</Divider>
                  <Row gutter={16}>
                    {["HS", "HR", "TA"].map((type) => (
                      <Col xs={24} sm={12} md={8} key={type}>
                        <MetricCurrentData
                          sectorRange={selectedSector.metricAcceptationRange}
                          currentReading={getMetricCurrentReading(selectedSector.sectorId)}
                          metricType={type as "HR" | "HS" | "TA"}
                        />
                      </Col>
                    ))}
                  </Row>

                  <Divider>Historial de lecturas</Divider>
                  <SectorMetricsGrid
                    readings={getSectorCurrentReadings(selectedSector.sectorId)}
                  />
                </>
              )}
            </>
          )}
        </>
      )}
    </Card>
  </div>
);

};

export default GardenLiveMetricData;
