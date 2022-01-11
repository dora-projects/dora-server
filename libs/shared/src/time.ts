import * as dayjs from 'dayjs';
import * as relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');
dayjs.extend(relativeTime);

export function timeFormNow(timeString: string | number) {
  return dayjs().from(dayjs(timeString));
}

export function dateNow() {
  return dayjs().format('HH:mm:ss');
}

export function dateFormat(timeString: string | number) {
  return dayjs(timeString).format('YYYY/MM/DD HH:mm:ss');
}

export function dateFormatWeek(timeString: string | number) {
  return dayjs(timeString).format('YYYY/MM/DD HH:mm:ss ddd');
}
