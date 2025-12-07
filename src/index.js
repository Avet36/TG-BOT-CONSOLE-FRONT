import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { store } from "./Store/store";
import { Provider } from "react-redux";
import { Buffer } from "buffer";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

// Polyfill for Buffer
window.Buffer = Buffer;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <TonConnectUIProvider
        manifestUrl={"https://app.console-pro.com/tonconnect-manifest.json"}
      >
        <App />
      </TonConnectUIProvider>
    </BrowserRouter>
  </Provider>
);
