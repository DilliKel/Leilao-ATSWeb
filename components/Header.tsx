import Link from "next/link";
import React from "react";

interface HeaderProps {
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
    return (
        <header className="bg-stone-800 border-b border-emerald-100 w-screen fixed top-0">
            <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 h-16">
                {/*<!-- lg+ -->*/}
                <nav className="flex items-center justify-center h-12 lg:h-16">
                    <div className="flex-shrink-0">
                        <a href="#" title="" className="flex">
                            <img
                                src="/logo.png"
                                alt="leilão legal logo"
                                onClick={onLogout}
                                width={150}
                                height={150}
                            />
                        </a>
                    </div>
                </nav>

                {/*<!-- xs to lg -->*/}
                <nav className="min-h-1/3 px-4 py-10 text-center bg-stone-800 md:hidden">
                    <div className="flex-shrink-0">+
                        <a href="#" title="" className="flex">
                            <img
                                src="/logo.png"
                                alt="leilão legal logo"
                                onClick={onLogout}
                                width={200}
                                height={200}
                            />
                        </a>
                    </div>
                </nav>
            </div>
        </header>
    );
};
export default Header;
