/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import MainContext from "@/contexts/MainContext";

const Login = lazy(() => import("@/views/Login"));
const Register = lazy(() => import("@/views/Register"));
const Chat = lazy(() => import("@/views/Chat"));
const NotFound = lazy(() => import("@/views/NotFound"));

const App: React.FC = () => {
    return (
        <MainContext.Provider value={{ }}>
            <MantineProvider>
                <Router>
                    <Suspense>
                        <Routes>
                            <Route path="/" element={<Navigate to="/login"/>}/>
                            <Route path="/login" element={<Login />}/>
                            <Route path="/register" element={<Register />}/>
                            <Route path="/chat" element={<Chat />}/>
                            <Route path="/chat/:room" element={<Chat />}/>
                            <Route path="*" element={<NotFound />}/>
                        </Routes>
                    </Suspense>
                </Router>

                <Notifications />
            </MantineProvider>
        </MainContext.Provider>
    );
}

export default App;
