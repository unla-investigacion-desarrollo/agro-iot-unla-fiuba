export enum API {
  //Administrative
  LOGIN = "/auth/login",
  LOGOUT = "/auth/logout",
  REFRESH_TOKEN = "/auth/refreshtoken",

  //Business
  USERS = "/users",
  ROLES = "/roles",
  GARDENS = "/gardens",
  METRIC_ACCEPTATION_RANGES = "/metric-acceptation-ranges",
  METRIC_TYPES = "/metric-types",
}
