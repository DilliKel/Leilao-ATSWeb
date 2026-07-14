import React, { useState } from "react";
import BidHistory, { HistoryEntry } from "./BidHistory";

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

interface GridProps {
    items: Item[];
    socket: any;
    user: string;
    lances: number;
    subtractLance: () => void;
    notify: (message: string) => void;
}

const NEW_ITEM_TIME = 60;

function timerColor(time: number) {
    if (time <= 10) return "bg-red-500";
    if (time <= 30) return "bg-amber-500";
    return "bg-emerald-500";
}

const Grid: React.FC<GridProps> = ({
    items,
    socket,
    user,
    lances,
    subtractLance,
    notify,
}) => {
    const [historyItem, setHistoryItem] = useState<{ nome: string; entries: HistoryEntry[] } | null>(null);
    const [historyLoading, setHistoryLoading] = useState(false);

    const openHistory = (item: Item) => {
        setHistoryLoading(true);
        socket.emit("get_history", item.id, (res: { history?: HistoryEntry[] }) => {
            setHistoryLoading(false);
            setHistoryItem({ nome: item.nome_prod, entries: res.history || [] });
        });
    };

    return (
        <div className="grid w-full max-w-7xl grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
            {items.map((item, index) => {
                const percentage = Math.max(0, Math.min(100, (item.time / NEW_ITEM_TIME) * 100));
                const lastBidder = item.bidders.length ? item.bidders[item.bidders.length - 1] : null;

                return (
                    <div
                        key={index}
                        className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-900/60 shadow-lg backdrop-blur-md transition hover:border-amber-400/30 hover:shadow-gold"
                    >
                        <div className="h-28 w-full overflow-hidden bg-zinc-800">
                            <img
                                src={item.image}
                                alt={item.nome_prod}
                                loading="lazy"
                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            />
                        </div>

                        <div className="flex flex-1 flex-col gap-1.5 p-3">
                            <h2 className="font-display truncate text-base text-zinc-100">
                                {item.nome_prod}
                            </h2>
                            <p className="line-clamp-2 text-quaseminusculo text-zinc-400">
                                {item.descricao}
                            </p>

                            <div className="mt-auto pt-1">
                                <p className="truncate text-quaseminusculo text-zinc-500">
                                    {lastBidder ? `Líder: ${lastBidder}` : "Sem lances"}
                                </p>
                                <p className="font-display text-lg text-amber-300">
                                    R$ {item.valor.toFixed(2)}
                                </p>
                            </div>

                            <button
                                className="mt-1 w-full rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 py-1.5 text-sm font-semibold text-zinc-950 transition hover:from-amber-400 hover:to-amber-300 active:scale-[0.98]"
                                onClick={() => {
                                    if (lances > 0) {
                                        socket.emit("bid", { itemId: item.id });
                                        subtractLance();
                                    } else {
                                        notify("Você não possui mais lances disponíveis. Adquira mais.");
                                    }
                                }}
                            >
                                Dar lance
                            </button>
                            <button
                                className="text-center text-quaseminusculo text-zinc-500 transition hover:text-amber-300 hover:underline"
                                onClick={() => openHistory(item)}
                            >
                                Ver histórico
                            </button>

                            <div className="mt-1">
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                                    <div
                                        className={`h-1.5 rounded-full transition-all duration-1000 ease-linear ${timerColor(item.time)}`}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <p
                                    className={`mt-1 text-center text-quaseminusculo ${item.time <= 10 ? "font-semibold text-red-400" : "text-zinc-500"
                                        }`}
                                >
                                    {item.time}s restantes
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}

            {historyLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm">
                    <p className="text-zinc-300">Carregando histórico...</p>
                </div>
            )}

            {historyItem && (
                <BidHistory
                    itemName={historyItem.nome}
                    entries={historyItem.entries}
                    onClose={() => setHistoryItem(null)}
                />
            )}
        </div>
    );
};

export default Grid;
