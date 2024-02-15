import React from "react";

interface ChatContextType {
    selfName?: string
    roomId?: string
}

const ChatContext = React.createContext<ChatContextType>(undefined!);

export default ChatContext;
