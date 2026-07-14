import React from "react";

export interface HistoryEntry {
    userName: string;
    valor: number;
    createdAt: string;
}

interface BidHistoryProps {
    itemName: string;
    entries: HistoryEntry[];
    onClose: () => void;
}

const BidHistory: React.FC<BidHistoryProps> = ({ itemName, entries, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 p-4 backdrop-blur-sm">
            <div className="max-h-[80vh] w-full max-w-md animate-fade-in overflow-y-auto rounded-2xl border border-white/10 bg-zinc-900/70 p-6 shadow-2xl backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-display text-xl text-amber-300">
                        Histórico — {itemName}
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-zinc-400 transition hover:bg-white/10 hover:text-zinc-100"
                        aria-label="Fechar"
                    >
                        ✕
                    </button>
                </div>

                {entries.length === 0 ? (
                    <p className="text-zinc-400">Nenhum lance registrado ainda.</p>
                ) : (
                    <ul className="space-y-2">
                        {entries.map((entry, index) => (
                            <li
                                key={index}
                                className="flex items-center justify-between gap-2 border-b border-white/10 pb-2 text-sm text-zinc-200"
                            >
                                <span className="truncate font-medium text-zinc-100">{entry.userName}</span>
                                <span className="whitespace-nowrap text-amber-300">R$ {entry.valor.toFixed(2)}</span>
                                <span className="whitespace-nowrap text-xs text-zinc-500">
                                    {new Date(entry.createdAt).toLocaleTimeString("pt-BR")}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default BidHistory;
