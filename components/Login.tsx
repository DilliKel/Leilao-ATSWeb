import React, { useState } from 'react';

interface User {
  nome_user: string;
}

interface LoginModalProps {
  onLogin: (userData: User) => void;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onLogin, onClose }) => {
  const [form, setForm] = useState<User>({
    nome_user: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(form);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
        </button>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Bem-vindo!
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600">Nome de Usuário</label>
            <input
              type="text"
              name="nome_user"
              value={form.nome_user}
              onChange={handleChange}
              placeholder="Seu Nome"
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
