import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { HubProvider } from "./context/HubContext";
import "./pages-styling/global.css";
import "./pages-styling/shared.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <HubProvider>
          <App />
        </HubProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
