import { useReducer } from "react";

export default function useUpdate(): () => void {
    const [, update] = useReducer((x) => x + 1, 0);

    return () => update();
}
