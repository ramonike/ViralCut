import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { User, Youtube, BarChart, Settings, LogOut, RefreshCw } from "lucide-react";

export function ProfileSection({ state, actions }) {
    const { settings, auth, channelStats } = state;
    const { updateSettings, setYouTubeToken } = actions;

    const isConnected = auth?.youtubeToken && auth?.youtubeTokenExpiresAt > Date.now();

    return (
        <div className="max-w-5xl mx-auto mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4">
            {/* Header do Perfil */}
            <div className="relative bg-viral-800 rounded-2xl border border-viral-700 shadow-2xl overflow-hidden">
                {/* Banner Background */}
                <div className="absolute inset-0 h-48 bg-viral-900">
                    {channelStats?.brandingSettings?.image?.bannerExternalUrl ? (
                        <img
                            src={channelStats.brandingSettings.image.bannerExternalUrl}
                            alt="Banner"
                            className="w-full h-full object-cover opacity-60"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-viral-800 via-viral-900 to-viral-800"></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-viral-800 via-viral-800/50 to-transparent"></div>
                </div>

                <div className="relative z-10 px-8 pt-32 pb-8 flex flex-col md:flex-row items-end md:items-center gap-6">
                    {/* Avatar */}
                    <div className="shrink-0">
                        {channelStats?.thumbnails ? (
                            <img
                                src={channelStats.thumbnails.high.url}
                                alt="Avatar"
                                className="w-32 h-32 rounded-full border-4 border-viral-900 shadow-2xl"
                            />
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-viral-900 border-4 border-viral-700 flex items-center justify-center shadow-lg">
                                <User className="w-12 h-12 text-viral-500" />
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 mb-2">
                        <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-md">
                            {channelStats?.title || settings.channelName || "Seu Canal"}
                        </h2>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                            {channelStats?.customUrl && (
                                <span className="text-slate-300 font-medium text-sm bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
                                    {channelStats.customUrl}
                                </span>
                            )}
                            {channelStats?.id && (
                                <span className="text-slate-500 text-xs bg-black/20 px-2 py-1 rounded font-mono" title="ID do Canal">
                                    ID: {channelStats.id}
                                </span>
                            )}
                            {isConnected ? (
                                <span className="flex items-center gap-1 text-green-400 text-xs font-bold bg-green-900/30 px-2 py-1 rounded border border-green-500/30 backdrop-blur-sm">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> CONECTADO
                                </span>
                            ) : (
                                <span className="text-slate-400 text-xs bg-slate-800/50 px-2 py-1 rounded">Não conectado</span>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mb-2">
                        {isConnected ? (
                            <div className="flex flex-col gap-2 items-end">
                                <Button
                                    variant="destructive"
                                    onClick={() => setYouTubeToken({ access_token: null, expires_in: 0 })}
                                    className="bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 backdrop-blur-sm"
                                >
                                    <LogOut className="w-4 h-4 mr-2" /> Desconectar
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 text-xs text-slate-400 hover:text-white px-2"
                                    onClick={() => actions.refreshChannelStats()}
                                >
                                    <RefreshCw className="w-3 h-3 mr-1" /> Atualizar Dados
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <GoogleAuthButton
                                    onLoginSuccess={setYouTubeToken}
                                    onLoginError={(err) => alert("Falha no login: " + JSON.stringify(err))}
                                />
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs text-viral-400 hover:text-white"
                                    onClick={() => setYouTubeToken({ access_token: "MOCK_TOKEN", expires_in: 3600 })}
                                >
                                    Simular (Dev Mode)
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Description Section */}
                {channelStats?.description && (
                    <div className="px-8 pb-8 pt-4 border-t border-viral-700/50 mt-4">
                        <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
                            {channelStats.description}
                        </p>
                        {channelStats.publishedAt && (
                            <p className="text-xs text-slate-600 mt-4 font-medium uppercase tracking-wider">
                                Criado em: {new Date(channelStats.publishedAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Estatísticas */}
            {isConnected && channelStats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-viral-800 border-viral-700">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-3 bg-red-500/10 rounded-lg text-red-500">
                                <User className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Inscritos</p>
                                <p className="text-2xl font-black text-white">
                                    {parseInt(channelStats.statistics.subscriberCount).toLocaleString()}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-viral-800 border-viral-700">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
                                <BarChart className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Visualizações</p>
                                <p className="text-2xl font-black text-white">
                                    {parseInt(channelStats.statistics.viewCount).toLocaleString()}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-viral-800 border-viral-700">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500">
                                <Youtube className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Vídeos</p>
                                <p className="text-2xl font-black text-white">
                                    {parseInt(channelStats.statistics.videoCount).toLocaleString()}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Configurações Gerais */}
            <Card className="bg-viral-800 border-viral-700">
                <CardHeader className="border-b border-viral-700/50 pb-4">
                    <h3 className="font-bold text-white text-lg flex items-center gap-2">
                        <Settings className="w-5 h-5 text-viral-neon" /> Configurações do Dashboard
                    </h3>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs text-slate-400 mb-1.5 block font-medium">Nome Interno do Canal</label>
                            <Input
                                value={settings.channelName}
                                onChange={(e) => updateSettings({ channelName: e.target.value })}
                                className="bg-viral-900 border-viral-600 text-white focus:border-viral-neon"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 mb-1.5 block font-medium">Fuso Horário</label>
                            <Input
                                value={settings.timezone}
                                onChange={(e) => updateSettings({ timezone: e.target.value })}
                                className="bg-viral-900 border-viral-600 text-white focus:border-viral-neon"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs text-slate-400 mb-1.5 block font-medium">Texto do CTA Flutuante</label>
                            <Input
                                value={settings.ctaText}
                                onChange={(e) => updateSettings({ ctaText: e.target.value })}
                                className="bg-viral-900 border-viral-600 text-white focus:border-viral-neon"
                                placeholder="Ex: 🚀 Acesse o Curso Completo"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 mb-1.5 block font-medium">Link do CTA</label>
                            <Input
                                value={settings.ctaLink}
                                onChange={(e) => updateSettings({ ctaLink: e.target.value })}
                                className="bg-viral-900 border-viral-600 text-white focus:border-viral-neon"
                                placeholder="https://seu-link.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-slate-400 mb-1.5 block font-medium">Plataformas de Upload</label>
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
                                    className="w-40 bg-viral-900 border-viral-600 text-white focus:border-viral-neon"
                                />
                            ))}
                            <Button
                                onClick={() => updateSettings({ uploadTargets: [...settings.uploadTargets, "Nova"] })}
                                variant="outline"
                                className="border-viral-600 text-viral-400 hover:text-white hover:bg-viral-700"
                            >
                                + Adicionar
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
