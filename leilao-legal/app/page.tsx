"use client";
import React, { useEffect, useState } from "react";
import DashBoard from "@/components/DashBoard";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import socket from "@/app/socket";
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

interface user {
    nome_user: string,
}

export default function Home() {
    const [items, setItems] = useState<Item[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [user, setUser] = useState<user | null>(null);
    const [lances, setLances] = useState(15); // Declare lances state here
    
    const handleLogin = (userData:user) => {
      setIsModalOpen(false);
      setUser(userData);
      localStorage.setItem('nome_user', userData.nome_user);
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('nome_user');
        setIsModalOpen(true);
    };

    const subtractLance = () => {
        setLances(lances - 1);
    };

    const addLances = () => {
        setLances(lances + 5);
    };

    useEffect(() => {
        socket.on("items", (data: Item[]) => {
          setItems(data);
        });
      
        return () => {
          // Cleanup
          socket.off("items");
        };
    }, []);

    return (
        <main className="flex w-screen h-screen flex-col justify-center items-center  overflow-hidden">
            {isModalOpen && <LoginModal onLogin={handleLogin} />}
            {user ? (
                <div>
                    <Header onLogout={handleLogout}/>
                    <DashBoard items={items} socket={socket} user={user.nome_user} lances={lances} subtractLance={subtractLance} addLances={addLances} />
                    <Footer />
                </div>
            ) : (
                <div>Please log in to view this content.</div>
            )}
        </main>
    );
}