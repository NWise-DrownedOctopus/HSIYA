"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async () => {
        setLoading(true);
        const res = await fetch("http://localhost:8000/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        setLoading(false);

        if (res.ok) {
            alert("Signup successful! Please login.");
            router.push("/login");
        } else {
            const data = await res.json();
            alert("Signup failed: " + (data.error || data.detail || "Unknown error"));
        }
    };

    return (
        <div className="page">
            <div className="card">
                <h1>Create an account</h1>
                <p className="subtitle">Sign up to get started</p>

                <label>
                    Email
                    <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </label>

                <label>
                    Password
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </label>

                <button onClick={handleSignup} disabled={loading}>
                    {loading ? "Creating account..." : "Sign Up"}
                </button>

                <p className="footer">
                    Already have an account?{" "}
                    <span onClick={() => router.push("/login")}>
                        Log in
                    </span>
                </p>
            </div>

            <style jsx>{`
                .page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #0f172a, #020617);
                    padding: 1rem;
                }

                .card {
                    width: 100%;
                    max-width: 400px;
                    background: #020617;
                    border-radius: 12px;
                    padding: 2rem;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
                    color: #e5e7eb;
                }

                h1 {
                    margin: 0;
                    font-size: 1.75rem;
                    font-weight: 600;
                }

                .subtitle {
                    margin: 0.25rem 0 1.5rem;
                    color: #94a3b8;
                    font-size: 0.95rem;
                }

                label {
                    display: flex;
                    flex-direction: column;
                    font-size: 0.85rem;
                    margin-bottom: 1rem;
                    color: #cbd5f5;
                }

                input {
                    margin-top: 0.4rem;
                    padding: 0.6rem 0.7rem;
                    border-radius: 8px;
                    border: 1px solid #1e293b;
                    background: #020617;
                    color: #e5e7eb;
                    font-size: 0.95rem;
                }

                input:focus {
                    outline: none;
                    border-color: #6366f1;
                    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.3);
                }

                button {
                    margin-top: 1rem;
                    width: 100%;
                    padding: 0.7rem;
                    border-radius: 8px;
                    border: none;
                    background: linear-gradient(135deg, #6366f1, #4f46e5);
                    color: white;
                    font-size: 1rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: transform 0.05s ease, opacity 0.2s ease;
                }

                button:hover {
                    opacity: 0.9;
                }

                button:active {
                    transform: scale(0.98);
                }

                button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .footer {
                    margin-top: 1.5rem;
                    font-size: 0.85rem;
                    text-align: center;
                    color: #94a3b8;
                }

                .footer span {
                    color: #6366f1;
                    cursor: pointer;
                }

                .footer span:hover {
                    text-decoration: underline;
                }
            `}</style>
        </div>
    );
}
