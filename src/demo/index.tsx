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
      <Router>
        <Switch>
          {/* <Redirect path="/" exact to="/docs/introduction" /> */}
          <Route path="/" component={Code} />
          <Route path="/test" component={Test} />
        </Switch>
      </Router>
    </div>
  );
};

ReactDOM.render(<Demo />, document.getElementById("root"));

export default Demo;
