import * as crypto from 'crypto';
import * as fs from 'fs/promises';
import * as util from 'util';
const setTimeoutPromise = util.promisify(setTimeout);

export function sha256(data) {
  return crypto.createHash('sha256').update(data, 'utf8').digest('hex');
}

// 得到一个两数之间的随机整数，包括两个数在内
export function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值
}

export async function dumpJson(filePrefix: string, data: Record<string, any>) {
  const cwdPath = process.cwd();
  const filepath = `${cwdPath}/logs/${filePrefix}_${getRandomIntInclusive(
    0,
    1000,
  )}.json`;
  await fs.writeFile(filepath, JSON.stringify(data, null, 2), {});
}

export async function sleep(ms: number) {
  await setTimeoutPromise(ms);
}

export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
