import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { GoogleAuthButton } from "./GoogleAuthButton";

export function SettingsSection({ state, actions }) {
    const { settings, auth } = state;
    const { updateSettings, setYouTubeToken } = actions;

    const isConnected = auth?.youtubeToken && auth?.youtubeTokenExpiresAt > Date.now();

    return (
        <section className="max-w-4xl mx-auto mt-12">
            <Card>
                <CardHeader>
                    <h3 className="font-bold text-blue-800 text-lg">Configurações do Canal</h3>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <div>
                                <p className="font-semibold text-slate-700">Conexão YouTube</p>
                                <p className="text-xs text-slate-500">
                                    {isConnected
                                        ? "Conectado e pronto para uploads."
                                        : "Conecte sua conta para fazer uploads reais."}
                                </p>
                            </div>
                            {isConnected ? (
                                <div className="flex gap-2">
                                    <Button variant="outline" className="text-green-600 border-green-200 bg-green-50 hover:bg-green-100">
                                        Conectado {auth?.youtubeToken === "MOCK_TOKEN" ? "(Simulado)" : "✓"}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => setYouTubeToken({ access_token: null, expires_in: 0 })}
                                    >
                                        Desconectar
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <GoogleAuthButton
                                        onLoginSuccess={setYouTubeToken}
                                        onLoginError={(err) => alert("Falha no login: " + JSON.stringify(err))}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setYouTubeToken({ access_token: "MOCK_TOKEN", expires_in: 3600 })}
                                    >
                                        Simular (Dev)
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div>
                            <p className="text-xs text-slate-400 mb-1">Nome do canal</p>
                            <Input
                                value={settings.channelName}
                                onChange={(e) => updateSettings({ channelName: e.target.value })}
                            />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 mb-1">Timezone</p>
                            <Input
                                value={settings.timezone}
                                onChange={(e) => updateSettings({ timezone: e.target.value })}
                            />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 mb-1">Plataformas alvo</p>
                            <div className="flex flex-wrap gap-2">
                                {settings.uploadTargets.map((target, idx) => (
                                    <Input
                                        key={idx}
                                        value={target}
                                        onChange={(e) => {
                                            const updated = [...settings.uploadTargets];
                                            updated[idx] = e.target.value;
                                            updateSettings({ uploadTargets: updated });
                                        }}
                                        className="w-40"
                                    />
                                ))}
                                <Button
                                    size="sm"
                                    onClick={() => updateSettings({ uploadTargets: [...settings.uploadTargets, "Nova plataforma"] })}
                                    variant="secondary"
                                >
                                    +
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
