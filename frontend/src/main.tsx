import "./index.css";

import { isTauri } from "@tauri-apps/api/core";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import { App } from "./App";
import { ManagerSessionProvider } from "./context";

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <ManagerSessionProvider>
            <App />
        </ManagerSessionProvider>
    </BrowserRouter>,
);

if (import.meta.env.PROD && !isTauri() && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        void navigator.serviceWorker.register("/sw.js").catch((error: unknown) => {
            console.error("Failed to register service worker", error);
        });
    });
}
