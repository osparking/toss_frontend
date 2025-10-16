import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import WidgetCheckoutPage from "./WidgetCheckoutPage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <WidgetCheckoutPage />
  </StrictMode>
);
