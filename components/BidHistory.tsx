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
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded shadow-lg p-4 max-w-md w-full max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-zinc-900">
                        Histórico — {itemName}
                    </h2>
                    <button
                        onClick={onClose}
                        className="bg-red-600 hover:bg-red-900 text-white font-bold py-1 px-3 rounded"
                    >
                        X
                    </button>
                </div>

                {entries.length === 0 ? (
                    <p className="text-zinc-600">Nenhum lance registrado ainda.</p>
                ) : (
                    <ul className="space-y-2">
                        {entries.map((entry, index) => (
                            <li
                                key={index}
                                className="flex justify-between items-center border-b border-gray-200 pb-1 text-zinc-900"
                            >
                                <span className="font-semibold">{entry.userName}</span>
                                <span>R$ {entry.valor.toFixed(2)}</span>
                                <span className="text-xs text-zinc-500">
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
