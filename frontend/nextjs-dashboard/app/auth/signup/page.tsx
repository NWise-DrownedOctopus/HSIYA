"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSignup = async () => {
        const res = await fetch("http://localhost:8000/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
            alert("Signup successful! Please login.");
            router.push("/login");
        } else {
            const data = await res.json();
            alert("Signup failed: " + (data.error || data.detail || JSON.stringify(data)));
        }
    };

    return (
        <div>
            <h1>Signup</h1>
            <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <button onClick={handleSignup}>Sign Up</button>
        </div>
    );
}
