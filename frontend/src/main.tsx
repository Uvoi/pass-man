import "./index.css";

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
