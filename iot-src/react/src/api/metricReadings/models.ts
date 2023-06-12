export interface IMetricReadingDTO {
  metricReadingId: number;
  readingDate: string;
  value: string;
  valueType: string;
  metricTypeCode: string;
  metricTypeDescription: string;
  isCurrentReading: boolean;
}
