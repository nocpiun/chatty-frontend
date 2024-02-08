/** @see net.nocpiun.chatty.server.PacketType enum */
export enum PacketType {
    HANDSHAKE = "HANDSHAKE",
    CLOSE = "CLOSE",
    ERROR = "ERROR",
    REGISTER = "REGISTER",
    LOGIN = "LOGIN"
}

export type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;

export interface PropsWithClassName {
    className?: string
}
