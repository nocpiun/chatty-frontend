/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button, Card, Grid, Group, Modal, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import Cookies from "js-cookie";

import Socket from "@/socket";
import Page from "@/components/Page";
import RoomList from "@/components/RoomList";
import Chatroom from "@/components/Chatroom";
import Navbar from "@/components/Navbar";
import ChatContext from "@/contexts/ChatContext";
import Utils from "@/utils/Utils";
import Emitter from "@/utils/Emitter";
import { PacketType, type Message, type Room, type User } from "@/types";

const Chat: React.FC = () => {
    const roomId = useParams().room;
    const [roomList, setRoomList] = useState<Room[]>([]);
    const [selfUser, setSelfUser] = useState<User | null>(null);
    const [currentRoom, setRoom] = useState<Room | null>(null);
    const [dialogs, setDialogs] = useState<Message[]>([]);
    const addFriendInputRef = useRef<HTMLInputElement | null>(null);
    const [addUserModalOpened, addUserModalOperation] = useDisclosure(false);

    const handleAddFriend = () => {
        if(!addFriendInputRef.current) return;
        const friendName = addFriendInputRef.current.value;
        const token = Cookies.get("chatty-token");

        if(friendName.length === 0) {
            showNotification({
                title: "提示",
                message: "请输入好友名称",
                color: "blue"
            });
            return;
        }

        for(let i = 0; i < roomList.length; i++) {
            if(Utils.arrayExclude(roomList[i].members, selfUser?.userName) === friendName) {
                showNotification({
                    title: "错误",
                    message: "无法重复添加同一个的好友",
                    color: "red"
                });
                return;
            }
        }

        Socket.get().send(PacketType.ADD_FRIEND, { token, friendName });
    };

    useEffect(() => {
        const socket = Socket.get();

        if(!Cookies.get("chatty-token")) {
            window.location.href = "/login";
            return;
        }

        socket.connect("/chat", {
            onOpen() {
                const token = Cookies.get("chatty-token");
                if(!token) {
                    window.location.href = "/login";
                    return;
                }

                socket.send(PacketType.PROFILE, token);
                if(roomId) socket.send(PacketType.ROOM, { roomId, token });
            },
            async onMessage(packet) {
                switch(packet.type) {
                    case PacketType.LOGOUT:
                    case PacketType.UNREGISTER:
                        Cookies.remove("chatty-token");
                        window.location.href = "/login";
                        break;
                    case PacketType.PROFILE:
                        setRoomList(packet.data.rooms);
                        setSelfUser({ userName: packet.data.userName });
                        socket.send(PacketType.HANDSHAKE, Cookies.get("chatty-token"));
                        break;
                    case PacketType.ROOM:
                        setRoom(packet.data);
                        break;
                    case PacketType.ROOM_DETAIL:
                        var list: Message[] = [];
                        var currentSelfUser = await Utils.getCurrentState(setSelfUser);
                        for(let message of packet.data) {
                            list.push({
                                ...message,
                                isSelf: message.sender === currentSelfUser?.userName
                            });
                        }
                        setDialogs(list);
                        Emitter.get().emit("dialog-change", list);
                        break;
                    case PacketType.ADD_FRIEND:
                        setRoomList(packet.data.rooms);
                        addUserModalOperation.close();
                        break;
                    case PacketType.DELETE_FRIEND:
                        setRoomList(packet.data.rooms);
                        window.location.href = "/chat";
                        break;
                    case PacketType.MESSAGE:
                        var currentDialogs = await Utils.getCurrentState(setDialogs);
                        var selfName = (await Utils.getCurrentState(setSelfUser))?.userName;
                        currentDialogs.push({
                            ...packet.data,
                            isSelf: packet.data.sender === selfName
                        });
                        setDialogs(currentDialogs);
                        Emitter.get().emit("dialog-change", currentDialogs);
                        break;
                }
            },
            onError(err) {
                showNotification({
                    title: "错误",
                    message: err,
                    color: "red"
                });
            }
        });

        return () => socket.closeCurrentConnection();
    }, []);

    useEffect(() => {
        document.addEventListener("keypress", (e) => {
            if(e.key === "Enter") handleAddFriend();
        });

        window.addEventListener("beforeunload", () => {
            Socket.get().send(PacketType.CLOSE, Cookies.get("chatty-token"));
        });
    }, []);

    useEffect(() => {
        if(!roomId) {
            setRoom(null);
            return;
        }

        Socket.get().send(PacketType.ROOM, { roomId, token: Cookies.get("chatty-token") });
    }, [useParams().room]);

    return (
        <Page>
            <ChatContext.Provider value={{ selfName: selfUser?.userName, roomId }}>
                <nav className="h-12">
                    <Navbar />
                </nav>

                <Card withBorder radius="md" className="w-[800px] h-[550px] ml-auto mr-auto p-0">
                    <Grid grow align="stretch">
                        <Grid.Col span={1} className="pr-0 border-solid border-t-0 border-b-0 border-l-0 border-r-[calc(.0625rem*var(--mantine-scale))] border-[var(--mantine-color-gray-3)]">
                            <div className="p-2">
                                <Button
                                    variant="default"
                                    fullWidth
                                    color="gray"
                                    onClick={addUserModalOperation.toggle}>
                                    <span dangerouslySetInnerHTML={{ __html: "\ueb0b 添加新朋友" }}/>
                                </Button>
                            </div>
                            <RoomList rooms={roomList}/>
                        </Grid.Col>

                        <Grid.Col span={5} className="pl-0">
                            {currentRoom && <Chatroom room={currentRoom}/>}
                        </Grid.Col>
                    </Grid>
                </Card>

                <Modal
                    title="查找好友并添加"
                    opened={addUserModalOpened}
                    centered
                    onClose={addUserModalOperation.close}
                    className="space-y-2">
                    <Group>
                        <TextInput
                            placeholder="输入好友名称..."
                            data-autofocus
                            className="flex-1"
                            ref={addFriendInputRef}/>
                        <Button variant="filled" onClick={() => handleAddFriend()}>确认</Button>
                    </Group>
                </Modal>
            </ChatContext.Provider>
        </Page>
    );
};

export default Chat;
