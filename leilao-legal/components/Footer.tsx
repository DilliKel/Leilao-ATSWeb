import Link from "next/link";
import React from "react";

export default function Home() {
    return (
        <div className=" border-t border-gray-100 p-3 w-screen h-10 fixed bottom-0 bg-stone-800 z-10">
            <div className="flex justify-between text-sm/relaxed text-gray-500">
                <div className="flex justify-center w-1/2 ">
                    <p className="pr-2">©</p>
                    <Link href="https://github.com/DilliKel" className="text-green-500 transition hover:text-green-500/75 font- pr-2"> Kelvin Dev (Kelvin Dilli) </Link>
                    <p className="pr-2">2023.</p>
                </div>
            </div>
        </div>
    );
}
