"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function CardSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(-1);
    const router = useRouter();


    // Optional: handle outside clicks
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        console.log("Results:", results);
    }, [results]);

    // Optional: fetch results from FastAPI
    useEffect(() => {
        setActiveIndex(-1);
        if (!query) {
            setResults([]);
            return;
        }

        const fetchResults = async () => {
            const res = await fetch(`http://127.0.0.1:8000/cards?q=${query}`);
            const data = await res.json();
            setResults(data);
            setIsOpen(true);
        };

        const timeout = setTimeout(fetchResults, 200); // debounce
        return () => clearTimeout(timeout);
    }, [query]);

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (!isOpen || results.length === 0) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setActiveIndex((prev) =>
                    prev < results.length - 1 ? prev + 1 : 0
                );
                break;

            case "ArrowUp":
                e.preventDefault();
                setActiveIndex((prev) =>
                    prev > 0 ? prev - 1 : results.length - 1
                );
                break;

            case "Enter":
                e.preventDefault();
                if (activeIndex >= 0) {
                    selectCard(results[activeIndex]);
                }
                break;

            case "Escape":
                setIsOpen(false);
                break;
        }
    }

    function selectCard(card: any) {
        setIsOpen(false);
        router.push(`/cards/${card.id}`);
    }

    return (
        <div className="w-full max-w-2xl text-center relative" ref={wrapperRef}>
            {/* Label */}
            <p className="mb-5 text-xl text-gray-300">Search your commander</p>

            {/* Search input */}
            <input
                type="text"
                placeholder="Type a commander name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full rounded-xl bg-neutral-900 px-6 py-4 text-lg text-white placeholder-gray-500 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-blue-500"
            />

            {/* Autocomplete dropdown */}
            {isOpen && results.length > 0 && (
                <ul className="absolute w-full mt-1 max-h-60 overflow-y-auto rounded-xl bg-neutral-800 shadow-lg z-10">
                    {results.map((card, index) => (
                        <li
                            key={card.id}
                            onMouseDown={() => selectCard(card)}
                            className={`
                                flex items-center px-4 py-2 cursor-pointer
                                ${index === activeIndex
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-blue-500"}
                            `}
                        >
                            {card.photo_url && (
                                <img
                                    src={card.photo_url}
                                    alt={card.name}
                                    className="w-8 h-8 rounded mr-2"
                                />
                            )}
                            <div className="text-left">
                                <p className="text-white">{card.name}</p>
                                <p className="text-gray-400 text-sm">
                                    {card.set} • {card.rarity}
                                </p>
                            </div>
                        </li>
                    ))}

                </ul>
            )}
        </div>
    );
}
