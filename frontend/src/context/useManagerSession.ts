import { useContext } from "react";

import { ManagerSessionContext } from "./managerSessionContext.ts";

export const useManagerSession = () => {
    const context = useContext(ManagerSessionContext);

    if (!context) {
        throw new Error("useManagerSession must be used inside ManagerSessionProvider");
    }

    return context;
};
