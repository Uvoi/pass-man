import { getPassword } from "./generate";
import type { GenerateSettings } from "./generate";

type WorkerInput = {
    masterKey: string;
    key: string;
    tag: string;
    params: GenerateSettings;
};

self.onmessage = async (e: MessageEvent<WorkerInput>) => {
    const { masterKey, key, tag, params } = e.data;
    const password = await getPassword(masterKey, key, tag, params);
    self.postMessage(password);
};
