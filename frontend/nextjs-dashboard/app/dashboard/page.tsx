import { cookies } from "next/headers";

export default async function DashboardPage() {
    const cookieStore = await cookies(); 
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return <div>Please login to view your dashboard.</div>;
    }

    const res = await fetch("http://127.0.0.1:8000/shop_cards", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
    });

    const cards = await res.json();

    return (
        <div>
            <h1>Dashboard</h1>
            <ul>
                {cards.map((c: any) => (
                    <li key={c.shop_card_id}>
                        {c.name} - ${c.price_cents / 100}
                    </li>
                ))}
            </ul>
        </div>
    );
}
