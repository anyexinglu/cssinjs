// Reference: https://github.com/rexxars/hyphenate-style-name/blob/master/test/hyphenate-style-name.test.js

import { getStyle } from "../utils";

test("getStyle should work", () => {
  const { stylesheet, clsHashMap } = getStyle({
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
  expect(stylesheet).toBe(`.wrapper-46670517 {
  color: red;
  padding: 10px;
  background-color: #ffeb3b;
}
.wrapper-46670517 p {
  color: yellow;
}
.wrapper-46670517 p span {
  color: #a00;
}
.wrapper-46670517.left-46670517, .wrapper-46670517.right-46670517 {
  height: 100%;
  width: 0;
}
.wrapper-46670517 svg.iconSuffix-46670517 {
  vertical-align: middle;
}
.wrapper-46670517 .inner-46670517 {
  color: gray;
}
.wrapper-46670517.staticContainer-46670517 {
  padding: 15px;
}
.wrapper-46670517.staticContainer-46670517 span {
  color: red;
}
.wrapper-46670517.staticContainer-46670517 p {
  color: blue;
}
.wrapper-46670517.staticContainer-46670517.mine-46670517 {
  color: #000;
}
.wrapper-46670517.staticContainer-46670517.mine-46670517:not(.test-46670517) > span {
  color: orange;
}
.wrapper-46670517, .wrapper-46670517:hover {
  color: green;
  animation: transferHighlightIn-46670517 1s;
}
@keyframes transferHighlightIn-46670517 {
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
