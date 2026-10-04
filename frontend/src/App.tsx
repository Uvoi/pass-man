import { useSearchParams } from "react-router";

import { Header } from "./components/Header";
import { PassGen, PassMan } from "./pages";

const menu = {
    "pass-gen": <PassGen />,
    "pass-man": <PassMan />,
};

export const App = () => {
    const [searchParams] = useSearchParams();
    const page = searchParams.get("page");

    return (
        <div className="bg-bg min-h-screen w-full flex flex-col justify-center px-4">
            <Header />
            {page && menu[page as keyof typeof menu] ? (
                menu[page as keyof typeof menu]
            ) : (
                <PassGen />
            )}
        </div>
    );
};
