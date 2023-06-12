export interface IMetricAcceptationRange {
  metricAcceptationRangeId: number;
  name: string;
  startValue: number;
  endValue: number;
  createdAt?: string;
  metricTypeCode: string;
  metricTypeDescription?: string;
}

export type MetricAcceptationRangeAddType = Pick<
  IMetricAcceptationRange,
  "name" | "startValue" | "endValue" | "metricTypeCode"
>;

export type MetricAcceptationRangeUpdateType = Pick<
  IMetricAcceptationRange,
  | "metricAcceptationRangeId"
  | "name"
  | "startValue"
  | "endValue"
  | "metricTypeCode"
>;

export interface IMetricAcceptationRangeGarden {
  metricAcceptationRangeId: number;
  name: string;
  metricTypeCode: string;
  metricTypeDescription: string;
}
