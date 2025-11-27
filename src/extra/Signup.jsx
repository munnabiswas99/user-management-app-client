import React, { useState } from "react";

/**
 * Signup page component
 * Usage:
 *  <Signup onSignupSuccess={() => navigate("/dashboard")} />
 *
 * Props:
 *  - onSignupSuccess: optional callback called when signup succeeds
 */

export default function Signup({ onSignupSuccess } = {}) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});

    const validate = () => {
        const fe = {};
        if (!form.name.trim()) fe.name = "Name is required";
        if (!form.email.trim()) fe.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(form.email)) fe.email = "Invalid email";
        if (!form.password) fe.password = "Password is required";
        else if (form.password.length < 6)
            fe.password = "Password must be at least 6 characters";
        if (form.password !== form.confirmPassword)
            fe.confirmPassword = "Passwords do not match";
        setFieldErrors(fe);
        return Object.keys(fe).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((s) => ({ ...s, [name]: value }));
        setFieldErrors((f) => ({ ...f, [name]: undefined }));
        setErrors(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors(null);
        if (!validate()) return;

        setLoading(true);
        try {
            // Adjust endpoint as needed
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name.trim(),
                    email: form.email.trim(),
                    password: form.password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                // server-side validation errors example: { fieldErrors: { email: '...' }, message: '...' }
                if (data && data.fieldErrors) {
                    setFieldErrors(data.fieldErrors);
                }
                setErrors(data?.message || "Signup failed");
                setLoading(false);
                return;
            }

            // success
            if (typeof onSignupSuccess === "function") onSignupSuccess(data);
            else {
                // default behavior: simple success message then clear form
                alert("Signup successful");
                setForm({ name: "", email: "", password: "", confirmPassword: "" });
            }
        } catch (err) {
            setErrors("Network error");
        } finally {
            setLoading(false);
        }
    };

    // simple inline styles to keep component self-contained
    const s = {
        container: {
            maxWidth: 420,
            margin: "40px auto",
            padding: 24,
            border: "1px solid #e6e6e6",
            borderRadius: 8,
            fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
            background: "#fff",
        },
        heading: { margin: "0 0 16px 0", fontSize: 22 },
        label: { display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 },
        input: {
            width: "100%",
            padding: "10px 12px",
            fontSize: 14,
            marginBottom: 8,
            borderRadius: 6,
            border: "1px solid #ccd0d5",
            boxSizing: "border-box",
        },
        errorText: { color: "#b00020", fontSize: 13, marginBottom: 8 },
        actions: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 },
        button: {
            padding: "10px 16px",
            background: "#0366d6",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 600,
        },
        ghostButton: {
            padding: "8px 12px",
            background: "transparent",
            color: "#0366d6",
            border: "1px solid #e6e6e6",
            borderRadius: 6,
            cursor: "pointer",
        },
        small: { fontSize: 13, color: "#555" },
    };

    return (
        <main style={s.container}>
            <h1 style={s.heading}>Create an account</h1>

            {errors && (
                <div role="alert" style={s.errorText}>
                    {errors}
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
                <label style={s.label} htmlFor="name">
                    Full name
                </label>
                <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    style={s.input}
                    placeholder="Jane Doe"
                    autoComplete="name"
                    disabled={loading}
                />
                {fieldErrors.name && <div style={s.errorText}>{fieldErrors.name}</div>}

                <label style={s.label} htmlFor="email">
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    style={s.input}
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={loading}
                />
                {fieldErrors.email && <div style={s.errorText}>{fieldErrors.email}</div>}

                <label style={s.label} htmlFor="password">
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    style={s.input}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    disabled={loading}
                />
                {fieldErrors.password && <div style={s.errorText}>{fieldErrors.password}</div>}

                <label style={s.label} htmlFor="confirmPassword">
                    Confirm password
                </label>
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    style={s.input}
                    placeholder="Repeat password"
                    autoComplete="new-password"
                    disabled={loading}
                />
                {fieldErrors.confirmPassword && (
                    <div style={s.errorText}>{fieldErrors.confirmPassword}</div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                    <input
                        id="showPassword"
                        type="checkbox"
                        checked={showPassword}
                        onChange={() => setShowPassword((v) => !v)}
                        disabled={loading}
                    />
                    <label htmlFor="showPassword" style={s.small}>
                        Show passwords
                    </label>
                </div>

                <div style={s.actions}>
                    <button type="submit" style={s.button} disabled={loading}>
                        {loading ? "Creating..." : "Create account"}
                    </button>

                    <button
                        type="button"
                        style={s.ghostButton}
                        onClick={() => {
                            setForm({ name: "", email: "", password: "", confirmPassword: "" });
                            setFieldErrors({});
                            setErrors(null);
                        }}
                        disabled={loading}
                    >
                        Reset
                    </button>
                </div>
            </form>
        </main>
    );
}