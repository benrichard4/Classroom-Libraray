import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import CurrentUserProvider from "./component/context/CurrentUserContext";
import CheckoutProvider from "./component/context/CheckoutContext";
import ReturnProvider from "./component/context/ReturnContext";

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-s26rfevc.us.auth0.com"
      clientId="mJ2Ebw7RPPMqird54IzPn3LaKdkD4WFH"
      redirectUri="http://localhost:3000/teacher"
    >
      <CurrentUserProvider>
        <CheckoutProvider>
          <ReturnProvider>
            <App />
          </ReturnProvider>
        </CheckoutProvider>
      </CurrentUserProvider>
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
