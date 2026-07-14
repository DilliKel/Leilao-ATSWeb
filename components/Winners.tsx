import React from "react";

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

interface WinnersProps {
    winners: Item[];
    onClose: () => void;
}

const Winners: React.FC<WinnersProps> = ({ winners, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 p-4 backdrop-blur-sm">
            <div className="max-h-[80vh] w-full max-w-2xl animate-fade-in overflow-y-auto rounded-2xl border border-white/10 bg-zinc-900/70 p-6 shadow-2xl backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-display text-xl text-amber-300">Leilões encerrados</h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-zinc-400 transition hover:bg-white/10 hover:text-zinc-100"
                        aria-label="Fechar"
                    >
                        ✕
                    </button>
                </div>

                {winners.length === 0 ? (
                    <p className="text-zinc-400">Nenhum leilão encerrado ainda.</p>
                ) : (
                    <ul className="space-y-3">
                        {winners.map((item) => {
                            const winner = item.bidders[item.bidders.length - 1];
                            return (
                                <li
                                    key={item.id}
                                    className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.nome_prod}
                                        className="h-12 w-12 rounded-lg object-cover"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="font-display truncate text-zinc-100">{item.nome_prod}</p>
                                        <p className="text-sm text-amber-300">R$ {item.valor.toFixed(2)}</p>
                                        <p className="truncate text-sm text-zinc-400">
                                            {winner ? `🏆 ${winner}` : "Encerrado sem lances"}
                                        </p>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Winners;
