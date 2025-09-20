import { Progress, Tooltip } from "antd";
import { IMetricReadingDTO } from "../../api/metricReadings/models";
import { formatMetricValueWithUnit } from "../../helpers/metric-helper";
import { IMetricAcceptationRange } from "../../api/metricAcceptationRanges/models";

interface Props {
  sectorRange: IMetricAcceptationRange;
  currentReading?: IMetricReadingDTO;
  metricType: "HR" | "HS" | "TA";
}

const MetricCurrentData: React.FC<Props> = ({
  sectorRange,
  currentReading,
  metricType,
}) => {

  // Obtener valores dinámicamente según el tipo
  const getRange = () => {
    switch (metricType) {
      case "HR":
        return {
          start: sectorRange.hrStartValue,
          end: sectorRange.hrEndValue,
          value: currentReading?.hrValue ?? 0,
        };
      case "HS":
        return {
          start: sectorRange.hsStartValue,
          end: sectorRange.hsEndValue,
          value: currentReading?.hsValue ?? 0,
        };
      case "TA":
        return {
          start: sectorRange.taStartValue,
          end: sectorRange.taEndValue,
          value: currentReading?.taValue ?? 0,
        };
      default:
        return { start: 0, end: 100, value: 0 };
    }
  };

  const { start, end, value } = getRange();
  const isInRange = value >= start && value <= end;
  const getProgressStatus = (val: number) =>
    val > start && val < end ? "success" : "exception";
  
  return (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      height: 200, // <-- Fuerza altura común
      justifyContent: "center",
    }}
  >
    {/* HR y HS */}
    {metricType !== "TA" && (
      <>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 120 }}>
          <Tooltip
            title={
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span>{metricType === "HR" ? "Humedad Relativa" : "Humedad Sustrato"}</span>
                <span>Valor inicial: {start}</span>
                <span>Valor final: {end}</span>
              </div>
            }
          >
            <Progress
              type="dashboard"
              style={{ display: "flex" }}
              percent={+value}
              status={getProgressStatus(+value)}
              format={(percent) => formatMetricValueWithUnit(percent!, metricType)}
            />
          </Tooltip>
        </div>

        <div style={{ minHeight: 48, textAlign: "center", marginTop: 8 }}>
          <span style={{ color: "#909090", display: "block" }}>
            {sectorRange.metricTypeDescription}
          </span>
          <span style={{ fontWeight: "500" }}>
            {metricType === "HR" ? "Humedad Relativa" : "Humedad Sustrato"}
          </span>
        </div>
      </>
    )}

    {/* TA */}
    {metricType === "TA" && (
      <>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 120 }}>
          <Tooltip
            title={
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span>Temperatura Ambiente</span>
                <span>Valor inicial: {start}</span>
                <span>Valor final: {end}</span>
              </div>
            }
          >
            <span
              style={{
                display: "inline-block",
                fontSize: 46,
                fontWeight: "bold",
                //color: isInRange ? "green" : "red",
                color: "transparent",
                WebkitTextStroke: `1.5px ${isInRange ? "green" : "red"}`,
                border: "2px solid",
                borderColor: isInRange ? "green" : "red",
                borderRadius: 8,
                padding: "8px 16px",
                backgroundColor: "#f9f9f9",
              }}
            >
              {formatMetricValueWithUnit(value, metricType)}
            </span>
          </Tooltip>
        </div>

        <div style={{ minHeight: 48, textAlign: "center", marginTop: 8 }}>
          <span style={{ color: "#909090", display: "block" }}>
            {sectorRange.metricTypeDescription}
          </span>
          <span style={{ fontWeight: "500" }}>
            Temperatura Ambiente
          </span>
        </div>
      </>
    )}
  </div>
)};

export default MetricCurrentData;
