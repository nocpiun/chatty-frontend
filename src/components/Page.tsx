import { Container } from "@mantine/core";
import React, { PropsWithChildren } from "react";

interface PageProps extends PropsWithChildren {

}

const Page: React.FC<PageProps> = (props) => {
    return (
        <Container className="h-[100vh] flex flex-col justify-center">
            {props.children}
        </Container>
    );
}

export default Page;
