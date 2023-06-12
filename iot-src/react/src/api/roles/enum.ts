export enum RolesEnum {
  ADMIN = "ADMIN",
  GARDEN_MANAGER = "GARDEN_MANAGER",
  VISITOR = "VISITOR",
}

export const RolesLabel = {
  [RolesEnum.ADMIN]: "Administrador",
  [RolesEnum.GARDEN_MANAGER]: "Gestor de huertas",
  [RolesEnum.VISITOR]: "Visitante",
};
