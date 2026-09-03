import {
    createContext,
    useContext,
    useState,
} from "react";

import type { ReactNode } from "react";

interface ModelContextType {
    model: string;
    setModel: (model: string) => void;
}

const ModelContext = createContext<ModelContextType>({
    model: "gemini-flash",
    setModel: () => { },
});

interface ModelProviderProps {
    children: ReactNode;
}

export function ModelProvider({
    children,
}: ModelProviderProps) {

    const [model, setModel] =
        useState<string>("gemini-flash");

    return (
        <ModelContext.Provider
            value={{
                model,
                setModel,
            }}
        >
            {children}
        </ModelContext.Provider>
    );
}

export function useModel() {
    return useContext(ModelContext);
}