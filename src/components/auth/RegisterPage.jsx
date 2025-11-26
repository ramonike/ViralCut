import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (!name || !email || !password) {
            setError("Por favor, preencha todos os campos");
            return;
        }

        if (password.length < 6) {
            setError("A senha deve ter pelo menos 6 caracteres");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/auth/sign-up", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    email,
                    password,
                    name
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Erro ao criar conta");
            } else {
                // Registration successful, navigate to dashboard
                navigate("/dashboard");
            }
        } catch (err) {
            console.error("Register error:", err);
            setError("Erro ao conectar com o servidor");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
            <Card className="w-[350px] bg-slate-800 border-slate-700">
                <CardHeader>
                    <CardTitle>Cadastro</CardTitle>
                    <CardDescription>Crie sua conta ViralCuts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error && <div className="text-red-400 text-sm">{error}</div>}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Nome</label>
                        <Input type="text" value={name} onChange={(e) => setName(e.target.value)} className="bg-slate-900 border-slate-700" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-slate-900 border-slate-700" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Senha (mínimo 6 caracteres)</label>
                        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-slate-900 border-slate-700" />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <Button className="w-full bg-blue-600 hover:bg-blue-500" onClick={handleRegister}>Cadastrar</Button>
                    <p className="text-xs text-slate-400 text-center">
                        Já tem conta? <Link to="/login" className="text-blue-400 hover:underline">Entrar</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
