import React, { useContext } from "react";
import { useNavigate } from "react-router";
import { Container, Space, Text } from "@mantine/core";

import ChatContext from "@/contexts/ChatContext";
import type { Room } from "@/types";
import Utils from "@/utils/Utils";

interface RoomListProps {
    rooms: Room[]
}

const RoomList: React.FC<RoomListProps> = (props) => {
    const { selfName, roomId } = useContext(ChatContext);
    const navigate = useNavigate();

    return (
        <Container className="h-[498px] pb-5 space-y-3 overflow-y-auto">
            {
                props.rooms.map((room, index) => {
                    return (
                        <Container
                            className="pt-2 pb-2 rounded cursor-pointer transition-all hover:bg-gray-100"
                            onClick={() => {
                                roomId !== room.id && navigate("/chat/"+ room.id);
                            }}
                            key={index}>
                            <Text fw={700}>{Utils.arrayExclude(room.members, selfName)}</Text>
                            <Space className="h-1"/>
                            <Text c="gray" size="sm">Some messages...</Text>
                        </Container>
                    );
                })
            }
        </Container>
    );
}

export default RoomList;
