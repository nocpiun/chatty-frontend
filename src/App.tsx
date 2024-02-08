/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import Gateway from "@/views/Gateway";
import Login from "@/views/Login";
import Register from "@/views/Register";
import Chat from "@/views/Chat";
import NotFound from "@/views/NotFound";

import MainContext from "@/contexts/MainContext";

const App: React.FC = () => {
    return (
        <MainContext.Provider value={{ }}>
            <MantineProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Gateway />}/>
                        <Route path="/login" element={<Login />}/>
                        <Route path="/register" element={<Register />}/>
                        <Route path="/chat" element={<Chat />}/>
                        <Route path="*" element={<NotFound />}/>
                    </Routes>
                </Router>

                <Notifications />
            </MantineProvider>
        </MainContext.Provider>
    );
}

export default App;
