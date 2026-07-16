import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import "./styles/global.css";
import { ConfigProvider, theme as antdThemeAlgorithm } from "antd";
import { antdTheme } from "./styles/theme.ts";
import { Toaster } from "sonner";
import { persistor, store } from "./redux/store.ts";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConfigProvider
          theme={{
            algorithm: antdThemeAlgorithm.darkAlgorithm,
            ...antdTheme,
          }}
        >
          <BrowserRouter>
            <App />
            <Toaster theme="dark" position="top-right" richColors closeButton />
          </BrowserRouter>
        </ConfigProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
);
