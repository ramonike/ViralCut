import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { User, Youtube, BarChart, Settings, LogOut, RefreshCw, CreditCard, Shield, Zap, Plus, Users, Check, ChevronDown, ChevronRight, Bell, Upload, Activity, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function ProfileSection({ state, actions }) {
    const { settings, auth, channelStats } = state;
    const { updateSettings, setYouTubeToken, switchAccount, disconnectAccount } = actions;

    const isConnected = auth?.youtubeToken && auth?.youtubeTokenExpiresAt > Date.now();
    const connectedAccounts = auth?.connectedAccounts || [];

    return (
        <div className="max-w-5xl mx-auto mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4">
            {/* Account Switcher & Header */}
            <div className="relative z-10 flex justify-between items-center bg-surface-800/50 p-4 rounded-xl border border-surface-700/50 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-white">Gerenciar Canais</h2>
                        <p className="text-xs text-slate-400">{connectedAccounts.length} canais conectados</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {connectedAccounts.length > 0 && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="border-surface-600 bg-surface-800 text-slate-200 hover:bg-surface-700 hover:text-white w-[260px] justify-between px-3">
                                    <span className="flex items-center gap-2 truncate">
                                        {channelStats?.thumbnails?.default?.url ? (
                                            <img
                                                src={channelStats.thumbnails.default.url}
                                                className="w-5 h-5 rounded-full ring-2 ring-primary/50"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'block';
                                                }}
                                            />
                                        ) : null}
                                        <User
                                            className="w-4 h-4"
                                            style={{ display: channelStats?.thumbnails?.default?.url ? 'none' : 'block' }}
                                        />
                                        <span className="truncate max-w-[180px] font-semibold">{channelStats?.title || "Selecione um canal"}</span>
                                    </span>
                                    <ChevronDown className="w-4 h-4 opacity-50 shrink-0" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[280px] bg-surface-800 border-surface-700 text-slate-200">
                                {/* Active Channel Section */}
                                <div className="px-2 py-1.5">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Canal Ativo</p>
                                    {connectedAccounts
                                        .filter(account => auth.activeAccountId === account.id)
                                        .map(account => (
                                            <div
                                                key={account.id}
                                                className="flex items-center justify-between p-2 rounded-lg bg-primary/10 border border-primary/20 group"
                                            >
                                                <div className="flex items-center gap-3 truncate flex-1">
                                                    {account.avatar ? (
                                                        <img
                                                            src={account.avatar}
                                                            className="w-8 h-8 rounded-full ring-2 ring-primary/50"
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                e.target.nextSibling.style.display = 'block';
                                                            }}
                                                        />
                                                    ) : null}
                                                    <User
                                                        className="w-8 h-8 p-1.5 bg-primary/20 rounded-full text-primary"
                                                        style={{ display: account.avatar ? 'none' : 'block' }}
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-white truncate">{account.name}</p>
                                                        <p className="text-xs text-primary font-medium">Principal</p>
                                                    </div>
                                                </div>
                                                {/* Disconnect Button for Active Account */}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 text-slate-400 hover:text-red-400 hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (confirm("Desconectar este canal?")) {
                                                            actions.disconnectAccount(account.id);
                                                        }
                                                    }}
                                                    title="Desconectar canal"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        ))}
                                </div>

                                {/* Other Channels Section */}
                                {connectedAccounts.filter(account => auth.activeAccountId !== account.id).length > 0 && (
                                    <>
                                        <DropdownMenuSeparator className="bg-surface-700" />
                                        <div className="px-2 py-1.5">
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Outros Canais</p>
                                            {connectedAccounts
                                                .filter(account => auth.activeAccountId !== account.id)
                                                .map(account => (
                                                    <div
                                                        key={account.id}
                                                        className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-700 cursor-pointer group mb-1"
                                                        onClick={() => switchAccount(account.id)}
                                                    >
                                                        <div className="flex items-center gap-3 truncate flex-1">
                                                            {account.avatar ? (
                                                                <img
                                                                    src={account.avatar}
                                                                    className="w-7 h-7 rounded-full opacity-80"
                                                                    onError={(e) => {
                                                                        e.target.style.display = 'none';
                                                                        e.target.nextSibling.style.display = 'block';
                                                                    }}
                                                                />
                                                            ) : null}
                                                            <User
                                                                className="w-7 h-7 p-1.5 bg-surface-600 rounded-full opacity-80"
                                                                style={{ display: account.avatar ? 'none' : 'block' }}
                                                            />
                                                            <span className="truncate text-slate-300">{account.name}</span>
                                                        </div>

                                                        <div className="flex items-center gap-1">
                                                            {/* Disconnect Button for Other Accounts */}
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6 text-slate-500 hover:text-red-400 hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (confirm("Remover este canal da lista?")) {
                                                                        actions.disconnectAccount(account.id);
                                                                    }
                                                                }}
                                                                title="Remover canal"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </Button>
                                                            <ChevronRight className="w-4 h-4 text-slate-500" />
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </>
                                )}

                                <DropdownMenuSeparator className="bg-surface-700" />
                                <div className="p-2">
                                    <GoogleAuthButton
                                        onLoginSuccess={setYouTubeToken}
                                        onLoginError={(err) => alert("Erro: " + JSON.stringify(err))}
                                        text="+ Conectar Novo Canal"
                                        className="w-full justify-center h-9 text-sm font-semibold bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30"
                                    />
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {!isConnected && connectedAccounts.length === 0 && (
                        <div className="flex gap-2">
                            <GoogleAuthButton
                                onLoginSuccess={setYouTubeToken}
                                onLoginError={(err) => alert("Falha no login: " + JSON.stringify(err))}
                            />
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-primary hover:text-white"
                                onClick={() => setYouTubeToken({ access_token: "MOCK_TOKEN_" + Date.now(), expires_in: 3600 })}
                            >
                                Simular (Dev)
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Header do Perfil Ativo */}
            <div className="relative glass-panel rounded-2xl overflow-hidden group">
                {/* Banner Background */}
                {/* Banner Background */}
                <div className="absolute inset-0 h-48 bg-surface-900">
                    {channelStats?.brandingSettings?.image?.bannerExternalUrl ? (
                        <img
                            src={channelStats.brandingSettings.image.bannerExternalUrl}
                            alt="Banner"
                            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                            onError={(e) => {
                                e.target.style.display = 'none'; // Hide image to show gradient background
                            }}
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
                                    src={channelStats.thumbnails.high?.url || channelStats.thumbnails.medium?.url || channelStats.thumbnails.default?.url}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                    onLoad={(e) => {
                                        // Check if image is too small (likely a placeholder or error)
                                        if (e.target.naturalWidth < 10 || e.target.naturalHeight < 10) {
                                            const channelName = channelStats?.title || "User";
                                            // Generate consistent color from channel name
                                            const colors = ['a3e635', '22d3ee', 'f472b6', 'fb923c', 'a78bfa', 'fbbf24'];
                                            const colorIndex = channelName.charCodeAt(0) % colors.length;
                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(channelName)}&background=${colors[colorIndex]}&color=fff&size=128&bold=true&font-size=0.4`;
                                        }
                                    }}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        const channelName = channelStats?.title || "User";
                                        const colors = ['a3e635', '22d3ee', 'f472b6', 'fb923c', 'a78bfa', 'fbbf24'];
                                        const colorIndex = channelName.charCodeAt(0) % colors.length;
                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(channelName)}&background=${colors[colorIndex]}&color=fff&size=128&bold=true&font-size=0.4`;
                                    }}
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
                        {isConnected && (
                            <>
                                <Button
                                    variant="destructive"
                                    onClick={() => disconnectAccount(auth.activeAccountId)}
                                    className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 backdrop-blur-sm transition-all"
                                >
                                    <LogOut className="w-4 h-4 mr-2" /> Desconectar Canal
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
                {/* Padrões de Upload */}
                <div className="lg:col-span-2 glass-panel rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-surface-700/50">
                        <h3 className="font-bold text-white text-lg flex items-center gap-2">
                            <Upload className="w-5 h-5 text-primary" /> Padrões de Upload
                        </h3>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs text-slate-600 mb-1.5 block font-medium">Visibilidade Padrão</label>
                                <select
                                    value={settings.defaultVisibility || "public"}
                                    onChange={(e) => updateSettings({ defaultVisibility: e.target.value })}
                                    className="w-full bg-white border border-slate-300 text-slate-800 rounded-md h-10 px-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                >
                                    <option value="public">Público</option>
                                    <option value="unlisted">Não Listado</option>
                                    <option value="private">Privado</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-slate-600 mb-1.5 block font-medium">Categoria Padrão</label>
                                <select
                                    value={settings.defaultCategory || "24"}
                                    onChange={(e) => updateSettings({ defaultCategory: e.target.value })}
                                    className="w-full bg-white border border-slate-300 text-slate-800 rounded-md h-10 px-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                >
                                    <option value="24">Entretenimento</option>
                                    <option value="10">Música</option>
                                    <option value="20">Jogos</option>
                                    <option value="22">Pessoas e Blogs</option>
                                    <option value="27">Educação</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-slate-600 mb-1.5 block font-medium">Tags Padrão (separadas por vírgula)</label>
                            <Input
                                value={settings.defaultTags || ""}
                                onChange={(e) => updateSettings({ defaultTags: e.target.value })}
                                placeholder="shorts, viral, clips..."
                                className="bg-white border-slate-300 text-slate-800 placeholder:text-slate-400 focus:border-primary"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs text-slate-600 mb-1.5 block font-medium">Texto do CTA</label>
                                <Input
                                    value={settings.ctaText}
                                    onChange={(e) => updateSettings({ ctaText: e.target.value })}
                                    className="bg-white border-slate-300 text-slate-800 focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-600 mb-1.5 block font-medium">Link do CTA</label>
                                <Input
                                    value={settings.ctaLink}
                                    onChange={(e) => updateSettings({ ctaLink: e.target.value })}
                                    className="bg-white border-slate-300 text-slate-800 focus:border-primary"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notifications & API Limits */}
                <div className="space-y-6">
                    {/* Notifications */}
                    <div className="glass-panel rounded-xl overflow-hidden">
                        <div className="p-6 border-b border-surface-700/50 bg-gradient-to-br from-blue-900/20 to-transparent">
                            <h3 className="font-bold text-blue-400 text-lg flex items-center gap-2">
                                <Bell className="w-5 h-5" /> Notificações
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm text-slate-300">Upload Concluído</label>
                                <input
                                    type="checkbox"
                                    checked={settings.notifyUpload !== false}
                                    onChange={(e) => updateSettings({ notifyUpload: e.target.checked })}
                                    className="w-5 h-5 rounded border-surface-600 bg-surface-800 text-primary focus:ring-primary"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="text-sm text-slate-300">Erros de Processamento</label>
                                <input
                                    type="checkbox"
                                    checked={settings.notifyError !== false}
                                    onChange={(e) => updateSettings({ notifyError: e.target.checked })}
                                    className="w-5 h-5 rounded border-surface-600 bg-surface-800 text-primary focus:ring-primary"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="text-sm text-slate-300">Resumo Semanal</label>
                                <input
                                    type="checkbox"
                                    checked={settings.notifyWeekly === true}
                                    onChange={(e) => updateSettings({ notifyWeekly: e.target.checked })}
                                    className="w-5 h-5 rounded border-surface-600 bg-surface-800 text-primary focus:ring-primary"
                                />
                            </div>
                        </div>
                    </div>

                    {/* API Limits */}
                    <div className="glass-panel rounded-xl overflow-hidden">
                        <div className="p-6 border-b border-surface-700/50">
                            <h3 className="font-bold text-white text-lg flex items-center gap-2">
                                <Activity className="w-5 h-5 text-primary" /> Limites da API
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="text-slate-400">Cota Diária YouTube</span>
                                    <span className="text-white font-bold">
                                        {state.quota ? Math.round((state.quota.used / state.quota.limit) * 100) : 0}%
                                        <span className="text-slate-500 font-normal ml-1">
                                            ({state.quota?.used || 0}/{state.quota?.limit || 10000})
                                        </span>
                                    </span>
                                </div>
                                <div className="w-full bg-surface-800 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-500 ${(state.quota?.used || 0) > 8000 ? 'bg-red-500' :
                                            (state.quota?.used || 0) > 5000 ? 'bg-yellow-500' : 'bg-primary'
                                            }`}
                                        style={{ width: `${Math.min(100, ((state.quota?.used || 0) / (state.quota?.limit || 10000)) * 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                                <RefreshCw className="w-3 h-3" />
                                Renova em: {(() => {
                                    const now = new Date();
                                    const ptNow = new Date(now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
                                    const ptMidnight = new Date(ptNow);
                                    ptMidnight.setHours(24, 0, 0, 0);
                                    const msUntilReset = ptMidnight - ptNow;
                                    const hours = Math.floor(msUntilReset / 3600000);
                                    const minutes = Math.floor((msUntilReset % 3600000) / 60000);
                                    return `${hours}h ${minutes}m`;
                                })()} (Meia-noite PT)
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
