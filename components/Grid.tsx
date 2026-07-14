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
}

const NEW_ITEM_TIME = 60;

function timerColor(time: number) {
    if (time <= 10) return "bg-red-600";
    if (time <= 30) return "bg-yellow-500";
    return "bg-green-600";
}

const Grid: React.FC<GridProps> = ({
    items,
    socket,
    user,
    lances,
    subtractLance,
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
            {items.map((item, index) => {
                const percentage = Math.max(0, Math.min(100, (item.time / NEW_ITEM_TIME) * 100));

                return (
                    <div
                        key={index}
                        className="p-2 px-3 border border-gray-200 rounded max-h-64 max-w-4xl items-center justify-around flex flex-col bg-green-500"
                    >
                        <h2 className="text-base text-zinc-950 font-bold mb-0 text-center">
                            {item.nome_prod}
                        </h2>
                        <img
                            src={item.image}
                            alt={item.nome_prod}
                            loading="lazy"
                            style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                                borderRadius: "10px",
                            }}
                        />
                        <p className="text-minusculo text-zinc-950 text-center">
                            {item.descricao}
                        </p>
                        <p className="text-minusculo text-center font-bold text-zinc-950">
                            <strong>  </strong>
                            {item.bidders
                                ? item.bidders[item.bidders.length - 1]
                                : ""}
                        </p>

                        <p className="text-sm text-zinc-950"
                        >Valor atual: {item.valor}</p>
                        <button
                            className="bg-red-600 hover:bg-red-800 text-white font-bold px-2 rounded text-xs"
                            onClick={() => {
                                if (lances >= 0) {
                                    console.log(
                                        `Emitting bid event for item ${item.id} by user ${user}`
                                    );
                                    socket.emit("bid", { itemId: item.id });
                                    subtractLance();
                                }
                            }} > LANCE </button>
                        <button
                            className="text-zinc-950 underline text-xs mt-1"
                            onClick={() => openHistory(item)}
                        >
                            Ver histórico
                        </button>
                        <div className="flex flex-col w-full mt-1">
                            <div className="w-full bg-zinc-800 bg-opacity-30 rounded-full h-2 overflow-hidden">
                                <div
                                    className={`h-2 rounded-full ${timerColor(item.time)} transition-all duration-1000 ease-linear`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                            <p
                                className={`text-quaseminusculo text-center pt-1 ${item.time <= 10 ? "text-red-900 font-bold" : "text-zinc-950"
                                    }`}
                            >
                                Faltam: {item.time}s para encerrar o leilão
                            </p>
                        </div>
                    </div>
                );
            })}

            {historyLoading && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <p className="text-white">Carregando histórico...</p>
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
