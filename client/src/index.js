import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-s26rfevc.us.auth0.com"
      clientId="mJ2Ebw7RPPMqird54IzPn3LaKdkD4WFH"
      redirectUri="http://localhost:3000/teacher"
    >
      <App />
    </Auth0Provider>
    ,
  </React.StrictMode>,
  document.getElementById("root")
);
