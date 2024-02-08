import React, { useEffect } from "react";
import Cookies from "js-cookie";

import Socket from "@/socket";
import Loading from "@/components/Loading";

const Gateway: React.FC = () => {
    useEffect(() => {
        const socket = Socket.get();
        
        socket.connect("/gateway", {
            onOpen() {
                var cookie = Cookies.get("chatty-token");
                socket.closeCurrentConnection();
                window.location.href = cookie ? "/chat" : "/login";
            },
            onError(err) {
                throw err;
            }
        });

        return () => socket.closeCurrentConnection();
    }, []);

    return (
        <div className="w-[100vw] h-[100vh] flex flex-col justify-center">
            <h1 className="mt-0 mb-7 ml-auto mr-auto text-7xl font-extrabold text-gray-200">Chatty</h1>
            <Loading />
        </div>
    );
}

export default Gateway;
