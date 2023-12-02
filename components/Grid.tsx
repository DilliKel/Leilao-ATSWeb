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

interface GridProps {
    items: Item[];
    socket: any;
    user: string;
    lances: number;
    subtractLance: () => void;
}

const Grid: React.FC<GridProps> = ({
    items,
    socket,
    user,
    lances,
    subtractLance,
}) => {

    return (
        <div className="grid grid-cols-8 gap-2">
            {items.map((item, index) => (
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
                                socket.emit("bid", [item.id, user]);
                                subtractLance();
                            }
                        }} > LANCE </button>
                    <div className="flex w-full ">
                        <p className="text-quaseminusculo text-zinc-950 text-center pt-1">
                            Faltam: {item.time}s para encerrar o leilão
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Grid;
