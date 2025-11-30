import { useState } from "react";
import { API_ENDPOINTS, API_URL } from '../../config/api';
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/card";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!email) {
            setError("Por favor, insira seu email");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                // In development, show the token
                if (data.token) {
                    console.log("Reset token (DEV ONLY):", data.token);
                    console.log("Reset link:", `http://localhost:5173/reset-password?token=${data.token}`);
                }
            } else {
                setError(data.error || "Erro ao solicitar reset de senha");
            }
        } catch (err) {
            console.error("Forgot password error:", err);
            setError("Erro ao conectar com o servidor");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
                <Card className="w-[400px] bg-slate-800 border-slate-700">
                    <CardHeader>
                        <CardTitle>Email Enviado!</CardTitle>
                        <CardDescription>Verifique sua caixa de entrada</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-300 text-sm">
                            Se o email <strong>{email}</strong> estiver cadastrado, você receberá instruções para resetar sua senha.
                        </p>
                        <p className="text-slate-400 text-xs mt-4">
                            Não recebeu o email? Verifique sua pasta de spam.
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Link to="/login" className="w-full">
                            <Button className="w-full bg-blue-600 hover:bg-blue-500">
                                Voltar para Login
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
            <Card className="w-[400px] bg-slate-800 border-slate-700">
                <CardHeader>
                    <CardTitle>Esqueceu sua senha?</CardTitle>
                    <CardDescription>Digite seu email para receber instruções</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error && <div className="text-red-400 text-sm">{error}</div>}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                            className="bg-slate-900 border-slate-700"
                            disabled={loading}
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <Button
                        className="w-full bg-blue-600 hover:bg-blue-500"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Enviando..." : "Enviar Instruções"}
                    </Button>
                    <p className="text-xs text-slate-400 text-center">
                        Lembrou sua senha? <Link to="/login" className="text-blue-400 hover:underline">Entrar</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
