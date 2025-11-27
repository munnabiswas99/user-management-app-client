import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/*
    Simple Login Page
    - Sends POST to /api/auth/login with { email, password }
    - On success stores token in localStorage (if remember) or sessionStorage
    - Adjust endpoint/response handling to match your backend
*/

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const validate = () => {
        if (!email.trim()) return "Email is required";
        // basic email pattern
        if (!/^\S+@\S+\.\S+$/.test(email)) return "Enter a valid email";
        if (!password) return "Password is required";
        if (password.length < 6) return "Password must be at least 6 characters";
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim(), password }),
            });

            if (!res.ok) {
                const payload = await res.json().catch(() => ({}));
                throw new Error(payload.message || "Login failed");
            }

            const data = await res.json();
            const token = data.token || data.accessToken;
            if (!token) throw new Error("No token returned from server");

            const storage = remember ? localStorage : sessionStorage;
            storage.setItem("authToken", token);

            // optional: store basic user info if returned
            if (data.user) storage.setItem("user", JSON.stringify(data.user));

            // redirect to dashboard or home
            navigate("/dashboard", { replace: true });
        } catch (err) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <form onSubmit={handleSubmit} style={styles.card} aria-labelledby="login-heading">
                <h2 id="login-heading" style={styles.title}>Sign in</h2>

                {error && (
                    <div role="alert" style={styles.error}>
                        {error}
                    </div>
                )}

                <label style={styles.label}>
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                    />
                </label>

                <label style={styles.label}>
                    Password
                    <div style={styles.passwordRow}>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ ...styles.input, marginBottom: 0, flex: 1 }}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((s) => !s)}
                            style={styles.toggleBtn}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                </label>

                <div style={styles.row}>
                    <label style={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                        />{" "}
                        Remember me
                    </label>
                    <Link to="/forgot-password" style={styles.link}>
                        Forgot?
                    </Link>
                </div>

                <button type="submit" style={styles.submit} disabled={loading}>
                    {loading ? "Signing in…" : "Sign in"}
                </button>

                <p style={styles.footer}>
                    Don't have an account? <Link to="/register">Create an account</Link>
                </p>
            </form>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f7fb",
        padding: 20,
    },
    card: {
        width: 380,
        background: "#fff",
        padding: 24,
        borderRadius: 8,
        boxShadow: "0 6px 18px rgba(30,40,50,0.08)",
        boxSizing: "border-box",
    },
    title: {
        margin: "0 0 18px 0",
        fontSize: 20,
        fontWeight: 600,
        color: "#102a43",
    },
    label: {
        display: "block",
        marginBottom: 12,
        fontSize: 13,
        color: "#243b53",
    },
    input: {
        width: "100%",
        padding: "10px 12px",
        fontSize: 14,
        borderRadius: 6,
        border: "1px solid #d9e2ec",
        marginTop: 6,
        boxSizing: "border-box",
    },
    passwordRow: {
        display: "flex",
        gap: 8,
        alignItems: "center",
    },
    toggleBtn: {
        padding: "8px 10px",
        fontSize: 13,
        borderRadius: 6,
        border: "1px solid #d9e2ec",
        background: "#f0f4f8",
        cursor: "pointer",
    },
    row: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14,
    },
    checkboxLabel: {
        fontSize: 13,
        color: "#334e68",
    },
    link: {
        fontSize: 13,
        color: "#1363df",
        textDecoration: "none",
    },
    submit: {
        width: "100%",
        padding: "10px 12px",
        background: "#0b69ff",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        fontSize: 15,
        cursor: "pointer",
    },
    footer: {
        marginTop: 14,
        fontSize: 13,
        color: "#486581",
        textAlign: "center",
    },
    error: {
        background: "#ffeef0",
        color: "#9b2c2c",
        padding: "8px 10px",
        borderRadius: 6,
        marginBottom: 12,
        fontSize: 13,
    },
};