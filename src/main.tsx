import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import "./styles/global.css";
import { ConfigProvider, theme as antdThemeAlgorithm } from "antd";
import { antdTheme } from "./styles/theme.ts";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        algorithm: antdThemeAlgorithm.darkAlgorithm,
        ...antdTheme,
      }}
    >
      <BrowserRouter>
        <App />
         <Toaster
              theme="dark"
              position="top-right"
              richColors
              closeButton
            />
      </BrowserRouter>
    </ConfigProvider>
  </StrictMode>,
);
