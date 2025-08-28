import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom"; // <- importante
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter> {/* <- Envuelve toda la app */}
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);