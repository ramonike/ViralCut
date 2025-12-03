import React, { useState } from 'react';
import { Sparkles, Search, RefreshCw, ChevronDown, ChevronUp, ExternalLink, Eye, ThumbsUp } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

export function SuggestionsPanel({ suggestions, refreshChannelStats, isLoading }) {
    const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const formatNumber = (num) => {
        if (!num) return '0';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    return (
        <div className="glass-panel rounded-xl overflow-hidden transition-all duration-500">
            <div
                className="p-4 border-b border-surface-700/50 flex items-center justify-between bg-gradient-to-r from-purple-900/20 to-transparent cursor-pointer hover:bg-surface-800/50 transition-colors"
                onClick={() => setIsSuggestionsOpen(!isSuggestionsOpen)}
            >
                <h3 className="text-slate-100 font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    Sugestões Virais
                </h3>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/20">
                        {suggestions?.length || 0}
                    </span>
                    {isSuggestionsOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
            </div>

            {isSuggestionsOpen && (
                <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-1 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="relative flex-1">
                            <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        refreshChannelStats(true, searchTerm);
                                    }
                                }}
                                placeholder="Buscar tema..."
                                className="w-full bg-surface-800 text-xs text-slate-200 rounded-lg pl-7 pr-2 py-1.5 border border-surface-700 focus:border-purple-500 outline-none transition-all"
                            />
                        </div>
                        <button
                            onClick={() => refreshChannelStats(true)}
                            className="text-xs text-slate-400 hover:text-purple-400 transition-colors p-1.5 rounded hover:bg-surface-800 border border-transparent hover:border-surface-700"
                            title="Atualizar sugestões"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="space-y-2">
                            {[1, 2, 3].map(i => (
                                <Skeleton key={i} className="h-16 w-full rounded-lg" />
                            ))}
                        </div>
                    ) : suggestions && suggestions.length > 0 ? (
                        suggestions.map((sug, idx) => (
                            <div
                                key={idx}
                                className="group bg-surface-800/50 hover:bg-surface-800 border border-surface-700/50 hover:border-purple-500/30 rounded-lg p-3 transition-all cursor-pointer"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-slate-200 mb-1 line-clamp-1">
                                            {sug.title}
                                        </h4>
                                        <p className="text-[10px] text-slate-400 line-clamp-2">
                                            {sug.description || sug.channelTitle}
                                        </p>
                                        <div className="flex items-center gap-3 mt-2">
                                            {sug.viewCount && (
                                                <span className="flex items-center gap-1 text-[10px] text-slate-400">
                                                    <Eye className="w-3 h-3 text-purple-400" />
                                                    {formatNumber(sug.viewCount)}
                                                </span>
                                            )}
                                            {sug.likeCount && (
                                                <span className="flex items-center gap-1 text-[10px] text-slate-400">
                                                    <ThumbsUp className="w-3 h-3 text-green-400" />
                                                    {formatNumber(sug.likeCount)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {/* Link to Video - Always Visible */}
                                    <a
                                        href={`https://youtube.com/watch?v=${typeof sug.id === 'object' ? sug.id.videoId : (sug.videoId || sug.id)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-slate-500 hover:text-purple-400 transition-colors p-1 hover:bg-surface-700 rounded"
                                        onClick={(e) => e.stopPropagation()}
                                        title="Abrir no YouTube"
                                        draggable="true"
                                        onDragStart={(e) => {
                                            e.dataTransfer.setData("text/plain", `https://youtube.com/watch?v=${typeof sug.id === 'object' ? sug.id.videoId : (sug.videoId || sug.id)}`);
                                        }}
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-6 text-slate-500">
                            <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            <p className="text-xs">Nenhuma sugestão disponível</p>
                            <p className="text-[10px] mt-1 opacity-70">Conecte sua conta do YouTube</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
