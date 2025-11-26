import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/card";

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const token = searchParams.get("token");

    useEffect(() => {
        if (!token) {
            setError("Token inválido. Solicite um novo reset de senha.");
        }
    }, [token]);

    const handleSubmit = async () => {
        if (!newPassword || !confirmPassword) {
            setError("Por favor, preencha todos os campos");
            return;
        }

        if (newPassword.length < 6) {
            setError("A senha deve ter pelo menos 6 caracteres");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("As senhas não coincidem");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch("http://localhost:3000/api/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    token,
                    newPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } else {
                setError(data.error || "Erro ao resetar senha");
            }
        } catch (err) {
            console.error("Reset password error:", err);
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
                        <CardTitle className="text-green-400">Senha Resetada!</CardTitle>
                        <CardDescription>Sua senha foi alterada com sucesso</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-300 text-sm">
                            Redirecionando para a página de login...
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
            <Card className="w-[400px] bg-slate-800 border-slate-700">
                <CardHeader>
                    <CardTitle>Resetar Senha</CardTitle>
                    <CardDescription>Digite sua nova senha</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {error && <div className="text-red-400 text-sm">{error}</div>}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Nova Senha</label>
                        <Input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="bg-slate-900 border-slate-700"
                            disabled={loading || !token}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Confirmar Senha</label>
                        <Input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                            className="bg-slate-900 border-slate-700"
                            disabled={loading || !token}
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <Button
                        className="w-full bg-blue-600 hover:bg-blue-500"
                        onClick={handleSubmit}
                        disabled={loading || !token}
                    >
                        {loading ? "Resetando..." : "Resetar Senha"}
                    </Button>
                    <p className="text-xs text-slate-400 text-center">
                        <Link to="/login" className="text-blue-400 hover:underline">Voltar para Login</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
