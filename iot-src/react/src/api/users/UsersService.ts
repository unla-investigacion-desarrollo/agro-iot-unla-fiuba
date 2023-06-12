import { API } from "../../config/api";
import {
  GridParams,
  transformGridParamsToFetchGridParams,
} from "../../helpers/grid-helper";
import FetchService from "../shared/FetchService";
import { PaginatedList } from "../shared/models";
import { IUser, UserAddType, UserUpdateType } from "./models";

class UsersService {
  static async fetchList(
    gridParams: GridParams
  ): Promise<PaginatedList<IUser>> {
    return await FetchService.get<PaginatedList<IUser>>({
      url: `${API.USERS}`,
      gridParams: transformGridParamsToFetchGridParams(gridParams),
    });
  }
  static async fetchOne(id: string): Promise<IUser> {
    return await FetchService.get<IUser>({
      url: `${API.USERS}/${id}`,
    });
  }

  static async fetchUsersByRoleId(id: string) {
    return await FetchService.get<IUser[]>({
      url: `${API.USERS}/role/${id}`,
    });
  }

  static async add(entity: UserAddType): Promise<number> {
    return await FetchService.post<number>({
      url: API.USERS,
      body: entity,
    });
  }

  static async update(id: string, entity: UserUpdateType): Promise<void> {
    await FetchService.put({
      url: `${API.USERS}/${id}`,
      body: entity,
    });
  }

  static async delete(id: string): Promise<void> {
    await FetchService.delete({
      url: `${API.USERS}/${id}`,
    });
  }
}

export default UsersService;
