import * as React from "react";
import * as ReactDOM from "react-dom";

import "@/ui/global.scss";
import "./modules.d.ts";
import "./redux.d.ts";

import App from "./App";

window.onload = () => {
    const el = document.getElementById("root");
    ReactDOM.render(<App/>, el);
};
