import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Link as LinkIcon, Eye, ExternalLink, LayoutGrid, List, Upload, Sparkles, Search, RefreshCw, ThumbsUp } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export function PipelineSection({ state, actions }) {
    const { addToUploadQueue, refreshChannelStats } = actions;
    const { settings, pipeline, suggestions } = state;
    const [viewMode, setViewMode] = useState("list"); // 'list' | 'grid'
    const [activeCreationTab, setActiveCreationTab] = useState("ai-tools"); // 'ai-tools' | 'libraries' | 'suggestions' | 'upload'
    const [activeAITool, setActiveAITool] = useState("vizard"); // 'vizard' | 'opus' | 'klap' | 'submagic'
    const [privacyStatus, setPrivacyStatus] = useState("private");
    const [publishAt, setPublishAt] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const fileInputRef = useRef(null);

    function handleFileSelect(e) {
        const file = e.target.files?.[0];
        if (file) {
            addToUploadQueue({
                title: file.name.replace(/\.[^/.]+$/, ""),
                source: "upload",
                platform: "YouTube Shorts",
                file: file,
                privacyStatus: privacyStatus,
                publishAt: publishAt ? new Date(publishAt).toISOString() : undefined
            });
            e.target.value = "";
            alert("Vídeo adicionado à fila de upload! 🚀");
        }
    }

    const aiTools = [
        {
            id: "vizard",
            name: "Vizard.ai",
            description: "Cortes automáticos com IA de vídeos longos",
            url: "https://vizard.ai/workspace",
            color: "from-purple-500 to-pink-500",
            icon: "🎬"
        },
        {
            id: "opus",
            name: "OpusClip",
            description: "Crie shorts virais automaticamente",
            url: "https://www.opus.pro/",
            color: "from-blue-500 to-cyan-500",
            icon: "✂️"
        },
        {
            id: "klap",
            name: "Klap",
            description: "Transforme vídeos em shorts com legendas",
            url: "https://klap.app/",
            color: "from-green-500 to-emerald-500",
            icon: "⚡"
        },
        {
            id: "submagic",
            name: "Submagic",
            description: "Legendas animadas e edição automática",
            url: "https://www.submagic.co/",
            color: "from-orange-500 to-red-500",
            icon: "💫"
        }
    ];

    const videoLibraries = [
        {
            name: "Mixkit",
            description: "Vídeos gratuitos de alta qualidade",
            url: "https://mixkit.co/free-stock-video/",
            icon: "🎥"
        },
        {
            name: "Pexels Videos",
            description: "Milhares de vídeos gratuitos",
            url: "https://www.pexels.com/videos/",
            icon: "📹"
        },
        {
            name: "Pixabay Videos",
            description: "Vídeos livres de direitos autorais",
            url: "https://pixabay.com/videos/",
            icon: "🎞️"
        },
        {
            name: "Coverr",
            description: "Vídeos para backgrounds e B-roll",
            url: "https://coverr.co/",
            icon: "🌟"
        }
    ];

    return (
        <section id="pipeline-section" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Unified Creation Area */}
            <div className="glass-panel rounded-2xl overflow-hidden">
                <div className="flex border-b border-surface-700/50">
                    <button
                        onClick={() => setActiveCreationTab("ai-tools")}
                        onDragOver={(e) => {
                            e.preventDefault();
                            if (activeCreationTab !== "ai-tools") {
                                setActiveCreationTab("ai-tools");
                            }
                        }}
                        className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeCreationTab === "ai-tools"
                            ? "bg-surface-800 text-white border-b-2 border-primary"
                            : "text-slate-400 hover:text-white hover:bg-surface-800/50"
                            }`}
                    >
                        <LinkIcon className="w-4 h-4" /> Ferramentas IA
                    </button>
                    <button
                        onClick={() => setActiveCreationTab("libraries")}
                        onDragOver={(e) => {
                            e.preventDefault();
                            if (activeCreationTab !== "libraries") {
                                setActiveCreationTab("libraries");
                            }
                        }}
                        className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeCreationTab === "libraries"
                            ? "bg-surface-800 text-white border-b-2 border-primary"
                            : "text-slate-400 hover:text-white hover:bg-surface-800/50"
                            }`}
                    >
                        📚 Bibliotecas Virais
                    </button>
                    <button
                        onClick={() => setActiveCreationTab("suggestions")}
                        className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeCreationTab === "suggestions"
                            ? "bg-surface-800 text-white border-b-2 border-primary"
                            : "text-slate-400 hover:text-white hover:bg-surface-800/50"
                            }`}
                    >
                        <Sparkles className="w-4 h-4" /> Vídeos Virais
                    </button>
                    <button
                        onClick={() => setActiveCreationTab("upload")}
                        className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeCreationTab === "upload"
                            ? "bg-surface-800 text-white border-b-2 border-primary"
                            : "text-slate-400 hover:text-white hover:bg-surface-800/50"
                            }`}
                    >
                        <Upload className="w-4 h-4" /> Upload de Vídeo
                    </button>
                </div>

                <div className="p-4">
                    {activeCreationTab === "ai-tools" ? (
                        <div className="space-y-4">
                            {/* AI Tool Selector */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {aiTools.map(tool => (
                                    <button
                                        key={tool.id}
                                        onClick={() => setActiveAITool(tool.id)}
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            if (activeAITool !== tool.id) {
                                                setActiveAITool(tool.id);
                                            }
                                        }}
                                        className={`p-3 rounded-lg border transition-all ${activeAITool === tool.id
                                            ? "border-primary bg-primary/10 text-white"
                                            : "border-surface-700 bg-surface-800/50 text-slate-400 hover:border-primary/50 hover:text-white"
                                            }`}
                                    >
                                        <div className="text-2xl mb-1">{tool.icon}</div>
                                        <div className="text-xs font-bold">{tool.name}</div>
                                    </button>
                                ))}
                            </div>

                            {/* Active AI Tool Card */}
                            {aiTools.filter(t => t.id === activeAITool).map(tool => (
                                <div
                                    key={tool.id}
                                    className="bg-surface-900/50 rounded-xl p-8 border border-dashed border-surface-700/50 hover:border-primary/50 hover:bg-surface-800/50 transition-all duration-300 group cursor-pointer relative overflow-hidden text-center"
                                    onClick={() => window.open(tool.url, "_blank")}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={async (e) => {
                                        e.preventDefault();
                                        const text = e.dataTransfer.getData("text/uri-list") || e.dataTransfer.getData("text/plain");
                                        if (text) {
                                            try {
                                                await navigator.clipboard.writeText(text);
                                                alert(`LINK COPIADO! 📋\nCole no ${tool.name} (Ctrl+V).`);
                                                window.open(tool.url, "_blank");
                                            } catch (err) {
                                                prompt("Copie o link:", text);
                                                window.open(tool.url, "_blank");
                                            }
                                        }
                                    }}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
                                    <div className="flex flex-col items-center gap-4 relative z-10">
                                        <div className="text-6xl">{tool.icon}</div>
                                        <div className="space-y-1">
                                            <h3 className="text-lg font-bold text-slate-200 group-hover:text-white transition-colors">
                                                Abrir {tool.name}
                                            </h3>
                                            <p className="text-sm text-slate-400 max-w-xs mx-auto">
                                                {tool.description}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-2">
                                                💡 Arraste um link do YouTube aqui para copiar automaticamente
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : activeCreationTab === "libraries" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {videoLibraries.map((library, idx) => (
                                <div
                                    key={idx}
                                    className="bg-surface-900/50 rounded-xl p-6 border border-surface-700/50 hover:border-primary/50 hover:bg-surface-800/50 transition-all duration-300 group cursor-pointer"
                                    onClick={() => window.open(library.url, "_blank")}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="text-4xl">{library.icon}</div>
                                        <div className="flex-1">
                                            <h3 className="text-base font-bold text-slate-200 group-hover:text-white transition-colors mb-1">
                                                {library.name}
                                            </h3>
                                            <p className="text-sm text-slate-400">
                                                {library.description}
                                            </p>
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-primary transition-colors" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : activeCreationTab === "suggestions" ? (
                        <div className="space-y-4">
                            {/* Drag Hint Banner */}
                            <div className="bg-gradient-to-r from-purple-900/20 via-purple-800/10 to-transparent border border-purple-500/20 rounded-lg p-3">
                                <div className="flex items-start gap-3">
                                    <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-bold text-purple-300 mb-1">💡 Dica: Arraste para Criar</h4>
                                        <p className="text-xs text-slate-400">
                                            Arraste qualquer vídeo abaixo e passe sobre a aba <span className="text-purple-400 font-semibold">Ferramentas IA</span> - ela abrirá automaticamente! Depois, escolha a ferramenta passando o mouse sobre ela e solte para copiar o link.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Search Bar */}
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                setIsLoadingSuggestions(true);
                                                refreshChannelStats(true, searchTerm);
                                                setTimeout(() => setIsLoadingSuggestions(false), 2000);
                                            }
                                        }}
                                        placeholder="Buscar tema viral... (ex: 'curiosidades', 'tecnologia')"
                                        className="w-full bg-surface-800 text-sm text-slate-200 rounded-lg pl-10 pr-4 py-2.5 border border-surface-700 focus:border-purple-500 outline-none transition-all"
                                    />
                                </div>
                                <button
                                    onClick={() => {
                                        setIsLoadingSuggestions(true);
                                        refreshChannelStats(true);
                                        setTimeout(() => setIsLoadingSuggestions(false), 2000);
                                    }}
                                    className="text-sm text-slate-400 hover:text-purple-400 transition-colors p-2.5 rounded-lg hover:bg-surface-800 border border-surface-700 hover:border-purple-500/50"
                                    title="Atualizar sugestões"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Suggestions Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                                {isLoadingSuggestions ? (
                                    <>
                                        {[1, 2, 3, 4].map(i => (
                                            <Skeleton key={i} className="h-32 w-full rounded-lg" />
                                        ))}
                                    </>
                                ) : suggestions && suggestions.length > 0 ? (
                                    suggestions.map((sug, idx) => {
                                        const videoId = typeof sug.id === 'object' ? sug.id.videoId : (sug.videoId || sug.id);
                                        const videoUrl = `https://youtube.com/watch?v=${videoId}`;
                                        const formatNumber = (num) => {
                                            if (!num) return '0';
                                            if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
                                            if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
                                            return num.toString();
                                        };

                                        return (
                                            <div
                                                key={idx}
                                                className="group bg-surface-800/50 hover:bg-surface-800 border border-surface-700/50 hover:border-purple-500/30 rounded-lg p-4 transition-all cursor-grab active:cursor-grabbing"
                                                draggable="true"
                                                onDragStart={(e) => {
                                                    e.dataTransfer.setData("text/plain", videoUrl);
                                                    e.dataTransfer.setData("text/uri-list", videoUrl);
                                                    e.currentTarget.classList.add('opacity-50');
                                                }}
                                                onDragEnd={(e) => {
                                                    e.currentTarget.classList.remove('opacity-50');
                                                }}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-bold text-slate-200 mb-1.5 line-clamp-2 group-hover:text-purple-300 transition-colors">
                                                            {sug.title}
                                                        </h4>
                                                        <p className="text-xs text-slate-400 line-clamp-2 mb-2">
                                                            {sug.description || sug.channelTitle}
                                                        </p>
                                                        <div className="flex items-center gap-3">
                                                            {sug.viewCount && (
                                                                <span className="flex items-center gap-1 text-xs text-slate-400 bg-surface-900/50 px-2 py-0.5 rounded">
                                                                    <Eye className="w-3 h-3 text-purple-400" />
                                                                    {formatNumber(sug.viewCount)}
                                                                </span>
                                                            )}
                                                            {sug.likeCount && (
                                                                <span className="flex items-center gap-1 text-xs text-slate-400 bg-surface-900/50 px-2 py-0.5 rounded">
                                                                    <ThumbsUp className="w-3 h-3 text-green-400" />
                                                                    {formatNumber(sug.likeCount)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <a
                                                        href={videoUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-slate-500 hover:text-purple-400 transition-colors p-2 hover:bg-surface-700 rounded-lg"
                                                        onClick={(e) => e.stopPropagation()}
                                                        title="Abrir no YouTube"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="col-span-2 text-center py-12">
                                        <Sparkles className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                                        <p className="text-sm text-slate-400 font-medium">Nenhuma sugestão disponível</p>
                                        <p className="text-xs text-slate-500 mt-1">Conecte sua conta do YouTube ou busque por um tema</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Upload Settings */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Visibilidade</label>
                                    <select
                                        className="w-full bg-surface-800 border border-surface-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-primary"
                                        value={privacyStatus}
                                        onChange={(e) => setPrivacyStatus(e.target.value)}
                                    >
                                        <option value="private">Privado (Padrão)</option>
                                        <option value="public">Público</option>
                                        <option value="unlisted">Não Listado</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Agendar Publicação (Opcional)</label>
                                    <input
                                        type="datetime-local"
                                        className="w-full bg-surface-800 border border-surface-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-primary"
                                        value={publishAt}
                                        onChange={(e) => setPublishAt(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="bg-surface-900/50 rounded-xl p-8 border border-dashed border-surface-700/50 hover:border-primary/50 hover:bg-surface-800/50 transition-all duration-300 group cursor-pointer relative overflow-hidden text-center"
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const file = e.dataTransfer.files?.[0];
                                    if (file) {
                                        addToUploadQueue({
                                            title: file.name.replace(/\.[^/.]+$/, ""),
                                            source: "upload",
                                            platform: "YouTube Shorts",
                                            file: file,
                                            privacyStatus: privacyStatus,
                                            publishAt: publishAt ? new Date(publishAt).toISOString() : undefined,
                                            scheduledAt: publishAt ? new Date(publishAt).toISOString() : undefined
                                        });
                                        alert("Vídeo adicionado à fila de upload! 🚀");
                                    }
                                }}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="video/*"
                                    onChange={handleFileSelect}
                                />
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="flex flex-col items-center gap-4 relative z-10">
                                    <div className="w-16 h-16 rounded-2xl bg-surface-800 shadow-lg shadow-black/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 border border-surface-700">
                                        <Upload className="w-8 h-8 text-primary group-hover:text-primary-light transition-colors" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-bold text-slate-200 group-hover:text-white transition-colors">
                                            Upload de Arquivo
                                        </h3>
                                        <p className="text-sm text-slate-400 max-w-xs mx-auto">
                                            Arraste um arquivo de vídeo ou clique para selecionar.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent YouTube Videos */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h3 className="font-bold text-slate-200 text-lg flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        Vídeos Publicados
                    </h3>
                    <div className="flex bg-surface-800/50 p-1 rounded-lg border border-surface-700/50 backdrop-blur-sm">
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-1.5 rounded-md transition-all ${viewMode === "list" ? "bg-surface-700 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-surface-700 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {(!state.recentUploads || state.recentUploads.length === 0) ? (
                    <div className="glass-panel rounded-xl p-8 text-center space-y-3">
                        <div className="w-12 h-12 bg-surface-800 rounded-full flex items-center justify-center mx-auto text-slate-600">
                            <LayoutGrid className="w-6 h-6" />
                        </div>
                        <p className="text-slate-400 font-medium">Nenhum vídeo encontrado</p>
                        <p className="text-xs text-slate-500">Conecte sua conta do YouTube para ver seus uploads recentes.</p>
                    </div>
                ) : (
                    <div className={`${viewMode === "grid"
                        ? "grid grid-cols-1 sm:grid-cols-2 gap-3"
                        : "space-y-2"} max-h-[600px] overflow-y-auto custom-scrollbar pr-2`
                    }>
                        {state.recentUploads.map((video, index) => (
                            <div
                                key={video.id}
                                className={`group relative overflow-hidden transition-all duration-300 ${viewMode === "grid"
                                    ? "glass-card rounded-xl p-0 flex flex-col"
                                    : "glass-card rounded-lg p-2 flex items-center gap-4 hover:translate-x-1"
                                    }`}
                            >
                                {/* Thumbnail */}
                                <div className={`relative overflow-hidden bg-surface-900 ${viewMode === "grid" ? "w-full aspect-video rounded-t-xl" : "w-32 h-20 rounded-md flex-shrink-0"
                                    }`}>
                                    <img
                                        src={video.thumbnail}
                                        alt={video.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="90"%3E%3Crect fill="%231e293b" width="120" height="90"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23475569" font-family="sans-serif" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E';
                                        }}
                                    />
                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-surface-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    {/* Play Button Overlay */}
                                    <a
                                        href={video.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                                    >
                                        <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-primary hover:border-primary hover:scale-110 transition-all">
                                            <ExternalLink className="w-4 h-4 text-white" />
                                        </div>
                                    </a>
                                </div>

                                {/* Content */}
                                <div className={`flex-1 min-w-0 ${viewMode === "grid" ? "p-3" : ""}`}>
                                    <h4 className={`font-medium text-slate-200 leading-tight line-clamp-2 group-hover:text-primary-light transition-colors ${viewMode === "grid" ? "text-sm mb-2" : "text-sm mb-1"
                                        }`}>
                                        {video.title}
                                    </h4>

                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center gap-1 bg-surface-900/50 px-1.5 py-0.5 rounded">
                                                <Eye className="w-3 h-3 text-primary" />
                                                {video.viewCount?.toLocaleString() || 0}
                                            </span>
                                            <span>
                                                {(() => {
                                                    const date = new Date(video.publishedAt);
                                                    const localDate = new Date(date.getTime() - (4 * 60 * 60 * 1000));
                                                    return localDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
                                                })()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
