import { useSearchParams } from "react-router";

import { Header } from "./components/Header";
import { PassGen, PassMan } from "./pages";

export const App = () => {
    const [searchParams] = useSearchParams();
    const isPassManPage = searchParams.get("page") === "pass-man";

    return (
        <div className="bg-bg min-h-screen w-full flex flex-col justify-center px-4">
            <Header />
            <div className={isPassManPage ? "hidden" : "block"}>
                <PassGen />
            </div>
            <div className={isPassManPage ? "block" : "hidden"}>
                <PassMan isActive={isPassManPage} />
            </div>
        </div>
    );
};
