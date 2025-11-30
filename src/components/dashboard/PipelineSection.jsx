import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Link as LinkIcon, Eye, ExternalLink, LayoutGrid, List, Upload } from "lucide-react";

export function PipelineSection({ state, actions }) {
    const { addToUploadQueue } = actions;
    const { settings, pipeline } = state;
    const [viewMode, setViewMode] = useState("list"); // 'list' | 'grid'
    const [activeCreationTab, setActiveCreationTab] = useState("vizard"); // 'vizard' | 'upload'
    const fileInputRef = useRef(null);

    function handleFileSelect(e) {
        const file = e.target.files?.[0];
        if (file) {
            addToUploadQueue({
                title: file.name.replace(/\.[^/.]+$/, ""),
                source: "upload",
                platform: "YouTube Shorts",
                file: file
            });
            e.target.value = "";
            alert("Vídeo adicionado à fila de upload! 🚀");
        }
    }

    return (
        <section id="pipeline-section" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Unified Creation Area */}
            <div className="glass-panel rounded-2xl overflow-hidden">
                <div className="flex border-b border-surface-700/50">
                    <button
                        onClick={() => setActiveCreationTab("vizard")}
                        className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeCreationTab === "vizard"
                            ? "bg-surface-800 text-white border-b-2 border-primary"
                            : "text-slate-400 hover:text-white hover:bg-surface-800/50"
                            }`}
                    >
                        <LinkIcon className="w-4 h-4" /> Novo Projeto Vizard
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
                    {activeCreationTab === "vizard" ? (
                        <div className="bg-surface-900/50 rounded-xl p-8 border border-dashed border-surface-700/50 hover:border-primary/50 hover:bg-surface-800/50 transition-all duration-300 group cursor-pointer relative overflow-hidden text-center"
                            onClick={() => window.open("https://vizard.ai/workspace", "_blank")}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={async (e) => {
                                e.preventDefault();
                                const text = e.dataTransfer.getData("text/uri-list") || e.dataTransfer.getData("text/plain");
                                if (text) {
                                    try {
                                        await navigator.clipboard.writeText(text);
                                        alert("LINK COPIADO! 📋\nCole no Vizard.ai (Ctrl+V).");
                                        window.open("https://vizard.ai/workspace", "_blank");
                                    } catch (err) {
                                        prompt("Copie o link:", text);
                                        window.open("https://vizard.ai/workspace", "_blank");
                                    }
                                }
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="flex flex-col items-center gap-4 relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-surface-800 shadow-lg shadow-black/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 border border-surface-700">
                                    <LinkIcon className="w-8 h-8 text-primary group-hover:text-primary-light transition-colors" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-lg font-bold text-slate-200 group-hover:text-white transition-colors">
                                        Abrir Vizard.ai
                                    </h3>
                                    <p className="text-sm text-slate-400 max-w-xs mx-auto">
                                        Arraste um link do YouTube aqui para copiar e abrir o editor.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
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
                                        file: file
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
