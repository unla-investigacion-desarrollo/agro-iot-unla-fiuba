export interface IMetricAcceptationRange {
  metricAcceptationRangeId: number;
  name: string;
  description: string;
  hsStartValue: number;
  hsEndValue: number;
  hrStartValue: number;
  hrEndValue: number;
  taStartValue: number;
  taEndValue: number;
  createdAt?: string;
  metricTypeDescription?: string;
}

export type MetricAcceptationRangeAddType = Pick<
  IMetricAcceptationRange,
  | "name"
  | "description"
  | "hsStartValue"
  | "hsEndValue"
  | "hrStartValue"
  | "hrEndValue"
  | "taStartValue"
  | "taEndValue"
>;

export type MetricAcceptationRangeUpdateType = Pick<
  IMetricAcceptationRange,
  | "metricAcceptationRangeId"
  | "name"
  | "description"
  | "hsStartValue"
  | "hsEndValue"
  | "hrStartValue"
  | "hrEndValue"
  | "taStartValue"
  | "taEndValue"
>;


export interface IMetricAcceptationRangeGarden {
  metricAcceptationRangeId: number;
  name: string;
  metricTypeCode: string;
  metricTypeDescription: string;
}
