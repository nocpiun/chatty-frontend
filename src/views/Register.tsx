import React, { useEffect } from "react";
import { Card, Title, TextInput, PasswordInput, Button, Group, Anchor } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import md5 from "md5";

import Socket from "@/socket";
import { PacketType } from "@/types";

const Register: React.FC = () => {
    const form = useForm({
        initialValues: {
            userName: "",
            password: "",
            passwordAgain: ""
        },
        validate: {
            userName: (value) => (value.length >= 2 ? null : "用户名长度不可小于2位"),
            password: (value) => (value.length >= 8 ? null : "密码长度不可小于8位"),
            passwordAgain: (value, values) => (value === values.password ? null : "两次输入的密码不一致"),
        }
    });

    const handleSubmit = ({ userName, password, passwordAgain }: any) => {
        if(
            password !== passwordAgain ||
            userName < 2 ||
            password < 8
        ) return;

        const encrypted = md5(password);

        Socket.get().send(PacketType.REGISTER, {
            userName,
            password: encrypted
        });
    };

    useEffect(() => {
        const socket = Socket.get();

        socket.connect("/register", {
            onMessage(packet) {
                switch(packet.type) {
                    case PacketType.REGISTER:
                        window.location.href = "/login?registered=1";
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

    return (
        <div className="h-[100vh] flex flex-col justify-center">
            <Card withBorder radius="md" className="w-[400px] ml-auto mr-auto">
                <Card.Section className="p-5 pt-7 pb-3">
                    <Title order={2}>注册账号</Title>
                </Card.Section>

                <Card.Section className="p-5 pt-0">
                    <form className="space-y-3" onSubmit={form.onSubmit((e) => handleSubmit(e))}>
                        <TextInput withAsterisk label="用户名" placeholder="请输入用户名..." {...form.getInputProps("userName")}/>
                        <PasswordInput withAsterisk label="密码" placeholder="请输入密码..." {...form.getInputProps("password")}/>
                        <PasswordInput withAsterisk label="重复密码" placeholder="请再次输入密码..." {...form.getInputProps("passwordAgain")}/>

                        <Button variant="filled" fullWidth type="submit">注册</Button>
                
                        <Group justify="flex-end">
                            <Anchor href="/login" className="text-sm">已有账号？直接登录！</Anchor>
                        </Group>
                    </form>
                </Card.Section>
            </Card>
        </div>
    );
};

export default Register;

