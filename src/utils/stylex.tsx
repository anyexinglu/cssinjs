import { hashCode } from "./index";
import { dashCase } from "./dashCase";

/**
 * 函数形式的样式，如：
  {
    myLabel: props => ({
      display: 'block',
      color: props.labelColor,
      fontWeight: props.fontWeight,
      fontStyle: props.fontStyle
    })
  }
 */
type functionStyle = (
  props: any
) => {
  [innerKey: string]: string | number;
};

/**
 * 函数形式的样式值，如：
 *  {
      myButton: {
        padding: props => props.spacing
      }
 * }
 */
type functionVal = (props: any) => string | number;

type staticKeyValue = {
  [innerKey: string]: string | number | staticKeyValue;
};

type dynamicKeyValue =
  | functionStyle
  | {
      [innerKey: string]: string | number | functionVal | dynamicKeyValue;
    };

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
  hash: string,
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
const transformStyleValue = (value: string | number, hash: string) => {
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

const getId = (() => {
  let id = 0;

  return () => {
    id++;
    return id;
  };
})();

export const stylex = {
  create: (
    componentName: string,
    objStyle: { [key: string]: staticKeyValue }
  ) => {
    const { stylesheet, clsHashMap } = getStyle(componentName, objStyle);
    return attachStyle({ stylesheet, metaName: componentName, clsHashMap });
  },
  createDynamic: (
    componentName: string,
    objStyle: { [key: string]: dynamicKeyValue }
  ) => {
    const id = getId();
    console.log("...createDynamic", id);
    const initialGetStyles = (props: any) => {
      const { stylesheet, clsHashMap } = getStyle(
        componentName,
        objStyle,
        undefined,
        props,
        id
      );
      return attachStyle({
        stylesheet,
        metaName: componentName + "-" + id,
        clsHashMap
      });
    };
    return {
      id,
      initialGetStyles
    };
  },
  updateDynamic: (
    componentName: string,
    id: number,
    objStyle: { [key: string]: dynamicKeyValue }
  ) => {
    console.log("...updateDynamic", id);
    return (props: any) => {
      const { stylesheet, clsHashMap } = getStyle(
        componentName,
        objStyle,
        undefined,
        props,
        id
      );
      return updateStyle({
        stylesheet,
        metaName: componentName + "-" + id,
        clsHashMap
      });
    };
  }
};

const updateStyle = ({
  stylesheet,
  metaName,
  clsHashMap
}: {
  stylesheet: string;
  metaName: string;
  clsHashMap: {
    [key: string]: string;
  };
}) => {
  const style = Array.from(document.styleSheets).find(
    item => (item.ownerNode as any).dataset.meta === metaName
  )?.ownerNode;

  style && ((style as any).innerHTML = stylesheet);

  return (...args: (string | false | any)[]) => {
    return args
      .reduce((result: string[], key: string | false | any) => {
        if (!!key) {
          let hashKey = clsHashMap[key];
          result.push(hashKey);
        }

        return result;
      }, [])
      .join(" ");
  };
};

const attachStyle = ({
  stylesheet,
  metaName,
  clsHashMap
}: {
  stylesheet: string;
  metaName: string;
  clsHashMap: {
    [key: string]: string;
  };
}) => {
  const style = document.createElement("style");
  style.setAttribute("data-cij", "");
  style.setAttribute("data-meta", metaName);
  style.innerHTML = stylesheet;
  document.querySelector("head")?.appendChild(style);

  return (...args: (string | false | any)[]) => {
    return args
      .reduce((result: string[], key: string | false | any) => {
        if (!!key) {
          let hashKey = clsHashMap[key];
          result.push(hashKey);
        }

        return result;
      }, [])
      .join(" ");
  };
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
 * 3. 针对值为函数类型（带props），只需要执行函数拿到结果即可
 */
export const getStyle = (
  componentName: string,
  objStyle: {
    [cls: string]:
      | dynamicKeyValue
      | { [innerKey: string]: staticKeyValue | string | number };
  },
  prefixIdent: number = 0,
  props?: any,
  id?: number
) => {
  const hash = hashCode() + (id ? `-${id}` : "");
  let clsHashMap: { [key: string]: string } = {};
  let stylesheet = "";

  Object.keys(objStyle).reduce((result: string, cls: string) => {
    const isKeyFrames = cls.includes("@");
    const noHash = cls.includes(".") || cls.includes("%");
    let dynamicVal = objStyle[cls];
    let val =
      props && typeof dynamicVal === "function"
        ? dynamicVal(props)
        : dynamicVal;

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
      (
        result: { [key: string]: string | number | staticKeyValue },
        key: string
      ) => {
        const ident = prefixIdent + 1;

        let value = (val as any)[key];

        if (props && typeof value === "function") {
          value = value(props);
        }

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
