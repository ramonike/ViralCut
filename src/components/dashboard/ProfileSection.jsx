import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { User, Youtube, BarChart, Settings, LogOut, RefreshCw, CreditCard, Shield, Zap } from "lucide-react";

export function ProfileSection({ state, actions }) {
    const { settings, auth, channelStats } = state;
    const { updateSettings, setYouTubeToken } = actions;

    const isConnected = auth?.youtubeToken && auth?.youtubeTokenExpiresAt > Date.now();

    return (
        <div className="max-w-5xl mx-auto mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4">
            {/* Header do Perfil */}
            <div className="relative glass-panel rounded-2xl overflow-hidden group">
                {/* Banner Background */}
                <div className="absolute inset-0 h-48 bg-surface-900">
                    {channelStats?.brandingSettings?.image?.bannerExternalUrl ? (
                        <img
                            src={channelStats.brandingSettings.image.bannerExternalUrl}
                            alt="Banner"
                            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-surface-800 via-surface-900 to-surface-800"></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-surface-900/50 to-transparent"></div>
                </div>

                <div className="relative z-10 px-8 pt-32 pb-8 flex flex-col md:flex-row items-end md:items-center gap-6">
                    {/* Avatar */}
                    <div className="shrink-0 relative">
                        <div className="w-32 h-32 rounded-full border-4 border-surface-900 shadow-2xl overflow-hidden bg-surface-800 flex items-center justify-center">
                            {channelStats?.thumbnails ? (
                                <img
                                    src={channelStats.thumbnails.high.url}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-12 h-12 text-primary" />
                            )}
                        </div>
                        <div className="absolute bottom-2 right-2 bg-surface-900 rounded-full p-1">
                            <div className={`w-4 h-4 rounded-full border-2 border-surface-900 ${isConnected ? "bg-green-500 animate-pulse" : "bg-slate-500"}`} />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 mb-2">
                        <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-md">
                            {channelStats?.title || settings.channelName || "Seu Canal"}
                        </h2>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                            {channelStats?.customUrl && (
                                <span className="text-slate-300 font-medium text-sm bg-surface-800/50 px-2 py-1 rounded backdrop-blur-sm border border-surface-700/50">
                                    {channelStats.customUrl}
                                </span>
                            )}
                            <span className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-amber-900/20 px-2 py-1 rounded border border-amber-500/20 backdrop-blur-sm">
                                <Zap className="w-3 h-3 fill-current" /> PRO PLAN
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mb-2 flex flex-col gap-2 items-end">
                        {isConnected ? (
                            <>
                                <Button
                                    variant="destructive"
                                    onClick={() => setYouTubeToken({ access_token: null, expires_in: 0 })}
                                    className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 backdrop-blur-sm transition-all"
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
                            </>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <GoogleAuthButton
                                    onLoginSuccess={setYouTubeToken}
                                    onLoginError={(err) => alert("Falha no login: " + JSON.stringify(err))}
                                />
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs text-primary hover:text-white"
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
                    <div className="px-8 pb-8 pt-4 border-t border-surface-700/50 mt-4">
                        <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
                            {channelStats.description}
                        </p>
                    </div>
                )}
            </div>

            {/* Estatísticas */}
            {isConnected && channelStats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="glass-card rounded-xl p-6 flex items-center gap-4">
                        <div className="p-3 bg-red-500/10 rounded-xl text-red-500 border border-red-500/20">
                            <User className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Inscritos</p>
                            <p className="text-2xl font-black text-white">
                                {parseInt(channelStats.statistics.subscriberCount).toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <div className="glass-card rounded-xl p-6 flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500 border border-blue-500/20">
                            <BarChart className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Visualizações</p>
                            <p className="text-2xl font-black text-white">
                                {parseInt(channelStats.statistics.viewCount).toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <div className="glass-card rounded-xl p-6 flex items-center gap-4">
                        <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500 border border-purple-500/20">
                            <Youtube className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Vídeos</p>
                            <p className="text-2xl font-black text-white">
                                {parseInt(channelStats.statistics.videoCount).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Configurações Gerais */}
                <div className="lg:col-span-2 glass-panel rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-surface-700/50">
                        <h3 className="font-bold text-white text-lg flex items-center gap-2">
                            <Settings className="w-5 h-5 text-primary" /> Configurações do Dashboard
                        </h3>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs text-slate-400 mb-1.5 block font-medium">Nome Interno</label>
                                <Input
                                    value={settings.channelName}
                                    onChange={(e) => updateSettings({ channelName: e.target.value })}
                                    className="bg-surface-800 border-surface-600 text-white focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 mb-1.5 block font-medium">Fuso Horário</label>
                                <Input
                                    value={settings.timezone}
                                    onChange={(e) => updateSettings({ timezone: e.target.value })}
                                    className="bg-surface-800 border-surface-600 text-white focus:border-primary"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs text-slate-400 mb-1.5 block font-medium">Texto do CTA</label>
                                <Input
                                    value={settings.ctaText}
                                    onChange={(e) => updateSettings({ ctaText: e.target.value })}
                                    className="bg-surface-800 border-surface-600 text-white focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 mb-1.5 block font-medium">Link do CTA</label>
                                <Input
                                    value={settings.ctaLink}
                                    onChange={(e) => updateSettings({ ctaLink: e.target.value })}
                                    className="bg-surface-800 border-surface-600 text-white focus:border-primary"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Plan & Billing Mockup */}
                <div className="space-y-6">
                    <div className="glass-panel rounded-xl overflow-hidden">
                        <div className="p-6 border-b border-surface-700/50 bg-gradient-to-br from-amber-900/20 to-transparent">
                            <h3 className="font-bold text-amber-400 text-lg flex items-center gap-2">
                                <Shield className="w-5 h-5" /> Assinatura
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 text-sm">Plano Atual</span>
                                <span className="text-white font-bold bg-surface-800 px-3 py-1 rounded-full text-sm border border-surface-700">PRO</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 text-sm">Status</span>
                                <span className="text-green-400 font-bold text-sm flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" /> Ativo
                                </span>
                            </div>
                            <div className="pt-4 border-t border-surface-700/50">
                                <Button className="w-full bg-surface-800 hover:bg-surface-700 text-white border border-surface-600">
                                    Gerenciar Assinatura
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel rounded-xl overflow-hidden">
                        <div className="p-6 border-b border-surface-700/50">
                            <h3 className="font-bold text-white text-lg flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-primary" /> Pagamento
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-3 p-3 bg-surface-800/50 rounded-lg border border-surface-700/50">
                                <div className="w-10 h-6 bg-slate-700 rounded flex items-center justify-center text-[10px] font-bold text-slate-400">
                                    VISA
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-white font-mono">•••• 4242</p>
                                    <p className="text-[10px] text-slate-500">Expira em 12/28</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
