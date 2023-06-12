export interface IRole {
  roleId: number;
  code: string;
  name: string;
}

export type RoleUpdateType = Pick<IRole, "name" | "roleId">;
