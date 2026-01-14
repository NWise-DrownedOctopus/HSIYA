"use client"; 
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface CardDetail {
    shop_card_id: string;
    name: string;
    set: string;
    rarity: string;
    quantity: number;
    price_cents: number;
    condition: string;
    photo_url?: string;
}

export default function CardPage() {
    const params = useParams();
    const shopCardId = params.id; // this is shop_card_id
    const [card, setCard] = useState<CardDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCard = async () => {
            try {
                const res = await fetch(`http://127.0.0.1:8000/shop_cards/${shopCardId}`);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                setCard(data);
            } catch (err) {
                console.error("Failed to fetch shop card:", err);
                setCard(null);
            } finally {
                setLoading(false);
            }
        };

        if (shopCardId) fetchCard();
    }, [shopCardId]);

    if (loading) return <p>Loading...</p>;
    if (!card) return <p>Card not found</p>;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="flex items-center gap-6">
                {card.photo_url && (
                    <img
                        src={card.photo_url}
                        alt={card.name}
                        className="w-40 h-56 object-cover rounded-lg"
                    />
                )}
                <div>
                    <h1 className="text-3xl font-bold text-white">{card.name}</h1>
                    <p className="text-gray-400">{card.set} • {card.rarity}</p>
                    <p className="mt-2 text-white">Quantity: {card.quantity}</p>
                    <p className="text-white">
                        Price: ${(card.price_cents / 100).toFixed(2)}
                    </p>
                    <p className="text-white">Condition: {card.condition}</p>
                </div>
            </div>
        </div>
    );
}
