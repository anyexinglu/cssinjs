import React from "react";
// import { render } from "react-dom";
import {
  FileExplorer,
  CodeMirror,
  BrowserPreview,
  SandpackProvider
} from "react-smooshpack/es/components/index";
import "react-smooshpack/dist/styles.css";
// import CodeMirror from "CodeMirror/src/codemirror";

const files = {
  "/test.js": {
    code: "document.body.innerHTML = `<div>xxx</div>`"
  }
};

const dependencies = {
  // uuid: "latest"
};

const Code = () => (
  <SandpackProvider files={files} dependencies={dependencies} entry="/test.js">
    <div style={{ display: "flex", width: "100%", height: "100%" }}>
      <FileExplorer style={{ width: 300 }} />
      <CodeMirror style={{ flex: 1 }} />
      <BrowserPreview style={{ flex: 1 }} />
    </div>
  </SandpackProvider>
);

export default Code;
