import { isPlaying } from "./transport";
import { timeFunctions } from "./sequencers";

export const initCodeListeners = () => {
    window.addEventListener("evaluateCode", (e) => {
        const customEvent = e as CustomEvent<{ code: string }>;
        
        isPlaying.set(true);

        try {
            let s0 = (t: number) => t, s1 = (t: number) => t, s2 = (t: number) => t, s3 = (t: number) => t;

            eval(customEvent.detail.code);

            const scope = { 0: s0, 1: s1, 2: s2, 3: s3 };
            timeFunctions.update(tf => ({
                ...tf,
                ...scope
            }));
            
        } catch (error) {
            console.error("Error evaluating code:", error);
        }
    });
}