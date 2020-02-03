import React from "react";
import stylex from "../utils/stylex";

interface BoxProps {
  bgColor?: string;
  color?: string;
  children?: React.ReactNode;
}

const styles = stylex.create({
  outerWrapper: {
    color: "red",
    padding: "10px",
    backgroundColor: "#ffeb3b"
  },
  container: {
    border: "1px solid #ccc"
  }
});

const Box = (props: BoxProps) => {
  const { children } = props;
  return (
    <div className={styles("outerWrapper", "container")}>
      {children || "这是一个盒子"}
    </div>
  );
};

export default Box;
