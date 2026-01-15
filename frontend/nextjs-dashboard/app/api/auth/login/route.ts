import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();

    const res = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        const error = await res.json();
        return NextResponse.json({ error: error.detail }, { status: res.status });
    }

    const data = await res.json();
    const response = NextResponse.json({ success: true });

    // Set JWT in HTTP-only cookie
    response.cookies.set("token", data.access_token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 15 * 1, // 15 min
    });

    return response;
}
