import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./AIAudienceEngine";

// 使用新的樣式路徑
import "./styles/main.css";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
