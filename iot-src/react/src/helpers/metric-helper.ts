export const formatMetricValueWithUnit = (
  value: number,
  metricTypeCode: string
) => {
  if (!metricTypeCode) return value;
  if (metricTypeCode.includes("Temperatura"))
    return `${formatMetricValue(value, metricTypeCode)}°C`;
  if (metricTypeCode.includes("Humedad"))
    return `${formatMetricValue(value, metricTypeCode)}%`;
  return value;
};

export const formatMetricValue = (value: number, metricTypeCode: string) => {
  if (!metricTypeCode) return value;
  if (metricTypeCode.includes("Temperatura"))
    return `${+value.toFixed(1).replace(/[.,]0$/, "")}`;
  if (metricTypeCode.includes("Humedad"))
    return `${+value.toFixed(2).replace(/[.,]00$/, "")}`;
  return value;
};

export const randomNumber = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};
