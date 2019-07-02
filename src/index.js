import React from "react";
import ReactDOM from "react-dom";
// import CssBaseline from "@material-ui/core/CssBaseline";

// import { ThemeProvider } from "@material-ui/styles";
import "./index.css";
// import theme from "./theme";

import App from "./components/App";
import Firebase, { FirebaseContext } from "./components/Firebase";

import * as serviceWorker from "./serviceWorker";

// const globalTheme = () => (
//   <ThemeProvider theme={theme}>
//     <CssBaseline />
//     <Firebase.Provider value={new Firebase()}>
//       <App />
//     </Firebase.Provider>
//   </ThemeProvider>
// );
// const globalTheme = () => (
//     <Firebase.Provider value={new Firebase()}>
//       <App />
//     </Firebase.Provider>
// );

ReactDOM.render(<FirebaseContext.Provider value={new Firebase()}>
<App />
</FirebaseContext.Provider>, document.getElementById("root"));

serviceWorker.unregister();
