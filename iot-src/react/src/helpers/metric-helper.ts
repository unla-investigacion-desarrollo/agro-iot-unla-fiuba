export const formatMetricValueWithUnit = (
  value: number,
  metricTypeCode: string
) => {
  if (!metricTypeCode) return value;
  if (metricTypeCode.includes("TEMPERATURA"))
    return `${formatMetricValue(value, metricTypeCode)}°C`;
  if (metricTypeCode.includes("HUMEDAD"))
    return `${formatMetricValue(value, metricTypeCode)}%`;
};

export const formatMetricValue = (value: number, metricTypeCode: string) => {
  if (!metricTypeCode) return value;
  if (metricTypeCode.includes("TEMPERATURA"))
    return `${+value.toFixed(1).replace(/[.,]0$/, "")}`;
  if (metricTypeCode.includes("HUMEDAD"))
    return `${+value.toFixed(2).replace(/[.,]00$/, "")}`;
};

export const randomNumber = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};
