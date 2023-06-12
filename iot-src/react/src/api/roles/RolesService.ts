import { API } from "../../config/api";
import FetchService from "../shared/FetchService";
import { IRole, RoleUpdateType } from "./models";

class RolesService {
  static async fetchOne(id: string): Promise<IRole> {
    return FetchService.get<IRole>({
      url: `${API.ROLES}/${id}`,
    });
  }
  static async fetchAll(): Promise<IRole[]> {
    return FetchService.get<IRole[]>({
      url: `${API.ROLES}/all`,
    });
  }

  static async update(id: string, entity: RoleUpdateType): Promise<void> {
    await FetchService.put({
      url: `${API.ROLES}/${id}`,
      body: entity,
    });
  }
}

export default RolesService;
