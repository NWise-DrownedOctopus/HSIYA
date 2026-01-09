type CardPageProps = {
    params: { id: string };
};

export default async function CardPage(props: CardPageProps) {
    const { id } = await props.params;  // ✅ unwrap the promise

    const res = await fetch(`http://127.0.0.1:8000/cards/${id}`, {
        cache: "no-store",
    });

    const card = await res.json();

    return (
        <div>
            <h1>{card.name}</h1>
            <p>{card.set}</p>
            <p>{card.rarity}</p>
            <p>{card.condition}</p>
            <p>${card.market_price}</p>
        </div>
    );
}
