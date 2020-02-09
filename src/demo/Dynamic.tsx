import React from "react";
// import { stylex } from "../utils/stylex";

interface DynamicProps {
  bgColor?: string;
  color?: string;
  children?: React.ReactNode;
}

// reference: https://cssinjs.org/react-jss/?v=v10.0.4#dynamic-values
// const styles = stylex.createDynamic("dynamic", {
//   myButton: {
//     padding: props => props.spacing
//   },
//   myLabel: props => ({
//     display: "block",
//     color: props.labelColor,
//     fontWeight: props.fontWeight,
//     fontStyle: props.fontStyle
//   })
// });

const Dynamic = (props: DynamicProps) => {
  const { children } = props;
  // const classes = styles(props);
  return <div className={"wrapper"}>{children || "这是一个盒子"}</div>;
};

export default Dynamic;
