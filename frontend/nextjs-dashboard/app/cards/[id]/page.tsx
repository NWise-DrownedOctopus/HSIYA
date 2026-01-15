"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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

interface RecommendedCard {
    id: string;
    name: string;
    price_cents: number;
    condition: string;
    photo_url?: string;
}

export default function CardPage() {
    const params = useParams();
    const router = useRouter();
    const shopCardId = params.id;
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

    if (loading) {
        return (
            <div className="page">
                <div className="status">Loading card…</div>
                <style jsx>{baseStyles}</style>
            </div>
        );
    }

    if (!card) {
        return (
            <div className="page">
                <div className="status">Card not found</div>
                <style jsx>{baseStyles}</style>
            </div>
        );
    }

    // Dummy recommended cards
    const recommendedCards: RecommendedCard[] = [
        {
            id: "rec-1",
            name: `${card.name} (Alt Art)`,
            price_cents: card.price_cents + 500,
            condition: "Near Mint",
            photo_url: card.photo_url,
        },
        {
            id: "rec-2",
            name: `${card.name} (1st Edition)`,
            price_cents: card.price_cents + 1500,
            condition: "Lightly Played",
            photo_url: card.photo_url,
        },
        {
            id: "rec-3",
            name: `${card.name} (Holo)`,
            price_cents: card.price_cents + 800,
            condition: "Near Mint",
            photo_url: card.photo_url,
        },
        {
            id: "rec-4",
            name: `${card.name} (Unlimited)`,
            price_cents: card.price_cents - 300,
            condition: "Moderately Played",
            photo_url: card.photo_url,
        },
    ];

    const recommendedSections = [
        {
            title: "Top Singles Available In-Store",
            cards: recommendedCards,
        },
        {
            title: "Top Creatures",
            cards: recommendedCards.map((c, i) => ({
                ...c,
                id: `creature-${i}`,
                name: `${c.name} — Creature`,
            })),
        },
        {
            title: "Top Artifacts",
            cards: recommendedCards.map((c, i) => ({
                ...c,
                id: `artifact-${i}`,
                name: `${c.name} — Artifact`,
            })),
        },
        {
            title: "Top Lands",
            cards: recommendedCards.map((c, i) => ({
                ...c,
                id: `land-${i}`,
                name: `${c.name} — Land`,
            })),
        },
    ];


    return (
        <div className="page">
            {/* HERO CARD */}
            <div className="heroCard">
                <div className="heroContent">
                    {card.photo_url && (
                        <img
                            src={card.photo_url}
                            alt={card.name}
                            className="image"
                        />
                    )}

                    <div className="details">
                        <h1>{card.name}</h1>
                        <p className="subtitle">
                            {card.set} • {card.rarity}
                        </p>

                        <div className="infoGrid">
                            <div>
                                <span>Quantity</span>
                                <strong>{card.quantity}</strong>
                            </div>
                            <div>
                                <span>Condition</span>
                                <strong>{card.condition}</strong>
                            </div>
                            <div>
                                <span>Price</span>
                                <strong>
                                    ${(card.price_cents / 100).toFixed(2)}
                                </strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RECOMMENDED CARDS */}
            {recommendedSections.map(section => (
                <div key={section.title} className="recommendationSection">
                    <h2>{section.title}</h2>

                    <div className="recommendedGrid">
                        {section.cards.map(rec => (
                            <div
                                key={rec.id}
                                className="recCard"
                                onClick={() => router.push(`/cards/${rec.id}`)}
                            >
                                <div className="recImageWrapper">
                                    {rec.photo_url && (
                                        <img
                                            src={rec.photo_url}
                                            alt={rec.name}
                                        />
                                    )}
                                </div>

                                <div className="recInfo">
                                    <h3>{rec.name}</h3>
                                    <p>{rec.condition}</p>
                                    <strong>
                                        ${(rec.price_cents / 100).toFixed(2)}
                                    </strong>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}


            <style jsx>{baseStyles}</style>
            <style jsx>{`
                .heroCard {
                    width: 100%;
                    max-width: 1100px;
                    background: #020617;
                    border-radius: 18px;
                    padding: 2.5rem;
                    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
                }

                .heroContent {
                    display: flex;
                    gap: 2.5rem;
                    align-items: flex-start;
                }

                .image {
                    width: 280px;
                    height: 392px;
                    object-fit: cover;
                    border-radius: 16px;
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
                }

                .details {
                    flex: 1;
                }

                h1 {
                    margin: 0;
                    font-size: 2.25rem;
                    font-weight: 600;
                    color: #e5e7eb;
                }

                .subtitle {
                    margin-top: 0.35rem;
                    color: #94a3b8;
                    font-size: 1rem;
                }

                .infoGrid {
                    margin-top: 2rem;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
                    gap: 1.25rem;
                }

                .infoGrid div {
                    background: #020617;
                    border: 1px solid #1e293b;
                    border-radius: 12px;
                    padding: 0.9rem;
                }

                .infoGrid span {
                    display: block;
                    font-size: 0.75rem;
                    color: #94a3b8;
                    margin-bottom: 0.3rem;
                }

                .infoGrid strong {
                    font-size: 1.05rem;
                    color: #e5e7eb;
                    font-weight: 500;
                }

                .belowContent {
                    max-width: 1100px;
                    width: 100%;
                    margin-top: 3.5rem;
                    padding-bottom: 4rem;
                }

                .belowContent h2 {
                    font-size: 1.35rem;
                    color: #e5e7eb;
                    margin-bottom: 1.25rem;
                }

                .recommendedGrid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1.5rem;
                }

                .recCard {
                    background: #020617;
                    border: 1px solid #1e293b;
                    border-radius: 14px;
                    overflow: hidden;
                    cursor: pointer;
                    transition: transform 0.15s ease, box-shadow 0.15s ease;
                }

                .recCard:hover img {
                    transform: scale(1.03);
                }

                .recImageWrapper {
                    width: 100%;
                    aspect-ratio: 5 / 7;
                    background: #020617;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0.5rem;
                }

                .recCard {
                    background: #020617;
                    border: 1px solid #1e293b;
                    border-radius: 14px;
                    overflow: hidden;
                }

                .recImageWrapper {
                    border-radius: 14px 14px 0 0;
                }

                .recImageWrapper img {
                    transition: transform 0.2s ease;
                }


                .recImageWrapper img {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                }


                .recInfo {
                    padding: 0.75rem;
                }

                .recInfo h3 {
                    margin: 0;
                    font-size: 0.95rem;
                    font-weight: 500;
                    color: #e5e7eb;
                }

                .recInfo p {
                    margin: 0.2rem 0;
                    font-size: 0.75rem;
                    color: #94a3b8;
                }

                .recInfo strong {
                    font-size: 0.85rem;
                    color: #e5e7eb;
                }

                .recommendationSection {
                    margin-bottom: 3.5rem;
                }

                .recommendationSection h2 {
                    font-size: 1.35rem;
                    color: #e5e7eb;
                    margin-bottom: 1.25rem;
                }

                @media (max-width: 1000px) {
                    .recommendedGrid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (max-width: 600px) {
                    .recommendedGrid {
                        grid-template-columns: 1fr;
                    }
                }

                @media (max-width: 800px) {
                    .heroContent {
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                    }

                    .image {
                        width: 220px;
                        height: 308px;
                    }
                }
            `}</style>
        </div>
    );
}

const baseStyles = `
.page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(135deg, #0f172a, #020617);
    padding: 2.5rem 1.5rem 1.5rem;
}

.status {
    margin-top: 3rem;
    color: #94a3b8;
    font-size: 1rem;
}
`;
