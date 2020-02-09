import React from "react";
import ReactDOM from "react-dom";
import Static from "./Static";
import Dynamic from "./Dynamic";
// import Code from "./Code";

const Demo = () => {
  return (
    <div className="Demo">
      <Static>这是一个很好玩的静态盒子</Static>
      <Dynamic>这是一个很好玩的动态盒子</Dynamic>
      {/* <Code>这是一个很好玩的动态盒子</Code> */}
    </div>
  );
};

ReactDOM.render(<Demo />, document.getElementById("root"));

export default Demo;
