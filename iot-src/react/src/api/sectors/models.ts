import { IMetricAcceptationRange } from "../metricAcceptationRanges/models";
import { IMetricReadingDTO } from "../metricReadings/models";

export interface ISector {
  sectorId: number;
  name: string;
  centralizerKey: string;
  gardenId: number;
  crops: string;
  metricAcceptationRangeIds: number;
}

export interface ISectorBasicData {
  sectorId: number;
  name: string;
  metricAcceptationRange: IMetricAcceptationRange;
}

export interface ISectorMetricRange {
  name: string;
  startValue: number;
  endValue: number;
  metricTypeCode: string;
  metricTypeDescription: string;
}

export interface ISectorMetricData {
  sectorId: number;
  sectorName: string;
  readings: IMetricReadingDTO[];
}

export interface ISectorDashboard {
  sectorId: number;
  name: string;
  centralizerKey: string;
  gardenId: number;
  crops: string;
  metricAcceptationRange: IMetricAcceptationRange;
  readings: IMetricReadingDTO[];
}