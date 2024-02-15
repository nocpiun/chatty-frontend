import React, { useContext } from "react";
import { Button, Container, Flex, Text } from "@mantine/core";
import Cookies from "js-cookie";

import Socket from "@/socket";
import ChatContext from "@/contexts/ChatContext";
import { PacketType } from "@/types";

const Navbar: React.FC = () => {
    const { selfName } = useContext(ChatContext);

    const handleLogout = () => {
        Socket.get().send(PacketType.LOGOUT, Cookies.get("chatty-token"));
    };

    const handleUnregister = () => {
        Socket.get().send(PacketType.UNREGISTER, Cookies.get("chatty-token"));
    };
    
    return (
        <Container className="w-[800px] h-full ml-auto mr-auto">
            <Flex justify="space-between">
                <Flex direction="column" justify="center">
                    <Text fw={700} size="lg" className="h-auto align-middle">{selfName}</Text>
                </Flex>

                <Flex className="space-x-3">
                    <Button variant="light">账号</Button>
                    <Button variant="light" color="red" onClick={() => handleLogout()}>登出</Button>
                    <Button variant="light" color="red" onClick={() => handleUnregister()}>注销</Button>
                </Flex>
            </Flex>
        </Container>
    );
}

export default Navbar;
