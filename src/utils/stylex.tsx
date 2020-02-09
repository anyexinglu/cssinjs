import { hashCode } from "./index";
import { dashCase } from "./dashCase";

type keyValue = { [innerKey: string]: string | number | keyValue };

/**
 * @param key 如 &$static-container p
 * @param hash 如 46670517
 * @param hashCls 如 .wrapper-46670517
 * @param clsHashMap
 * @return 如 .wrapper-46670517.staticContainer-46670517 p
 */
const dashNestedKey = (
  key: string,
  componentName: string,
  hash: number,
  hashCls: string,
  clsHashMap: {
    [key: string]: string;
  }
) => {
  // $left -> .left-46670517
  return key
    .replace(/\$([0-9a-zA-Z]*)/g, item => {
      const dotItem = item.replace(/\$/g, "." + componentName + "-");
      if (item && !item.includes(`_${hash}`)) {
        let itemKey = item.replace(/\$/g, "");
        clsHashMap[itemKey] = itemKey + `_${hash}`;
        return dotItem + `_${hash}`;
      }
      return dotItem;
    })
    .replace(/&/g, hashCls.startsWith(".") ? hashCls : `.${hashCls}`)
    .split(" ")
    .map((item: string) =>
      item.includes(".") && !item.includes(`_${hash}`)
        ? componentName + "-" + item + `_${hash}`
        : item
    )
    .join(" ");
};

/**
 * @param key 如 `$transferHighlightIn 1s`
 * @param hash 如 46670517
 * @return 如 transferHighlightIn-46670517 1s
 */
const transformStyleValue = (value: string | number, hash: number) => {
  return String(value)
    .replace(/"/g, "")
    .replace(/\$([0-9a-zA-Z]*)/g, item => {
      const dotItem = item.replace(/\$/g, "");
      return dotItem + "_" + hash;
    });
};

const getBlankByIdent = (ident: number) => {
  return new Array(ident).fill("  ").join("");
};

/**
 * 转stylesheet的规则：
 * value为对象，说明不是样式属性 而是子层级。
 * 1. 针对子层级：
 * （1）& 变成父级（带hash后缀）
 * （2）提取子层级中的className：遇到$后面跟字母/数字，则将$ 变成 .，且需要加上hash后缀（推到map中给jsx用）
 *     空格后的如果是html标签，因为没有$打头，也就不会加上hash后缀
 * （3）`@`打头，如`@keyframes`, `@-webkit-keyframes`, `@-moz-keyframes`要特别处理
 * 2. 针对样式属性
 * （1）key：驼峰转 - 横线
 * （2）value：去掉单双引号
 */
export const getStyle = (
  componentName: string,
  objStyle: {
    [cls: string]: { [innerKey: string]: keyValue | string | number };
  },
  prefixIdent: number = 0
) => {
  const hash = hashCode();
  let clsHashMap: { [key: string]: string } = {};
  let stylesheet = "";

  Object.keys(objStyle).reduce((result: string, cls: string) => {
    const isKeyFrames = cls.includes("@");
    const noHash = cls.includes(".") || cls.includes("%");
    const val = objStyle[cls];
    // const hashCls = noHash
    //   ? cls
    //   : isKeyFrames
    //   ? cls + "-" + hash
    //   : componentName + "-" + cls + "-" + hash;
    let hashCls = cls;
    if (!noHash) {
      hashCls = cls + "_" + hash;
      if (!isKeyFrames) {
        hashCls = componentName + "-" + hashCls;
      }
    }

    stylesheet += (noHash || isKeyFrames ? "" : ".") + `${hashCls} {\n`;

    let append = "";
    const newVal = Object.keys(val).reduce(
      (result: { [key: string]: string | number | keyValue }, key: string) => {
        const ident = prefixIdent + 1;

        let value = val[key];
        if (typeof value === "object") {
          if (isKeyFrames) {
            const blank = getBlankByIdent(ident);
            const style = getStyle(
              componentName,
              {
                [key]: value
              },
              ident
            ).stylesheet;

            stylesheet += `${blank}${style}`;
            return result;
          } else {
            const dashedKey = dashNestedKey(
              key,
              componentName,
              hash,
              hashCls,
              clsHashMap
            );
            // 针对子层级，需递归调用 getStyle
            const style = getStyle(componentName, {
              [dashedKey]: value
            }).stylesheet;

            console.log("...style", style);
            const blank = getBlankByIdent(ident - 1);
            append += `${blank}${style}`;
            return result;
          }
        } else {
          // 针对样式属性
          const dashedKey = dashCase(key);
          value = transformStyleValue(value, hash);
          result[dashedKey] = value;
          const blank = getBlankByIdent(ident);
          stylesheet += `${blank}${dashedKey}: ${value};\n`;
          return result;
        }
      },
      {}
    );
    stylesheet = stylesheet + `${getBlankByIdent(prefixIdent)}}\n` + append;

    clsHashMap[cls] = hashCls;

    // 参考jss：packages/jss/src/utils/toCss.js
    const newClsMap = `
        .${hashCls} ${JSON.stringify(newVal)
      .replace(/"/g, "")
      .replace(/,/g, ";")}
      `;
    return `
        ${result}
        ${newClsMap}`;
  }, "");

  return {
    stylesheet,
    clsHashMap
  };
};

export const stylex = {
  create: (componentName: string, objStyle: { [key: string]: keyValue }) => {
    const { stylesheet, clsHashMap } = getStyle(componentName, objStyle);
    const style = document.createElement("style");
    style.innerHTML = stylesheet;
    document.querySelector("head")?.appendChild(style);

    return (...args: (string | false)[]) => {
      return args
        .reduce((result: string[], key: string | false) => {
          if (!!key) {
            let hashKey = clsHashMap[key];
            result.push(hashKey);
          }
          return result;
        }, [])
        .join(" ");
    };
  }
};
