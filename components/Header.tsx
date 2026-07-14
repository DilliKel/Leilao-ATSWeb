import React from "react";

interface HeaderProps {
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
    return (
        <header className="fixed top-0 z-40 w-screen border-b border-white/10 bg-zinc-950/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center">
                    <img
                        src="/logo.png"
                        alt="Leilão Legal"
                        className="h-10 w-auto object-contain"
                    />
                </div>
                <button
                    onClick={onLogout}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-zinc-300 transition hover:border-amber-400/40 hover:text-amber-300"
                >
                    Sair
                </button>
            </div>
        </header>
    );
};
export default Header;
