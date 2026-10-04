import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

export const Header = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState<"pass-gen" | "pass-man">(
        searchParams.get("page") === "pass-man" ? "pass-man" : "pass-gen",
    );

    useEffect(() => {
        setSearchParams({ page: page });
    }, [page, setSearchParams]);

    return (
        <div className="bg-bg w-full flex flex-row justify-center gap-8 py-6 z-100">
            <button
                onClick={() => setPage("pass-gen")}
                className={`
                    ${page === "pass-gen" ? "text-primary" : "text-text active:bg-primary cursor-pointer"}
                    px-4 py-2 rounded-lg
                `}
            >
                PassGen
            </button>
            <button
                onClick={() => setPage("pass-man")}
                className={`
                    ${page === "pass-man" ? " text-primary" : "text-text active:bg-primary cursor-pointer"}
                    px-4 py-2 rounded-lg
                `}
            >
                PassMan
            </button>
        </div>
    );
};
