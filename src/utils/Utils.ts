export default class Utils {
    public static getFormattedTime(date: Date): string {
        const hour = date.getHours();
        const minute = date.getMinutes();

        return (hour < 10 ? ("0"+ hour) : hour) +":"+ (minute < 10 ? ("0"+ minute) : minute);
    }

    public static arrayExclude<E>(array: [E, E], item: E): E | null {
        for(let i = 0; i < 2; i++) {
            if(array[i] === item) {
                return array[1 - i];
            }
        }
        return null;
    }

    public static getCurrentState<T>(setState: React.Dispatch<React.SetStateAction<T>>): Promise<T> {
        return new Promise((resolve, reject) => {
            setState((currentState) => {
                resolve(currentState);
                return currentState;
            });
        });
    }

    public static getElem<E extends HTMLElement = HTMLElement>(id: string): E {
        return document.getElementById(id) as E ?? document.body;
    }

    public static scrollToEnd(elem: string | HTMLElement, top: number = 1, left: number = 1): void {
        if(typeof elem === "string") elem = Utils.getElem(elem);
        elem.scrollTo({ top: elem.scrollHeight * top, left: elem.scrollWidth * left });
    }
}
