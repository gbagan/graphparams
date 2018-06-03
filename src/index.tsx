import * as React from "react";
import * as ReactDOM from "react-dom";

import "./antd.css";
import "./modules.d.ts";
import "./redux.d.ts";
import "./styled.d.ts";

import App from "./App";

window.onload = () => {
    const el = document.getElementById("root");
    ReactDOM.render(<App/>, el);
};
