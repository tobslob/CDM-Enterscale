import { formatToTimeZone, parseFromString } from "date-fns-timezone";

export function timeZone(date: Date, timeZone: string) {
  const dateTime = formatToTimeZone(date, "YYYY-MM-DD HH:mm:ss.SSS [GMT]Z (z)", { timeZone });
  return parseFromString(dateTime, "YYYY-MM-DD HH:mm:ss.SSS [GMT]Z (z)");
}
