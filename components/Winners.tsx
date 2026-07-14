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
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded shadow-lg p-4 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-zinc-900">Leilões encerrados</h2>
                    <button
                        onClick={onClose}
                        className="bg-red-600 hover:bg-red-900 text-white font-bold py-1 px-3 rounded"
                    >
                        X
                    </button>
                </div>

                {winners.length === 0 ? (
                    <p className="text-zinc-600">Nenhum leilão encerrado ainda.</p>
                ) : (
                    <ul className="space-y-3">
                        {winners.map((item) => {
                            const winner = item.bidders[item.bidders.length - 1];
                            return (
                                <li
                                    key={item.id}
                                    className="flex items-center gap-3 border-b border-gray-200 pb-2"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.nome_prod}
                                        style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8 }}
                                    />
                                    <div className="flex-1 text-zinc-900">
                                        <p className="font-bold">{item.nome_prod}</p>
                                        <p className="text-sm">Valor final: R$ {item.valor.toFixed(2)}</p>
                                        <p className="text-sm">
                                            {winner ? `Vencedor: ${winner}` : "Encerrado sem lances"}
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
