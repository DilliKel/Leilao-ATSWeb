import React, { useState } from "react";
import Grid from "./Grid";
import AddProduct from "./AddProduct";

interface DashBoardProps {
    items: Array<{
      id: number;
      nome_prod: string;
      descricao: string;
      image: string;
      valor: number;
      time: number;
      sold: boolean;
      startAt: string;
      bidders: string[];
    }>;
    socket: any;
    user: string;
    lances: number;
    subtractLance: () => void;
    addLances: () => void;
}

export default function DashBoard({ items, socket, user, lances, subtractLance, addLances }: DashBoardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className={"flex flex-col w-screen h-screen p-4 bg-teal-950 overflow-clip pt-20 overflow-y-scroll"}>

            <div className="flex text-green-600 text-sm/relaxed bg-stone-800 justify-around items-center rounded min-h-fit p-3">

                <div className="flex items-center justify-around w-1/2 ">
                    <p>
                        <strong>Conta Logada:</strong>
                    </p>
                    <p>
                        {user}
                    </p>
                    <p>
                        <strong>Lances: {lances}</strong>
                    </p>
                    <button
                        onClick={addLances}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"> Comprar +5 Lances </button>
                </div>
                <div>
                    <button
                        onClick={openModal}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"> Cadastrar novo produto </button>
                </div>
            </div>
            <section className="flex mt-2 justify-center">
                <Grid items={items} socket={socket} user={user} lances={lances} subtractLance={subtractLance} />
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-filter backdrop-blur z-50">
                        <AddProduct closeModal={closeModal} socket={socket} />
                    </div>
                )}
            </section>
        </div>
    );
}