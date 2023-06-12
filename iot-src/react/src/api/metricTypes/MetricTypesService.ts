import { API } from "../../config/api";
import FetchService from "../shared/FetchService";
import { IMetricType, MetricTypeUpdateType } from "./models";

class MetricTypesService {
  static async fetchAll(): Promise<IMetricType[]> {
    return await FetchService.get<IMetricType[]>({
      url: `${API.METRIC_TYPES}/all`,
    });
  }

  static async fetchOne(id: string): Promise<IMetricType> {
    return await FetchService.get<IMetricType>({
      url: `${API.METRIC_TYPES}/${id}`,
    });
  }

  static async update(id: string, entity: MetricTypeUpdateType): Promise<void> {
    await FetchService.put({
      url: `${API.METRIC_TYPES}/${id}`,
      body: entity,
    });
  }
}

export default MetricTypesService;
