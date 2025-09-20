import React, { useEffect, useState } from "react";
import { Collapse, Col, Divider, Row, Spin, message, Button } from "antd";
import { useNavigate } from "react-router-dom";
import GardensService from "../../api/gardens/GardensService";
import { IGardenDashboard } from "../../api/gardens/models";
import { ISectorDashboard } from "../../api/sectors/models";
import { createBaseGridParams } from "../../helpers/grid-helper";
import { URLs } from "../../config/enums";
import MetricCurrentData from "../../components/Gardens/MetricCurrentData";
import HsChartByGarden from "./HsChartByGarden";

const { Panel } = Collapse;

const Dashboard: React.FC = () => {
  const [gardens, setGardens] = useState<IGardenDashboard[]>([]);
  const [loading, setLoading] = useState(false);
  const [gridState] = useState(createBaseGridParams({ sortField: "createdAt" }));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGardensAndMetrics = async () => {
      try {
        setLoading(true);
        const fetchedGardens = await GardensService.Dashboard();
        setGardens(fetchedGardens);
      } catch (err: any) {
        if (err?.message) message.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGardensAndMetrics();
  }, [gridState]);

  if (loading) return <Spin />;

  return (
    <div className="container">
      {loading ? (
        <div className="loading">
          <Spin />
        </div>
      ) : (
        <Collapse defaultActiveKey={gardens.map((g: IGardenDashboard) => g.gardenId.toString())}>
          {gardens.map((garden: IGardenDashboard) => (
            <React.Fragment key={garden.gardenId}>
            <Panel header={garden.name} key={garden.gardenId.toString()}>
              <Row gutter={16} align="middle">
                <Col xs={24} sm={18}>
                  <p><b>Ubicación:</b> {garden.location}</p>
                  <p><b>Descripción:</b> {garden.description}</p>
                </Col>
                <Col xs={24} sm={6} style={{ textAlign: "right" }}>
                  <Button
                    type="link"
                    onClick={() => navigate(`${URLs.GARDENS}${URLs.DETAIL.replace(":id", garden.gardenId.toString())}`)}
                  >
                    Editar huerta
                  </Button>
                </Col>
              </Row>
              {garden.sectors && garden.sectors.length > 0 ? (
                <Collapse defaultActiveKey={garden.sectors.map((s: ISectorDashboard) => s.sectorId.toString())}>
                  {garden.sectors.map((sector: ISectorDashboard) => (
                    <Panel header={sector.name} key={sector.sectorId.toString()}>
                      <Row gutter={16} align="middle">
                        <Col xs={24} sm={18} >
                          <p><b>Descripción:</b> {sector.crops ?? "-"}</p>
                          <p><b>Cultivo:</b> {sector.metricAcceptationRange.name ?? "-"}</p>
                        </Col>
                        <Col xs={24} sm={6} style={{ textAlign: "right" }}>
                          <Button
                            type="link"
                            onClick={() => navigate(`${URLs.GARDENS}${URLs.GARDEN_METRICS.replace(":id", garden.gardenId.toString())}?sectorId=${sector.sectorId}`)}
                          >
                            Ver métricas
                          </Button>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        {["HS", "HR", "TA"].map((type) => (
                          <Col xs={24} sm={12} md={8} key={type}>
                            <MetricCurrentData
                              sectorRange={sector.metricAcceptationRange}
                              currentReading={sector.readings?.find((r) => r.isCurrentReading)}
                              metricType={type as "HR" | "HS" | "TA"}
                            />
                          </Col>
                        ))}
                      </Row>
                    </Panel>
                  ))}
                </Collapse>
                
              ) : (
                <i>Sin sectores</i>
              )}
            <Divider />
            <Collapse>
              <Panel header="Gráfico de humedad del sustrato" key={`hs-${garden.gardenId}`}>
                    <HsChartByGarden gardenId={garden.gardenId} />
              </Panel>
            </Collapse>
            
          </Panel>    
          </React.Fragment>
          ))}
        </Collapse>
      )}
    </div>
  );
};

export default Dashboard;
