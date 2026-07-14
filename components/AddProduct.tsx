import React, { useState } from "react";
import { Socket } from "socket.io-client";

interface AddProductProps {
    closeModal: () => void;
    socket: Socket;
}

const inputClass =
    "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/40";

const AddProduct: React.FC<AddProductProps> = ({ closeModal, socket }) => {
    const [nome_prod, setnome_prod] = useState("");
    const [descricao, setdescricao] = useState("");
    const [image, setimage] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        socket.emit("add_item", {
            nomeProd: nome_prod,
            descricao,
            image,
            startAt: new Date().toISOString(),
        });
        closeModal();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md animate-fade-in rounded-2xl border border-white/10 bg-zinc-900/70 p-6 shadow-2xl backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-display text-xl text-amber-300">Cadastrar novo produto</h2>
                    <button
                        onClick={closeModal}
                        className="rounded-full p-1 text-zinc-400 transition hover:bg-white/10 hover:text-zinc-100"
                        aria-label="Fechar"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        className={inputClass}
                        placeholder="Nome do produto"
                        name="nome_prod"
                        value={nome_prod}
                        onChange={(e) => setnome_prod(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        className={inputClass}
                        placeholder="Descrição do produto"
                        name="descricao"
                        value={descricao}
                        onChange={(e) => setdescricao(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        className={inputClass}
                        placeholder="URL da imagem"
                        name="image"
                        value={image}
                        onChange={(e) => setimage(e.target.value)}
                        required
                    />

                    <button
                        className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 py-2.5 font-semibold text-zinc-950 shadow-gold transition hover:from-amber-400 hover:to-amber-300"
                        type="submit"
                    >
                        Concluir
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
