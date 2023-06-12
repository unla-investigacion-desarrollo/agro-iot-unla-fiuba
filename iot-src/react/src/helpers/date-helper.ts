import { DateTime } from "luxon";

export const dateFormat = "dd/MM/yyyy HH:mm:ss";

export const formatISODate = (date: string) =>
  DateTime.fromISO(date).toFormat(dateFormat);
