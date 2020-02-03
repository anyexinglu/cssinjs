export { dashCase } from "./dashCase";

/**
 * @param str
 * 方式一：每次调用都生成唯一的hash，但这种办法ssr会有问题（client和server端会出现差异）
 * 方式二：根据版本号生成唯一的hash，
 * 缺点：需要知道当前要发的版本号（需要额外处理）
 * 优点：保证每次相同版本号生成的hash都是确定的
 */
export function hashCode(str?: string) {
  if (!str) {
    str = "1.0.0";
  }
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    let chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr; // eslint-disable-line
    // Convert to 32bit integer
    hash |= 0; // eslint-disable-line
  }
  return hash;
}
