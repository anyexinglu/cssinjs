import React from "react";
import { stylex } from "../utils/stylex";

interface DynamicProps {
  bgColor?: string;
  color?: string;
  children?: React.ReactNode;
}

const styles = stylex.create({
  wrapper: {
    color: "red",
    padding: "10px",
    backgroundColor: "#ffeb3b"
  },
  dynamicContainer: {
    border: "1px solid #ccc"
  }
});

const Dynamic = (props: DynamicProps) => {
  const { children } = props;
  return (
    <div className={styles("wrapper", "dynamicContainer")}>
      {children || "这是一个盒子"}
    </div>
  );
};

export default Dynamic;
