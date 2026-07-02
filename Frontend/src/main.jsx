import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AdminContext from "./context/AdminContext";
import UserContext from "./context/UserContext";
import "./index.css";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  
  <BrowserRouter>
    <UserContext>
      <AdminContext>
        <App />
      </AdminContext>
    </UserContext>
  </BrowserRouter>
);