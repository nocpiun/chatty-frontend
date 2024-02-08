import React, { useEffect } from "react";
import { Card, Title, TextInput, PasswordInput, Button, Group, Anchor } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import md5 from "md5";
import Cookies from "js-cookie";

import Socket from "@/socket";
import useQuery from "@/hooks/useQuery";
import { PacketType } from "@/types";

const Login: React.FC = () => {
    const form = useForm({
        initialValues: {
            userName: "",
            password: ""
        }
    });
    const query = useQuery();

    const handleSubmit = ({ userName, password }: any) => {
        if(userName.length === 0 || password.length === 0) return;

        const encrypted = md5(password);

        Socket.get().send(PacketType.LOGIN, {
            userName,
            password: encrypted
        });
    };

    useEffect(() => {
        const socket = Socket.get();

        socket.connect("/login", {
            onOpen() {
                
            },
            onMessage(packet) {
                switch(packet.type) {
                    case PacketType.LOGIN:
                        if(typeof packet.data !== "string") return;

                        Cookies.set("chatty-token", packet.data);
                        window.location.href = "/chat";
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
        if(query.get("registered") !== "1") return;

        showNotification({
            title: "注册成功！",
            message: "请再次输入用户名和密码以登录。",
            color: "teal"
        });
    }, [query]);

    return (
        <div className="h-[100vh] flex flex-col justify-center">
            <Card withBorder radius="md" className="w-[400px] ml-auto mr-auto">
                <Card.Section className="p-5 pt-7 pb-3">
                    <Title order={2}>登录 Chatty</Title>
                </Card.Section>

                <Card.Section className="p-5 pt-0">
                    <form className="space-y-3" onSubmit={form.onSubmit((e) => handleSubmit(e))}>
                        <TextInput withAsterisk label="用户名" placeholder="请输入用户名..." {...form.getInputProps("userName")}/>
                        <PasswordInput withAsterisk label="密码" placeholder="请输入密码..." {...form.getInputProps("password")}/>

                        <Button variant="filled" fullWidth type="submit">登录</Button>
                
                        <Group justify="flex-end">
                            <Anchor href="/register" className="text-sm">没有账号？注册一个！</Anchor>
                        </Group>
                    </form>
                </Card.Section>
            </Card>
        </div>
    );
};

export default Login;
