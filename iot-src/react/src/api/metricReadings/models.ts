export interface IMetricReadingDTO {
  metricReadingId: number;
  readingDate: string;
  taValue: number;
  hrValue: number;
  hsValue: number;
  rainForecast: boolean;
  irrigation: boolean;
  valueType: string;
  isCurrentReading: boolean;
}
