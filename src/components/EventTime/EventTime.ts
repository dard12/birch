import { zonedTimeToUtc } from 'date-fns-tz';
import { Start } from '../../../src-server/models';

export default function getEventTime(start?: Start) {
  if (!start) {
    return;
  }

  const { date, dateTime, timeZone } = start;
  const savedDate = dateTime || date;

  if (savedDate) {
    return zonedTimeToUtc(savedDate, timeZone);
  }
}
