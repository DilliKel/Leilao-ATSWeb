"use client";
import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Socket } from "socket.io-client";
import DashBoard from "@/components/DashBoard";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { createSocket } from "@/app/socket";
import LoginModal from "@/components/Login";

interface Item {
    id: number;
    nome_prod: string;
    descricao: string;
    image: string;
    valor: number;
    time: number;
    sold: boolean;
    startAt: string;
    bidders: string[];
}

export default function Home() {
    const { data: session, status } = useSession();
    const [items, setItems] = useState<Item[]>([]);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [lances, setLances] = useState(15);

    const subtractLance = () => {
        setLances(lances - 1);
    };

    const addLances = () => {
        setLances(lances + 5);
    };

    const handleLogout = () => {
        socket?.disconnect();
        setSocket(null);
        signOut({ redirect: false });
    };

    useEffect(() => {
        if (status !== "authenticated" || socket) {
            return;
        }

        let cancelled = false;
        let activeSocket: Socket | null = null;

        fetch("/api/socket-token")
            .then((res) => res.json())
            .then((data) => {
                if (cancelled || !data.token) {
                    return;
                }
                activeSocket = createSocket(data.token);
                setSocket(activeSocket);
            });

        return () => {
            cancelled = true;
            activeSocket?.disconnect();
        };
    }, [status, socket]);

    useEffect(() => {
        if (!socket) {
            return;
        }

        socket.on("items", (data: Item[]) => {
            setItems(data);
        });

        return () => {
            socket.off("items");
        };
    }, [socket]);

    return (
        <main className="flex w-screen h-screen flex-col justify-center items-center  overflow-hidden">
            {status !== "authenticated" && <LoginModal />}
            {session?.user && socket ? (
                <div>
                    <Header onLogout={handleLogout} />
                    <DashBoard
                        items={items}
                        socket={socket}
                        user={session.user.name || ""}
                        lances={lances}
                        subtractLance={subtractLance}
                        addLances={addLances}
                    />
                    <Footer />
                </div>
            ) : status === "authenticated" ? (
                <div>Conectando...</div>
            ) : null}
        </main>
    );
}
