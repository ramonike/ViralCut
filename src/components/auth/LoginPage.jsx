import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            setError("Por favor, preencha todos os campos");
            return;
        }

        if (password.length < 8) {
            setError("A senha deve ter pelo menos 8 caracteres");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/auth/sign-in/email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Erro ao fazer login");
            } else {
                // Login successful, navigate to dashboard
                navigate("/dashboard");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Erro ao conectar com o servidor");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
            <Card className="w-[350px] bg-slate-800 border-slate-700">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Entre na sua conta ViralCuts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error && <div className="text-red-400 text-sm">{error}</div>}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-slate-900 border-slate-700" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Senha (mínimo 8 caracteres)</label>
                        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-slate-900 border-slate-700" />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <Button className="w-full bg-blue-600 hover:bg-blue-500" onClick={handleLogin}>Entrar</Button>
                    <p className="text-xs text-slate-400 text-center">
                        Não tem conta? <Link to="/register" className="text-blue-400 hover:underline">Cadastre-se</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
