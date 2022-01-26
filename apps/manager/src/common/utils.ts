/**
 * 递归 扁平化 mapping 数据
 */
export function mappingFlat(
  mapping: Record<string, any>,
  result: Record<string, any>,
  prefix: string,
) {
  for (const key in mapping) {
    const item = mapping[key];

    const k = prefix ? prefix + '.' + key : key;
    if (item.properties) {
      mappingFlat(item.properties, result, k);
    } else {
      result[k] = { type: item.type };
    }
  }
}
