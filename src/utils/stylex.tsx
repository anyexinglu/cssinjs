import { hashCode } from "./index";
import { dashCase } from "./dashCase";

const stylex = {
  create: (clsMap: {
    [key: string]: { [innerKey: string]: string | number };
  }) => {
    // console.log("...clsMap", clsMap);
    const hash = hashCode();
    let newMap: { [key: string]: string } = {};
    const stylesheet = Object.keys(clsMap).reduce(
      (result: string, key: string) => {
        const hashKey = key + hash;
        const val = clsMap[key];
        const newVal = Object.keys(val).reduce(
          (result: { [key: string]: string | number }, key: string) => {
            const dashedKey = dashCase(key);
            result[dashedKey] = val[key];
            return result;
          },
          {}
        );
        const newClsMap = `
        .${hashKey} ${JSON.stringify(newVal)
          .replace(/"/g, "")
          .replace(/,/g, ";")}
      `;
        newMap[key] = hashKey;
        return `
        ${result}
        ${newClsMap}`;
      },
      ""
    );
    // console.log("...stylesheet", stylesheet, newMap);
    const style = document.createElement("style");
    style.innerHTML = stylesheet;
    document.querySelector("head")?.appendChild(style);

    return (...args: (string | false)[]) => {
      // console.log("...args", args);
      return args
        .reduce((result: string[], key: string | false) => {
          if (!!key) {
            let hashKey = newMap[key];
            result.push(hashKey);
          }
          return result;
        }, [])
        .join(" ");
    };
  }
};

export default stylex;
