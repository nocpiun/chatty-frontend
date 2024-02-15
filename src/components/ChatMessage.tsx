import React from "react";
import { Container, Flex, Text } from "@mantine/core";

import Utils from "@/utils/Utils";

interface ChatMessageProps {
    msgKey: number // to avoid `key` props
    sender: string
    content: string
    time: number
    isSelf: boolean
}

const ChatMessage: React.FC<ChatMessageProps> = (props) => {
    
    return (
        <Container className={props.isSelf ? "mr-0" : "ml-0"} data-message-key={props.msgKey}>
            <Flex direction="column" className="space-y-1">
                <Text c="gray" size="xs" className={props.isSelf ? "text-right" : "text-left"}>{props.sender} - {Utils.getFormattedTime(new Date(props.time))}</Text>
                <Flex justify={props.isSelf ? "end" : "start"}>
                    <div className={"w-fit max-w-72 bg-gray-200 pt-1 pb-1 pl-2 pr-2 rounded-lg "+ (props.isSelf ? "rounded-tr-none" : "rounded-tl-none")}>
                        <Text size="sm" className=" break-words">{props.content}</Text>
                    </div>
                </Flex>
            </Flex>
        </Container>
    );
}

export default ChatMessage;
