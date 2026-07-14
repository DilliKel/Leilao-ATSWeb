import React, { useState } from "react";
import Grid from "./Grid";
import AddProduct from "./AddProduct";
import Winners from "./Winners";

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

interface DashBoardProps {
    items: Item[];
    winners: Item[];
    socket: any;
    user: string;
    lances: number;
    subtractLance: () => void;
    addLances: () => void;
    notify: (message: string) => void;
}

export default function DashBoard({ items, winners, socket, user, lances, subtractLance, addLances, notify }: DashBoardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isWinnersOpen, setIsWinnersOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="flex h-screen w-screen flex-col overflow-y-scroll p-4 pb-16 pt-20">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-zinc-900/60 p-3 backdrop-blur-md">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-zinc-300">
                        <span className="text-zinc-500">Conta:</span>
                        <span className="font-medium text-zinc-100">{user}</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-sm text-amber-300">
                        <span className="font-semibold">{lances}</span>
                        <span>lances</span>
                    </div>
                    <button
                        onClick={addLances}
                        className="rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-1.5 text-sm font-semibold text-zinc-950 transition hover:from-amber-400 hover:to-amber-300"
                    >
                        + 5 lances
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setIsWinnersOpen(true)}
                        className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-zinc-300 transition hover:border-amber-400/40 hover:text-amber-300"
                    >
                        Leilões encerrados ({winners.length})
                    </button>
                    <button
                        onClick={openModal}
                        className="rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-sm font-medium text-amber-300 transition hover:bg-amber-400/20"
                    >
                        + Cadastrar produto
                    </button>
                </div>
            </div>

            <section className="mt-4 flex justify-center">
                <Grid items={items} socket={socket} user={user} lances={lances} subtractLance={subtractLance} notify={notify} />
                {isModalOpen && <AddProduct closeModal={closeModal} socket={socket} />}
                {isWinnersOpen && (
                    <Winners winners={winners} onClose={() => setIsWinnersOpen(false)} />
                )}
            </section>
        </div>
    );
}
