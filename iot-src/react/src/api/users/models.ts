export interface IUser {
  userId: number;
  name: string;
  surname: string;
  roleId: number;
  roleName?: string;
  username: string;
  password: string;
  email: string;
  createdAt?: string;
}

export type UserAddType = Pick<
  IUser,
  "username" | "name" | "surname" | "password" | "email" | "roleId"
>;

export type UserUpdateType = Pick<
  IUser,
  "username" | "name" | "surname" | "email" | "roleId"
>;
