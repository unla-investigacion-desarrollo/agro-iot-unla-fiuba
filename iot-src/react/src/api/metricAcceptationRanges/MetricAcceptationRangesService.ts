import { API } from "../../config/api";
import {
  GridParams,
  transformGridParamsToFetchGridParams,
} from "../../helpers/grid-helper";
import FetchService from "../shared/FetchService";
import { PaginatedList } from "../shared/models";
import {
  IMetricAcceptationRange,
  IMetricAcceptationRangeGarden,
  MetricAcceptationRangeAddType,
  MetricAcceptationRangeUpdateType,
} from "./models";

class MetricAcceptationRangesService {
  static async fetchList(
    gridParams: GridParams
  ): Promise<PaginatedList<IMetricAcceptationRange>> {
    return await FetchService.get<PaginatedList<IMetricAcceptationRange>>({
      url: `${API.METRIC_ACCEPTATION_RANGES}`,
      gridParams: transformGridParamsToFetchGridParams(gridParams),
    });
  }
  static async fetchOne(id: string): Promise<IMetricAcceptationRange> {
    return await FetchService.get<IMetricAcceptationRange>({
      url: `${API.METRIC_ACCEPTATION_RANGES}/${id}`,
    });
  }

  static async fetchGardenRanges(
    gardenId: number
  ): Promise<IMetricAcceptationRangeGarden[]> {
    return await FetchService.get<IMetricAcceptationRangeGarden[]>({
      url: `${API.METRIC_ACCEPTATION_RANGES}/garden?gardenId=${gardenId}`,
    });
  }

  static async add(entity: MetricAcceptationRangeAddType): Promise<number> {
    return await FetchService.post<number>({
      url: API.METRIC_ACCEPTATION_RANGES,
      body: entity,
    });
  }

  static async update(
    id: string,
    entity: MetricAcceptationRangeUpdateType
  ): Promise<void> {
    await FetchService.put({
      url: `${API.METRIC_ACCEPTATION_RANGES}/${id}`,
      body: entity,
    });
  }

  static async delete(id: string): Promise<void> {
    await FetchService.delete({
      url: `${API.METRIC_ACCEPTATION_RANGES}/${id}`,
    });
  }
}

export default MetricAcceptationRangesService;
