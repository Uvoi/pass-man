import {
    useRef,
    useState,
} from "react";

import GenerateWorker from "../../components/Generate/generate.worker.ts?worker";

import {
    defaultSettings,
    getCharset,
    type GenerateSettings,
} from "../../components/Generate/generate";

import type { PassItem } from "../../types/pass";


type UsePassGenParams = {
    onGenerated?: (item: PassItem) => Promise<void>;
};


export const usePassGen = ({
    onGenerated,
}: UsePassGenParams = {}) =>
{
    const [masterKey, setMasterKey] =
        useState("");

    const [key, setKey] =
        useState("");

    const [tag, setTag] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [settings, setSettings] =
        useState<GenerateSettings>(
            defaultSettings,
        );

    const [loading, setLoading] =
        useState(false);

    const [errorMsg, setErrorMsg] =
        useState("");

    const [titleTrigger, setTitleTrigger] =
        useState(0);


    const clearTimer =
        useRef<ReturnType<typeof setTimeout> | null>(
            null,
        );

    const errorTimer =
        useRef<ReturnType<typeof setTimeout> | null>(
            null,
        );


    const masterKeyError =
        masterKey.length > 0 &&
        (
            masterKey.includes(" ") ||
            masterKey.length < 6
        );

    const keyError =
        key.length > 0 &&
        (
            key.includes(" ") ||
            key.length < 2
        );


    const showError = (
        message: string,
    ) =>
    {
        setErrorMsg(message);

        if (errorTimer.current)
        {
            clearTimeout(
                errorTimer.current,
            );
        }

        errorTimer.current = setTimeout(
            () => setErrorMsg(""),
            5_000,
        );
    };


    const generatePassword = async (
        addToPassMan: boolean,
    ) =>
    {
        const alphabetError =
            getCharset(settings).length === 0;

        if (
            masterKeyError ||
            keyError ||
            alphabetError ||
            !masterKey ||
            !key
        )
        {
            const message =
                !masterKey || !key
                    ? "Fill fields"
                    : alphabetError
                        ? "Choose alphabet"
                        : "Fix errors";

            showError(message);

            return;
        }

        setLoading(true);

        setTitleTrigger(
            previous => previous + 1,
        );

        try
        {
            const pass = await new Promise<string>(
                resolve =>
                {
                    const worker =
                        new GenerateWorker();

                    worker.onmessage =
                        (
                            event: MessageEvent<string>,
                        ) =>
                        {
                            resolve(event.data);

                            worker.terminate();
                        };

                    worker.postMessage({
                        masterKey,
                        key,
                        tag,
                        params: settings,
                    } satisfies {
                        masterKey: string;
                        key: string;
                        tag: string;
                        params: GenerateSettings;
                    });
                },
            );

            setPassword(pass);

            if (clearTimer.current)
            {
                clearTimeout(
                    clearTimer.current,
                );
            }

            clearTimer.current = setTimeout(
                () => setPassword(""),
                30_000,
            );

            setErrorMsg("");

            if (addToPassMan && onGenerated)
            {
                const item: PassItem = {
                    id: 0,
                    key,
                    tag,
                    params: settings,
                };

                await onGenerated(item);
            }
        }
        catch
        {
            showError(
                "Failed to generate password",
            );
        }
        finally
        {
            setLoading(false);
        }
    };


    const reset = () =>
    {
        setMasterKey("");
        setKey("");
        setTag("");
        setPassword("");
    };


    return {
        masterKey,
        key,
        tag,
        password,
        settings,
        loading,
        errorMsg,
        titleTrigger,

        masterKeyError,
        keyError,

        setMasterKey,
        setKey,
        setTag,
        setSettings,

        generatePassword,
        reset,
    };
};
