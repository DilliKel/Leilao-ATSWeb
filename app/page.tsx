"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Socket } from "socket.io-client";
import DashBoard from "@/components/DashBoard";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { createSocket } from "@/app/socket";
import LoginModal from "@/components/Login";
import Toast, { ToastItem } from "@/components/Toast";

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

let nextToastId = 1;

export default function Home() {
    const { data: session, status } = useSession();
    const [items, setItems] = useState<Item[]>([]);
    const [winners, setWinners] = useState<Item[]>([]);
    const [itemsLoaded, setItemsLoaded] = useState(false);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [lances, setLances] = useState(15);
    const [notifications, setNotifications] = useState<ToastItem[]>([]);
    const itemsRef = useRef<Item[]>([]);

    const subtractLance = () => {
        setLances(lances - 1);
    };

    const addLances = () => {
        setLances(lances + 5);
    };

    const pushNotification = (message: string) => {
        setNotifications((current) => [...current, { id: nextToastId++, message }]);
    };

    const dismissNotification = (id: number) => {
        setNotifications((current) => current.filter((n) => n.id !== id));
    };

    const handleLogout = () => {
        socket?.disconnect();
        setSocket(null);
        setItemsLoaded(false);
        signOut({ redirect: false });
    };

    useEffect(() => {
        if (status !== "authenticated") {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);

    useEffect(() => {
        if (!socket) {
            return;
        }

        const userName = session?.user?.name;

        socket.on("items", (data: Item[]) => {
            if (userName) {
                const previous = itemsRef.current;
                data.forEach((item) => {
                    const prevItem = previous.find((p) => p.id === item.id);
                    if (!prevItem) return;
                    const prevLast = prevItem.bidders[prevItem.bidders.length - 1];
                    const newLast = item.bidders[item.bidders.length - 1];
                    if (prevLast === userName && newLast && newLast !== userName) {
                        pushNotification(`Você foi superado no item "${item.nome_prod}"!`);
                    }
                });
            }

            itemsRef.current = data;
            setItems(data);
            setItemsLoaded(true);
        });

        socket.on("winners", (data: Item[]) => {
            setWinners(data);
        });

        socket.on("bid_rejected", (data: { reason: string }) => {
            if (data.reason === "rate_limited") {
                pushNotification("Calma! Aguarde um instante antes de dar outro lance.");
            } else if (data.reason === "item_expired") {
                pushNotification("Esse item já foi encerrado antes do seu lance chegar.");
            }
        });

        return () => {
            socket.off("items");
            socket.off("winners");
            socket.off("bid_rejected");
        };
    }, [socket, session?.user?.name]);

    return (
        <main className="flex w-screen h-screen flex-col justify-center items-center  overflow-hidden">
            <Toast notifications={notifications} onDismiss={dismissNotification} />

            {status !== "authenticated" && <LoginModal />}

            {status === "loading" && (
                <div className="flex flex-col items-center gap-3 text-white">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
                    <p>Carregando sessão...</p>
                </div>
            )}

            {session?.user && (
                <div>
                    <Header onLogout={handleLogout} />
                    {socket && itemsLoaded ? (
                        <DashBoard
                            items={items}
                            winners={winners}
                            socket={socket}
                            user={session.user.name || ""}
                            lances={lances}
                            subtractLance={subtractLance}
                            addLances={addLances}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-3 h-screen text-white">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
                            <p>{socket ? "Carregando itens do leilão..." : "Conectando ao leilão..."}</p>
                        </div>
                    )}
                </div>
            )}
        </main>
    );
}
