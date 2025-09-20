import { API } from "../../config/api";
import {
  GridParams,
  transformGridParamsToFetchGridParams,
} from "../../helpers/grid-helper";
import { ISectorDashboard, ISectorMetricData } from "../sectors/models";
import { IMetricReadingDTO } from "../metricReadings/models";
import FetchService from "../shared/FetchService";
import { PaginatedList } from "../shared/models";
import {
  GardenAddType,
  GardenUpdateType,
  IGarden,
  IGardenBasicInfo,
  IGardenDashboard,
} from "./models";

class GardensService {
  static async fetchList(
    gridParams: GridParams
  ): Promise<PaginatedList<IGarden>> {
    return await FetchService.get<PaginatedList<IGarden>>({
      url: `${API.GARDENS}`,
      gridParams: transformGridParamsToFetchGridParams(gridParams),
    });
  }
  static async fetchOne(id: string): Promise<IGarden> {
    return await FetchService.get<IGarden>({
      url: `${API.GARDENS}/${id}`,
    });
  }

  static async fetchGardenBasicInfo(id: string): Promise<IGardenBasicInfo> {
    return await FetchService.get<IGardenBasicInfo>({
      url: `${API.GARDENS}/${id}/basic-info`,
    });
  }

  static async fetchSectorsMetricData(
    id: string
  ): Promise<ISectorMetricData[]> {
    return await FetchService.get<ISectorMetricData[]>({
      url: `${API.GARDENS}/${id}/sectors-metric-data`,
    });
  }

  static async add(entity: GardenAddType): Promise<number> {
    return await FetchService.post<number>({
      url: API.GARDENS,
      body: entity,
    });
  }

  static async update(id: string, entity: GardenUpdateType): Promise<void> {
    await FetchService.put({
      url: `${API.GARDENS}/${id}`,
      body: entity,
    });
  }

  static async delete(id: string): Promise<void> {
    await FetchService.delete({
      url: `${API.GARDENS}/${id}`,
    });
  }

  static async Dashboard(): Promise<IGardenDashboard[]> {
    return await FetchService.get<IGardenDashboard[]>({
      url: `${API.GARDENS}/dashboard`,
    });
  }

  static async getMetrics(gardenId: number, range: "day" | "week" | "month" | "year"): Promise<ISectorDashboard[]> {
    return await FetchService.get<ISectorDashboard[]>({
      url: `${API.GARDENS}/${gardenId}/metrics?range=${range}`,
    });
  }

  static async fetchSectorsMetricDataDS(
    id: number
  ): Promise<IMetricReadingDTO[]> {
    return await FetchService.get<IMetricReadingDTO[]>({
      url: `${API.GARDENS}/${id}/sectors-metric-data`,
    });
  }
}

export default GardensService;
