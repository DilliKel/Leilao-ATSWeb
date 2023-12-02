import React, { useState } from "react";
import { Socket } from "socket.io-client"; // Import the Socket type

interface AddProductProps {
    closeModal: () => void; // closeModal is a function that doesn't return anything
    socket: Socket; // socket is of type Socket
}

const AddProduct: React.FC<AddProductProps> = ({ closeModal, socket }) => {
    // Add closeModal prop
    const [nome_prod, setnome_prod] = useState("");
    const [valor, setvalor] = useState(0);
    const [descricao, setdescricao] = useState("");
    const [image, setimage] = useState("");
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        socket.emit("add_item", [
            nome_prod,
            descricao,
            image,
            new Date().toISOString(), // startAt
        ]);
        closeModal(); // Close the modal after submitting the form
    };
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
        {/* Add these classes */}
        <div className="bg-slate-400 p-4 rounded shadow-lg">
        {/* Add a background color, padding, rounded corners, and a shadow */}
        <button
        className="bg-red-600 hover:bg-red-900 text-white font-bold py-2 px-4 rounded"
        onClick={closeModal}    
        > X </button>
        <h2 className="text-lg w-full text-center mb-2"><strong>Cadastrar Novo Produto</strong></h2>
        <div className="">
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-lg">
        <input
        type="text"
        className="w-full p-2 mb-3 border border-gray-300 rounded text-slate-900"
        placeholder="Nome do Produto"
        name="nome_prod"
        value={nome_prod}
        onChange={(e) => setnome_prod(e.target.value)}
        required
        />

        <input
        type="text"
        className="w-full p-2 mb-3 border border-gray-300 rounded text-slate-900 overflow-scroll"
        placeholder={"Digite a Descricao do " + (nome_prod ? false : "Produto")}
        name="descricao"
        value={descricao}
        onChange={(e) =>
            setdescricao(e.target.value)
        } 
        required
        />
        
        <input
        type="text"
        className="w-full p-2 mb-3 border border-gray-300 rounded text-slate-900 overflow-scroll"
        placeholder={"Insira o URL da imagem " + nome_prod}
        name="image"
        value={image}
        onChange={(e) =>
            setimage(e.target.value)
        } 
        required
        />
        
        <button className="w-full p-2 text-white font-bold bg-blue-500 rounded hover:bg-blue-700 rounded-full" type="submit">
        Concluir
        </button>

        </form>
        </div>
        </div>
        </div>
        );
    };
    
    export default AddProduct;
    