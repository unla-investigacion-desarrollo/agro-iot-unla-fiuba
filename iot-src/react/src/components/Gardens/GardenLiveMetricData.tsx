import { Button, Card, Col, Collapse, Divider, message, Row, Spin } from "antd";
import CollapsePanel from "antd/lib/collapse/CollapsePanel";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import GardensService from "../../api/gardens/GardensService";
import { IGardenBasicInfo } from "../../api/gardens/models";
import { ISectorMetricData } from "../../api/sectors/models";
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

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [sectorsActiveKeys, setSectorActiveKeys] = useState<number[]>([]);

  const { id } = useParams<{ id: string }>();

  const getMetricTypeCurrentReading = (
    sectorId: number,
    metricTypeCode: string
  ) => {
    let sectorData = sectorsMetricData.find((smd) => smd.sectorId === sectorId);
    let reading =
      sectorData &&
      sectorData.readings.find(
        (r) => r.isCurrentReading && r.metricTypeCode === metricTypeCode
      );
    return reading;
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
              <span>La huerta no posee sectores</span>
            ) : (
              <>
                <Button
                  type="primary"
                  style={{ marginBottom: 15, marginRight: 15 }}
                  onClick={() =>
                    setSectorActiveKeys([
                      ...gardenBasicInfo.sectorRangesBasicData.map(
                        (srd) => srd.sectorId
                      ),
                    ])
                  }
                >
                  Mostrar todos
                </Button>
                <Button
                  type="primary"
                  style={{ marginBottom: 15 }}
                  onClick={() => setSectorActiveKeys([])}
                >
                  Ocultar todos
                </Button>

                <Collapse
                  activeKey={sectorsActiveKeys}
                  onChange={(activeKeys: any) =>
                    setSectorActiveKeys(activeKeys)
                  }
                >
                  {gardenBasicInfo.sectorRangesBasicData.map((sector) => (
                    <CollapsePanel key={sector.sectorId} header={sector.name}>
                      <Row
                        gutter={16}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        {sector.sectorMetricRanges.map((range) => (
                          <React.Fragment key={range.metricTypeCode}>
                            <Col
                              xs={24}
                              sm={12}
                              md={6}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                marginBottom: 10,
                              }}
                            >
                              <MetricCurrentData
                                sectorRange={range}
                                currentReading={getMetricTypeCurrentReading(
                                  sector.sectorId,
                                  range.metricTypeCode
                                )}
                              />
                            </Col>
                          </React.Fragment>
                        ))}
                      </Row>
                      <Divider>Historial de lecturas</Divider>
                      <SectorMetricsGrid
                        readings={getSectorCurrentReadings(sector.sectorId)}
                      />
                    </CollapsePanel>
                  ))}
                </Collapse>
              </>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default GardenLiveMetricData;
