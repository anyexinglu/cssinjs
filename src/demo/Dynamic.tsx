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

const getOppositeColor = (color?: string) => (color === "red" ? "blue" : "red");

const Dynamic = (props: DynamicProps) => {
  const { children } = props;
  const [color, setColor] = React.useState(props.color);

  const styles = getStyles({
    ...props,
    color,
    bgColor: getOppositeColor(color)
  });

  return (
    <div>
      <button onClick={() => setColor(getOppositeColor)}>切前景/背景色</button>
      <div className={styles("wrapper", "myBox")}>
        {children || "这是一个盒子"}
      </div>
    </div>
  );
};

export default Dynamic;
