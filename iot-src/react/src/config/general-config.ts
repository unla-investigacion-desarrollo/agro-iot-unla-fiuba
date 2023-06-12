export const LOCAL_STORAGE_PROFILE = "AgroecologiaIoT.PROFILE";
export const LOCAL_STORAGE_JWT = "AgroecologiaIoT.JWT";
export const LOCAL_STORAGE_EXPIRATION = "AgroecologiaIoT.EXPIRATION";

export const READING_FETCH_WAIT_TIME = 5000; // 5 seconds

export const API_URL = `${process.env.REACT_APP_API_URL}/api/v1`;
export const IS_DEVELOPMENT =
  process.env.NODE_ENV === "development" ||
  window.location.hostname === "localhost";
