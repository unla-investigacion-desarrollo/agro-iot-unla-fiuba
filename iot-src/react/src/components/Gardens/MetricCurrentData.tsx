import { Progress, Tooltip } from "antd";
import { IMetricReadingDTO } from "../../api/metricReadings/models";
import { ISectorMetricRange } from "../../api/sectors/models";
import { formatMetricValueWithUnit } from "../../helpers/metric-helper";

interface Props {
  sectorRange: ISectorMetricRange;
  currentReading?: IMetricReadingDTO;
}

const MetricCurrentData: React.FC<Props> = ({
  sectorRange,
  currentReading,
}) => {
  const getProgressStatus = (value: number) => {
    return value > sectorRange.startValue && value < sectorRange.endValue
      ? "success"
      : "exception";
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Tooltip
        title={
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span>{sectorRange.name}</span>
            <span>
              Valor inicial:{" "}
              {formatMetricValueWithUnit(
                sectorRange.startValue,
                sectorRange.metricTypeCode
              )}
            </span>
            <span>
              Valor final:{" "}
              {formatMetricValueWithUnit(
                sectorRange.endValue,
                sectorRange.metricTypeCode
              )}
            </span>
          </div>
        }
      >
        <Progress
          type="dashboard"
          style={{ display: "flex" }}
          percent={currentReading ? +currentReading.value : 0}
          status={getProgressStatus(currentReading ? +currentReading.value : 0)}
          format={(percent) =>
            formatMetricValueWithUnit(percent!, sectorRange.metricTypeCode)
          }
        />
      </Tooltip>
      <span style={{ color: "#909090", textAlign: "center" }}>
        {sectorRange.metricTypeDescription}
      </span>
    </div>
  );
};

export default MetricCurrentData;
