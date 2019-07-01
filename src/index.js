import React from "react";
import ReactDOM from "react-dom";
import CssBaseline from "@material-ui/core/CssBaseline";

import { ThemeProvider } from "@material-ui/styles";
import "./index.css";
import theme from "./theme";

import App from "./components/App";
import * as serviceWorker from "./serviceWorker";

const globalTheme = () =><ThemeProvider theme={theme}>
<CssBaseline />
<App />
</ThemeProvider>;


ReactDOM.render(
 globalTheme(),
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
