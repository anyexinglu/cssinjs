// Reference: https://github.com/rexxars/hyphenate-style-name/blob/master/test/hyphenate-style-name.test.js

import { getStyle } from "../utils";

const componentName = "input";

test("getStyle should work", () => {
  const { stylesheet, clsHashMap } = getStyle(componentName, {
    wrapper: {
      color: "red",
      padding: "10px",
      backgroundColor: "#ffeb3b",
      "& p": {
        color: "yellow",
        "& span": {
          color: "#a00"
        }
      },
      "&$left, &$right": {
        height: "100%",
        width: 0
      },
      "& svg$iconSuffix": {
        verticalAlign: "middle"
      },
      "& $inner": {
        color: "gray"
      },
      "&$staticContainer": {
        padding: "15px",
        "& span": {
          color: "red"
        }
      },
      "&$staticContainer p": {
        color: "blue"
      },
      "&$staticContainer$mine": {
        color: "#000",
        "&:not($test) > span": {
          color: "orange"
        }
      },
      "&, &:hover": {
        color: "green",
        animation: `$transferHighlightIn 1s`
      }
    },
    "@keyframes transferHighlightIn": {
      "0%": {
        background: "bae7ff",
        color: "red"
      },
      "100%": {
        background: "transparent"
      }
    }
    // staticContainer: {
    //   border: "1px solid #ccc"
    // }
  });
  expect(stylesheet).toBe(`.input-wrapper_46670517 {
  color: red;
  padding: 10px;
  background-color: #ffeb3b;
}
.input-wrapper_46670517 p {
  color: yellow;
}
.input-wrapper_46670517 p span {
  color: #a00;
}
.input-wrapper_46670517.input-left_46670517, .input-wrapper_46670517.input-right_46670517 {
  height: 100%;
  width: 0;
}
.input-wrapper_46670517 svg.input-iconSuffix_46670517 {
  vertical-align: middle;
}
.input-wrapper_46670517 .input-inner_46670517 {
  color: gray;
}
.input-wrapper_46670517.input-staticContainer_46670517 {
  padding: 15px;
}
.input-wrapper_46670517.input-staticContainer_46670517 span {
  color: red;
}
.input-wrapper_46670517.input-staticContainer_46670517 p {
  color: blue;
}
.input-wrapper_46670517.input-staticContainer_46670517.input-mine_46670517 {
  color: #000;
}
.input-wrapper_46670517.input-staticContainer_46670517.input-mine_46670517:not(.input-test_46670517) > span {
  color: orange;
}
.input-wrapper_46670517, .input-wrapper_46670517:hover {
  color: green;
  animation: transferHighlightIn_46670517 1s;
}
@keyframes transferHighlightIn_46670517 {
  0% {
    background: bae7ff;
    color: red;
  }
  100% {
    background: transparent;
  }
}
`);

  expect(clsHashMap).not.toBeNull(); // TODO
});
