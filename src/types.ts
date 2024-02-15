/** @see net.nocpiun.chatty.server.PacketType enum */
export enum PacketType {
    HANDSHAKE = "HANDSHAKE",
    CLOSE = "CLOSE",
    ERROR = "ERROR",
    REGISTER = "REGISTER",
    UNREGISTER = "UNREGISTER",
    LOGIN = "LOGIN",
    LOGOUT = "LOGOUT",
    PROFILE = "PROFILE",
    ROOM = "ROOM",
    ROOM_DETAIL = "ROOM_DETAIL",
    ADD_FRIEND = "ADD_FRIEND",
    DELETE_FRIEND = "DELETE_FRIEND",
    MESSAGE = "MESSAGE"
}

export type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;

export interface PropsWithClassName {
    className?: string
}

export interface User {
    userName: string
}

/** @see net.nocpiun.chatty.chat.Message */
export interface Message {
    key: number
    sender: string
    content: string
    time: number
    isSelf: boolean // not exist in java class
}

/** @see net.nocpiun.chatty.chat.Room class */
export interface Room {
    id: string
    members: [string, string] // direct messages only
    name?: string
}
