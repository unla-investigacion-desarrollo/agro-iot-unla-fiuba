import AuthService from "../api/auth/AuthService";
import { RolesEnum } from "../api/roles/enum";

export const hasPermission = (roles: RolesEnum[]) => {
  const profile = AuthService.getUserProfile();

  if (!profile) return false;
  if (profile.roleCode === RolesEnum.ADMIN) return true;

  return roles.indexOf(profile.roleCode as RolesEnum) > -1;
};
