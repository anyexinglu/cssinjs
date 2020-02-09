import React from "react";
import ReactDOM from "react-dom";
import Static from "./Static";

const Demo = () => {
  return (
    <div className="Demo">
      <Static>这是一个很好玩的盒子</Static>
    </div>
  );
};

ReactDOM.render(<Demo />, document.getElementById("root"));

export default Demo;
