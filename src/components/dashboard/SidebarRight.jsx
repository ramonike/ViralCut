import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { UploadCloud, FileCheck, Trash2, Calendar as CalendarIcon, BarChart2, CheckCircle2, Sparkles, ExternalLink, RefreshCw, Eye, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer, AreaChart, Area, YAxis, CartesianGrid } from "recharts";

export function SidebarRight({ state, actions }) {
    const { uploadQueue, analytics = {}, history = {} } = state;
    const { markQueueStatus, removeQueueItem } = actions;
    const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-CA'));
    const isLoading = !state.channelStats; // Assume loading if no stats

    const getAnalyticsData = () => {
        const days = [];
        const today = new Date();
        const fetchedData = analytics?.views24h || [];

        // Create a map for quick lookup: "DD/MM" -> views
        const dataMap = {};
        fetchedData.forEach(item => {
            dataMap[item.name] = item.views;
        });

        // Generate last 7 days
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

            days.push({
                name: dateStr,
                views: dataMap[dateStr] || 0
            });
        }
        return days;
    };

    const analyticsData = getAnalyticsData();

    // Calendar Logic
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const getDayStatus = (day) => {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayData = history[dateStr];

        if (dateStr === new Date().toLocaleDateString('en-CA')) return "today";
        if (dayData && dayData.completedItems && dayData.completedItems.length > 0) return "done";
        return "empty";
    };

    const selectedDayData = history[selectedDate];
    const selectedDateObj = new Date(selectedDate + "T12:00:00");

    return (
        <aside className="md:col-span-3 flex flex-col gap-6 animate-in slide-in-from-right-4 duration-500">
            {/* Upload Queue */}
            <div className="glass-panel rounded-xl overflow-hidden">
                <div className="p-4 border-b border-surface-700/50 flex items-center justify-between">
                    <h3 className="font-bold text-primary-light text-lg flex items-center gap-2">
                        <UploadCloud className="w-5 h-5" /> Fila de Uploads
                    </h3>
                    <span className="text-xs font-medium bg-surface-800 px-2 py-1 rounded-full text-slate-400">
                        {uploadQueue.length} itens
                    </span>
                </div>
                <div className="p-4">
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                        {uploadQueue.length === 0 && (
                            <div className="text-center py-8 text-slate-500 border-2 border-dashed border-surface-700/50 rounded-xl bg-surface-800/30">
                                <p className="text-sm font-medium">Fila vazia</p>
                                <p className="text-xs mt-1 opacity-70">Adicione vídeos para começar</p>
                            </div>
                        )}
                        {uploadQueue.map((q) => (
                            <div key={q.id} className="glass-card rounded-xl p-3 flex items-center justify-between group">
                                <div className="overflow-hidden">
                                    <p className="font-semibold text-slate-200 text-sm truncate w-32 md:w-40" title={q.title}>{q.title}</p>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{q.platform}</p>
                                    {q.status === "uploading" && (
                                        <span className="text-xs text-primary animate-pulse flex items-center gap-1 mt-1">
                                            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" /> Enviando...
                                        </span>
                                    )}
                                    {q.status === "done" && (
                                        <span className="text-xs text-green-400 flex items-center gap-1 mt-1">
                                            <CheckCircle2 className="w-3 h-3" /> Concluído
                                        </span>
                                    )}
                                    {q.status === "error" && (
                                        <span className="text-xs text-red-400 flex items-center gap-1 mt-1">
                                            ⚠ Erro
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="icon" className="h-7 w-7 hover:bg-surface-700" onClick={() => markQueueStatus(q.id, 'uploading')} variant="ghost" disabled={q.status === "uploading" || q.status === "done"}>
                                        <UploadCloud className="w-4 h-4 text-primary" />
                                    </Button>
                                    <Button size="icon" className="h-7 w-7 hover:bg-surface-700" onClick={() => markQueueStatus(q.id, 'done')} variant="ghost" disabled={q.status === "uploading" || q.status === "done"}>
                                        <FileCheck className="w-4 h-4 text-green-400" />
                                    </Button>
                                    <Button size="icon" className="h-7 w-7 hover:bg-surface-700" onClick={() => removeQueueItem(q.id)} variant="ghost">
                                        <Trash2 className="w-4 h-4 text-red-400" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sugestões para Cortes */}
            <div className="glass-panel rounded-xl overflow-hidden">
                <div className="p-4 border-b border-surface-700/50 flex items-center justify-between bg-gradient-to-r from-purple-900/20 to-transparent">
                    <h3 className="text-slate-100 font-bold flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        Sugestões Virais
                    </h3>
                    <button
                        onClick={() => actions.refreshChannelStats()}
                        className="text-xs text-slate-500 hover:text-purple-400 transition-colors p-1 rounded hover:bg-surface-800"
                        title="Atualizar sugestões"
                    >
                        <RefreshCw className="w-3 h-3" />
                    </button>
                </div>

                <div className="p-4 space-y-3">
                    {isLoading ? (
                        <>
                            <Skeleton className="h-16 w-full rounded-lg" />
                            <Skeleton className="h-16 w-full rounded-lg" />
                            <Skeleton className="h-16 w-full rounded-lg" />
                        </>
                    ) : state.suggestions && state.suggestions.length > 0 ? (
                        state.suggestions.map((video) => (
                            <div
                                key={video.id}
                                className="group relative glass-card rounded-lg p-2 hover:bg-surface-800/80 cursor-grab active:cursor-grabbing transition-all duration-300 hover:translate-x-1"
                                draggable="true"
                                onDragStart={(e) => {
                                    e.dataTransfer.setData("text/plain", video.url);
                                    e.dataTransfer.setData("text/uri-list", video.url);
                                    e.dataTransfer.effectAllowed = "copy";
                                }}
                            >
                                <div className="flex gap-3 pointer-events-none">
                                    <div className="relative w-24 h-14 rounded-md overflow-hidden flex-shrink-0 bg-surface-900 shadow-md">
                                        <img
                                            src={video.thumbnails?.medium?.url}
                                            alt={video.title}
                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    </div>
                                    <div className="flex-1 min-w-0 py-0.5">
                                        <h4 className="text-slate-200 text-xs font-medium leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">
                                            {video.title}
                                        </h4>
                                        <p className="text-slate-500 text-[10px] mt-1 truncate font-medium">
                                            {video.channelTitle}
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href={video.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px] rounded-lg z-10"
                                >
                                    <ExternalLink className="w-5 h-5 text-white drop-shadow-lg" />
                                </a>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-6 text-slate-500 text-xs">
                            <p>Nenhuma sugestão encontrada.</p>
                            <button
                                onClick={() => actions.refreshChannelStats()}
                                className="mt-2 text-purple-400 hover:text-purple-300 underline"
                            >
                                Tentar novamente
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Calendar */}
            <div className="glass-panel rounded-xl overflow-hidden">
                <div className="p-4 border-b border-surface-700/50">
                    <h3 className="font-bold text-white text-lg flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-primary" /> Calendário
                    </h3>
                </div>
                <div className="p-4">
                    <div className="text-xs text-slate-400 mb-4 flex justify-between items-center font-medium uppercase tracking-wider">
                        <span>{today.toLocaleString('default', { month: 'long' })} {currentYear}</span>
                        <div className="flex gap-2">
                            <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Postado</span>
                            <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-primary"></div> Hoje</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-2 mb-4">
                        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
                            <div key={i} className="text-center text-[10px] text-slate-600 font-black">{day}</div>
                        ))}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const status = getDayStatus(day);
                            const isSelected = selectedDate === dateStr;

                            let bgClass = "bg-surface-800/50 text-slate-500 hover:bg-surface-700";
                            let borderClass = "border-transparent";

                            if (status === "today") {
                                bgClass = "bg-primary text-white font-bold shadow-lg shadow-primary/30";
                            } else if (status === "done") {
                                bgClass = "bg-green-500/20 text-green-400 border border-green-500/30";
                            }

                            if (isSelected) {
                                borderClass = "ring-2 ring-white ring-offset-2 ring-offset-surface-900";
                            }

                            return (
                                <button
                                    key={i}
                                    onClick={() => setSelectedDate(dateStr)}
                                    className={`aspect-square flex items-center justify-center rounded-lg text-xs transition-all duration-300 hover:scale-110 ${bgClass} ${borderClass}`}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>

                    {/* Day Details */}
                    <div className="bg-surface-800/50 rounded-xl p-4 border border-surface-700/50">
                        <p className="text-xs text-slate-400 font-bold mb-3 uppercase tracking-wider flex justify-between border-b border-surface-700/50 pb-2">
                            <span>{selectedDateObj.toLocaleDateString('pt-BR')}</span>
                        </p>

                        {selectedDayData && selectedDayData.completedItems && selectedDayData.completedItems.length > 0 ? (
                            <div className="space-y-4">
                                {/* Video Summary */}
                                <div className="flex items-center justify-between bg-surface-800 p-3 rounded-lg border border-surface-700">
                                    <div>
                                        <p className="text-2xl font-black text-white">
                                            {selectedDayData.completedItems.filter(item => item.type === 'youtube_video').length}
                                        </p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                            Vídeos Publicados
                                        </p>
                                    </div>
                                    <div className="bg-primary/20 p-2 rounded-full">
                                        <CheckCircle2 className="w-6 h-6 text-primary" />
                                    </div>
                                </div>

                                {/* Video List */}
                                <div className="space-y-1">
                                    {selectedDayData.completedItems
                                        .filter(item => item.type === 'youtube_video')
                                        .map((video) => (
                                            <div key={video.id} className="flex items-center justify-between text-xs py-1 px-2 hover:bg-surface-800 rounded transition-colors group">
                                                <span className="text-slate-300 truncate flex-1 mr-2" title={video.title}>
                                                    {video.title}
                                                </span>
                                                <a
                                                    href={video.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </div>
                                        ))
                                    }
                                </div>

                                {/* Checklist Summary */}
                                {selectedDayData.completedItems.some(item => item.type === 'checklist_item') && (
                                    <>
                                        <div className="border-t border-surface-700/50 my-2" />
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">
                                            Tarefas Concluídas
                                        </p>
                                        <div className="space-y-1">
                                            {selectedDayData.completedItems
                                                .filter(item => item.type === 'checklist_item')
                                                .map((item) => (
                                                    <div key={item.id} className="flex items-center gap-2 text-xs py-1 px-2 bg-surface-800/50 rounded border border-surface-700/50">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                        <span className="text-slate-300 truncate" title={item.title}>
                                                            {item.title}
                                                        </span>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-xs text-slate-600 italic">Nada postado neste dia.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Analytics */}
            <div className="glass-panel rounded-xl overflow-hidden">
                <div className="p-4 border-b border-surface-700/50 flex items-center justify-between">
                    <h3 className="font-bold text-white text-lg flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-success" /> Performance
                    </h3>
                    <span className="text-[10px] font-bold bg-success/10 text-success px-2 py-1 rounded border border-success/20">
                        +12.5%
                    </span>
                </div>
                <div className="p-4">
                    <div style={{ height: 180 }}>
                        <ResponsiveContainer>
                            <AreaChart data={analyticsData}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#64748b"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#0f172a',
                                        borderColor: '#334155',
                                        color: '#f8fafc',
                                        borderRadius: '8px',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                                    }}
                                    itemStyle={{ color: '#3b82f6' }}
                                    cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="views"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorViews)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </aside>
    );
}
