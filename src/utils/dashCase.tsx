/**
 * @param str 示例：
 *  backgroundColor => background-color
    MozTransition => -moz-transition
    msTransition => -ms-transition
    color => color
 * 其他不需要考虑的如：'-webkit-fontSmoothing' / '-moz-osx-fontSmoothing'
 */

export function dashCase(str: string) {
  let result = str.replace(/[A-Z]/g, $0 => "-" + $0.toLowerCase());
  result = /^ms-/.test(result) ? "-" + result : result;
  return result;
}
