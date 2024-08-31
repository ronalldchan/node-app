import { isAfter, isBefore, parse } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

export const dateFormat: string = "yyyy-MM-dd";
export const timeFormat: string = "HH:mm";
export const datetimeFormat: string = dateFormat + " " + timeFormat;
const eventIdRegex: RegExp = /^[1-9][0-9]*$/;

export function isValidIdString(input: string): boolean {
    return eventIdRegex.test(input);
}

export function generateNRandomId(n: number) {
    const min = Math.pow(10, n - 1);
    const max = Math.pow(10, n) - 1;
    return Math.floor(min + Math.random() * (max - min + 1));
}

export function parseDate(date: string): Date {
    return parse(date, dateFormat, new Date());
}

export function parseTime(time: string): Date {
    return parse(time, timeFormat, new Date());
}

export function parseDateTime(datetime: string): Date {
    return parse(datetime, datetimeFormat, new Date());
}

export function parseUtcDateTime(date: string, time: string, timezone: string): Date {
    return fromZonedTime(parseDateTime(date + " " + time), timezone);
}

export function isValidInput(input: string): boolean {
    return !input || input.length < 3;
}

export function isWithinEventRange(eventStart: Date, eventEnd: Date, checkDate: Date): boolean {
    if (isBefore(checkDate, eventStart)) return false;
    if (isAfter(checkDate, eventEnd)) return false;
    const startTime = { hours: eventStart.getUTCHours(), minutes: eventStart.getUTCMinutes };
    const endTime = { hours: eventEnd.getUTCHours(), minutes: eventEnd.getUTCMinutes };
    const checkTime = { hours: checkDate.getUTCHours(), minutes: checkDate.getUTCMinutes };
    if (
        checkTime.hours < startTime.hours ||
        (checkTime.hours == startTime.hours && checkTime.minutes < startTime.minutes)
    )
        return false;
    if (endTime.hours < checkTime.hours || (endTime.hours == checkTime.hours && endTime.minutes < checkTime.minutes))
        return false;
    return true;
}
