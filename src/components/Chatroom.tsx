import React, { useState, useEffect, useRef, useMemo, useContext } from "react";
import { Button, Card, CloseButton, Flex, Text, Textarea, ActionIcon, Menu, rem } from "@mantine/core";
import Cookies from "js-cookie";

import ChatContext from "@/contexts/ChatContext";
import ChatMessage from "@/components/ChatMessage";
import Socket from "@/socket";
import Utils from "@/utils/Utils";
import Emitter from "@/utils/Emitter";
import { Message, PacketType, Room } from "@/types";

import useUpdate from "@/hooks/useUpdate";

import { IconDots, IconTrash } from "@tabler/icons-react";

interface ChatroomProps {
    room: Room
}

const Chatroom: React.FC<ChatroomProps> = (props) => {
    const { selfName, roomId } = useContext(ChatContext);
    const friendName = useMemo(() => Utils.arrayExclude(props.room.members, selfName), [props.room.members, selfName]);
    const [message, setMessage] = useState<string>("");
    const [dialogs, setDialogs] = useState<Message[]>([]);
    const inputRef = useRef<HTMLTextAreaElement | null>(null);
    const update = useUpdate();

    const handleClear = () => {
        if(!inputRef.current) return;

        inputRef.current.value = "";
        setMessage("");
    };

    const handleDeleteFriend = () => {
        Socket.get().send(PacketType.DELETE_FRIEND, { roomId, friendName, token: Cookies.get("chatty-token") });
    };

    const handleSendMessage = () => {
        Socket.get().send(PacketType.MESSAGE, {
            roomId,
            token: Cookies.get("chatty-token"),
            sender: selfName,
            content: message
        });
        setMessage("");
    };

    useEffect(() => {
        Socket.get().send(PacketType.ROOM_DETAIL, roomId);
    }, [roomId]);

    useEffect(() => {
        if(!inputRef.current) return;

        inputRef.current.value = message;
    }, [message]);

    useEffect(() => {
        Emitter.get().once("dialog-change", (updated) => {
            setDialogs(updated);
            update();
        });
    }, [update]);

    useEffect(() => {
        Utils.scrollToEnd("messages");
        inputRef.current && inputRef.current.focus();
    });

    return (
        <Card className="h-full p-0">
            <Card.Section withBorder className="flex-1 w-full m-0 pl-4 pr-4 flex justify-between">
                <Flex direction="column" justify="center">
                    <Text fw={700}>{friendName}</Text>
                </Flex>

                <Flex direction="column" justify="center">
                    <Menu shadow="md">
                        <Menu.Target>
                            <ActionIcon variant="transparent" color="gray">
                                <IconDots />
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Label>操作</Menu.Label>
                            <Menu.Item
                                leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }}/>}
                                color="red"
                                onClick={() => handleDeleteFriend()}>
                                删除好友
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Flex>
            </Card.Section>

            <Card.Section withBorder className="h-[330px] m-0 p-3 pt-4 pb-4 flex flex-col space-y-3 overflow-y-auto" id="messages">
                {
                    dialogs.map((message, index) => {
                        return (
                            <ChatMessage
                                msgKey={message.key}
                                sender={message.sender}
                                content={message.content}
                                time={message.time}
                                isSelf={message.isSelf}
                                key={index}/>
                        );
                    })
                }
            </Card.Section>

            <Card.Section className="min-h-28 max-h-28 m-0 pl-3 pr-3 pt-1 pb-1 overflow-y-auto cursor-text">
                <Textarea
                    variant="unstyled"
                    placeholder="输入文字..."
                    autosize
                    className="w-full h-full"
                    onChange={(e) => setMessage(e.target.value)}
                    ref={inputRef}/>
            </Card.Section>
            
            <Card.Section className="h-16 m-0 flex justify-end space-x-3">
                <Flex direction="column" justify="center">
                    {message.length > 0 && <CloseButton onClick={() => handleClear()}/>}
                </Flex>

                <Flex direction="column" justify="center">
                    <Button
                        variant="filled"
                        color="teal"
                        className="mr-3 transition-all"
                        disabled={!(message.length > 0)}
                        onClick={() => handleSendMessage()}>发送</Button>
                </Flex>
            </Card.Section>
        </Card>
    );
}

export default Chatroom;
