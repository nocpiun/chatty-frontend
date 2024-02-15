import React from "react";
import { Title, Text, Anchor } from "@mantine/core";

import Page from "@/components/Page";

const NotFound: React.FC = () => {
    return (
        <Page>
            <div className="w-full space-y-6 text-center">
                <Title fw={800} size="260px" c="blue">404</Title>
                <Text fw={200} size="20px">找不到页面，你可以选择<Anchor href="/">返回主页</Anchor></Text>
            </div>
        </Page>
    );
}

export default NotFound;
