export interface IMetricType {
  code: string;
  description: string;
}

export type MetricTypeUpdateType = Pick<IMetricType, "code" | "description">;
