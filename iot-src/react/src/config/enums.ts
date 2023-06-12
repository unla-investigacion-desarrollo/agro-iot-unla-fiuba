export enum URLs {
  ROOT = "/",
  LOGIN = "/login",
  LOGOUT = "/logout",

  //Business
  USERS = "/usuarios",
  ROLES = "/roles",
  GARDENS = "/huertas",
  GARDEN_METRICS = "/:id/metricas",
  METRIC_ACCEPTATION_RANGES = "/rangos-metricas",
  METRIC_TYPES = "/tipos-metricas",
  PROFILE = "/perfil",

  // Common routes
  DETAIL = "/:id/detalle",
  NEW = "/nuevo",

  SHARED_GARDENS = "/huertas-compartidas",
}
