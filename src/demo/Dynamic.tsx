import React from "react";
import { stylex } from "../utils/stylex";

interface DynamicProps {
  bgColor?: string;
  color?: string;
  children?: React.ReactNode;
}

// reference: https://cssinjs.org/react-jss/?v=v10.0.4#dynamic-values
const getStyles = stylex.createDynamic("dynamic", {
  wrapper: {
    background: (props: Partial<DynamicProps>) => props.bgColor || ""
  },
  myBox: (props: Partial<DynamicProps>) => ({
    display: "block",
    color: props.color || ""
  })
});

const Dynamic = (props: DynamicProps) => {
  const { children } = props;
  const styles = getStyles(props);
  return (
    <div className={styles("wrapper", "myBox")}>
      {children || "这是一个盒子"}
    </div>
  );
};

export default Dynamic;
