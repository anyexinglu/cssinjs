import React from "react";
import { stylex } from "../utils/stylex";

interface StaticProps {
  bgColor?: string;
  color?: string;
  children?: React.ReactNode;
}

const styles = stylex.create({
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
  },
  staticContainer: {
    border: "1px solid #ccc"
  }
});

const Static = (props: StaticProps) => {
  const { children } = props;
  return (
    <div className={styles("wrapper", "staticContainer")}>
      {children || "这是一个盒子"}
      <p>这是一个段落</p>
    </div>
  );
};

export default Static;
