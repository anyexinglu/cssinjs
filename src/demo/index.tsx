import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Redirect,
  Switch,
  Route
} from "react-router-dom";
// import Static from "./Static";
// import Dynamic from "./Dynamic";
import Code from "./Code";
import Test from "./Test";

const Demo = () => {
  return (
    <div className="Demo">
      <Static>这是一个很好玩的静态盒子</Static>
      <Dynamic color="red">这是一个很好玩的动态盒子</Dynamic>
      <Dynamic color="blue">这是一个很好玩的动态盒子</Dynamic>
      {/* <Code>这是一个很好玩的动态盒子</Code> */}
    </div>
  );
};

ReactDOM.render(<Demo />, document.getElementById("root"));

export default Demo;
