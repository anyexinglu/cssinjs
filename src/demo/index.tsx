import React from "react";
import ReactDOM from "react-dom";
import Box from "./Box";

const Demo = () => {
  return (
    <div className="Demo">
      <Box>这是一个很好玩的盒子</Box>
    </div>
  );
};

ReactDOM.render(<Demo />, document.getElementById("root"));

export default Demo;
