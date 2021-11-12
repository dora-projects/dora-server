import * as dayjs from 'dayjs';
import * as relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');
dayjs.extend(relativeTime);

export function timeFormNow(timeString: string) {
  return dayjs().from(dayjs(timeString));
}

export const dateNow = () => dayjs().format('HH:mm:ss');
export const dateNowWithDate = () => dayjs().format('YYYY年M月D日 HH:mm:ss');
export const dateNowWithDateWeek = () =>
  dayjs().format('YYYY年M月D日 HH:mm:ss ddd');
