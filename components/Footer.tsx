import Link from "next/link";
import React from "react";

export default function Footer() {
    return (
        <footer className="fixed bottom-0 z-30 w-screen border-t border-white/10 bg-zinc-950/80 px-4 py-2 backdrop-blur-md">
            <div className="mx-auto flex max-w-6xl items-center justify-center text-xs text-zinc-500">
                <p>
                    © 2023{" "}
                    <Link
                        href="https://github.com/DilliKel"
                        className="text-amber-400/80 transition hover:text-amber-300"
                    >
                        Kelvin Dev (Kelvin Dilli)
                    </Link>
                </p>
            </div>
        </footer>
    );
}
