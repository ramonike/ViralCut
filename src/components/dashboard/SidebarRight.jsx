import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { UploadCloud, FileCheck, Trash2, Calendar as CalendarIcon, BarChart2, CheckCircle2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export function SidebarRight({ state, actions }) {
    const { uploadQueue, analytics, history = {} } = state; // Default history to empty obj
    const { markQueueStatus, removeQueueItem } = actions;
    const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-CA'));

    const analyticsData = analytics.views24h.length
        ? analytics.views24h
        : [
            { name: "Seg", views: 120 },
            { name: "Ter", views: 340 },
            { name: "Qua", views: 560 },
            { name: "Qui", views: 890 },
            { name: "Sex", views: 420 },
            { name: "Sáb", views: 600 },
            { name: "Dom", views: 750 },
        ];

    // Calendar Logic
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-indexed
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const getDayStatus = (day) => {
        // Construct date string YYYY-MM-DD
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayData = history[dateStr];

        if (dateStr === new Date().toLocaleDateString('en-CA')) return "today";
        if (dayData && dayData.completedItems && dayData.completedItems.length > 0) return "done";
        return "empty";
    };

    const selectedDayData = history[selectedDate];
    const selectedDateObj = new Date(selectedDate + "T12:00:00"); // Fix timezone issue for display

    return (
        <aside className="md:col-span-3 flex flex-col gap-6">
            {/* Upload Queue */}
            <Card className="bg-viral-800 border-viral-700 shadow-lg shadow-viral-900/50">
                <CardHeader className="pb-2 border-b border-viral-700/50">
                    <h3 className="font-bold text-viral-neon text-lg flex items-center gap-2">
                        <UploadCloud className="w-5 h-5" /> Fila de Uploads
                    </h3>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                        {uploadQueue.length === 0 && (
                            <div className="text-center py-8 text-slate-500 border-2 border-dashed border-viral-700 rounded-xl">
                                <p className="text-sm">Fila vazia.</p>
                                <p className="text-xs mt-1">Adicione vídeos para começar.</p>
                            </div>
                        )}
                        {uploadQueue.map((q) => (
                            <div key={q.id} className="bg-viral-900/50 p-3 rounded-xl border border-viral-700 flex items-center justify-between group hover:border-viral-500 transition-colors">
                                <div className="overflow-hidden">
                                    <p className="font-semibold text-slate-200 text-sm truncate w-32 md:w-40" title={q.title}>{q.title}</p>
                                    <p className="text-[10px] text-viral-400 uppercase tracking-wider">{q.platform}</p>
                                    {q.status === "uploading" && (
                                        <span className="text-xs text-viral-neon animate-pulse flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-viral-neon rounded-full animate-bounce" /> Enviando...
                                        </span>
                                    )}
                                    {q.status === "done" && (
                                        <span className="text-xs text-green-400 flex items-center gap-1">
                                            ✓ Concluído
                                        </span>
                                    )}
                                    {q.status === "error" && (
                                        <span className="text-xs text-red-400 flex items-center gap-1">
                                            ⚠ Erro
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="icon" className="h-7 w-7" onClick={() => markQueueStatus(q.id, 'uploading')} variant="ghost" disabled={q.status === "uploading" || q.status === "done"}>
                                        <UploadCloud className="w-4 h-4 text-viral-neon" />
                                    </Button>
                                    <Button size="icon" className="h-7 w-7" onClick={() => markQueueStatus(q.id, 'done')} variant="ghost" disabled={q.status === "uploading" || q.status === "done"}>
                                        <FileCheck className="w-4 h-4 text-green-400" />
                                    </Button>
                                    <Button size="icon" className="h-7 w-7" onClick={() => removeQueueItem(q.id)} variant="ghost">
                                        <Trash2 className="w-4 h-4 text-red-400" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Recent Uploads (Channel) */}
            <Card className="bg-viral-800 border-viral-700 shadow-lg shadow-viral-900/50">
                <CardHeader className="pb-2 border-b border-viral-700/50">
                    <h3 className="font-bold text-viral-neon text-lg flex items-center gap-2">
                        <FileCheck className="w-5 h-5" /> Últimos do Canal
                    </h3>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                        {(!state.recentUploads || state.recentUploads.length === 0) && (
                            <div className="text-center py-4 text-slate-500">
                                <p className="text-xs">Nenhum vídeo encontrado.</p>
                            </div>
                        )}
                        {state.recentUploads && state.recentUploads.map((video) => (
                            <div key={video.id} className="bg-viral-900/50 p-2 rounded-xl border border-viral-700 flex items-center gap-3 group hover:border-viral-500 transition-colors">
                                <div className="w-16 h-9 rounded overflow-hidden flex-shrink-0 bg-black">
                                    <img src={video.thumbnails?.default?.url} alt={video.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="overflow-hidden flex-1">
                                    <p className="font-semibold text-slate-200 text-xs truncate" title={video.title}>{video.title}</p>
                                    <div className="flex justify-between items-center mt-1">
                                        <p className="text-[10px] text-viral-400">{new Date(video.publishedAt).toLocaleDateString()}</p>
                                        <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-400 hover:underline">Ver</a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Calendar */}
            <Card className="bg-viral-800 border-viral-700 shadow-lg">
                <CardHeader className="pb-2 border-b border-viral-700/50">
                    <h3 className="font-bold text-white text-lg flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-viral-pink" /> Calendário
                    </h3>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="text-xs text-slate-400 mb-3 flex justify-between items-center">
                        <span>{today.toLocaleString('default', { month: 'long' })} {currentYear}</span>
                        <div className="flex gap-2">
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Ativo</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-viral-neon"></div> Hoje</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-1 mb-4">
                        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
                            <div key={d} className="text-center text-[10px] text-slate-500 font-bold mb-1">{d}</div>
                        ))}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const status = getDayStatus(day);
                            const isSelected = selectedDate === dateStr;

                            let bgClass = "bg-viral-900/30 text-slate-500 hover:bg-viral-700";
                            let borderClass = "border-transparent";

                            if (status === "today") {
                                bgClass = "bg-viral-neon text-viral-900 font-bold hover:bg-viral-neon/80";
                                borderClass = "border-viral-neon";
                            } else if (status === "done") {
                                bgClass = "bg-green-500/20 text-green-400 hover:bg-green-500/30";
                                borderClass = "border-green-500/50";
                            }

                            if (isSelected) {
                                borderClass = "border-white ring-1 ring-white";
                            }

                            return (
                                <button
                                    key={i}
                                    onClick={() => setSelectedDate(dateStr)}
                                    className={`aspect-square flex items-center justify-center rounded-md text-xs border ${bgClass} ${borderClass} transition-all hover:scale-105`}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>

                    {/* Day Details */}
                    <div className="bg-viral-900/50 rounded-lg p-3 border border-viral-700/50 space-y-4">
                        <div>
                            <p className="text-xs text-viral-400 font-bold mb-2 uppercase tracking-wider flex justify-between">
                                <span>Resumo: {selectedDateObj.toLocaleDateString('pt-BR')}</span>
                            </p>

                            {/* Checklists */}
                            {selectedDayData && selectedDayData.completedItems && selectedDayData.completedItems.length > 0 ? (
                                <div className="space-y-1 mb-3">
                                    <p className="text-[10px] text-slate-500 font-semibold uppercase">Checklists</p>
                                    {selectedDayData.completedItems.map((itemId, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                                            <span>{itemId}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-slate-500 italic mb-3">Nenhum checklist completado.</p>
                            )}

                            {/* Uploaded Videos */}
                            {selectedDayData && selectedDayData.uploadedVideos && selectedDayData.uploadedVideos.length > 0 ? (
                                <div className="space-y-1">
                                    <p className="text-[10px] text-slate-500 font-semibold uppercase">Vídeos Publicados ({selectedDayData.uploadedVideos.length})</p>
                                    {selectedDayData.uploadedVideos.map((video, idx) => (
                                        <div key={idx} className="flex items-start justify-between gap-2 text-xs text-slate-300 bg-viral-900/80 p-2 rounded border border-viral-800 group">
                                            <div className="flex gap-2 overflow-hidden">
                                                <span className="font-bold text-viral-neon min-w-[15px]">{idx + 1}.</span>
                                                <div className="overflow-hidden">
                                                    <p className="truncate font-medium text-white" title={video.title}>{video.title}</p>
                                                    <div className="flex gap-2 text-[10px] text-slate-400">
                                                        <span>{video.platform}</span>
                                                        {video.url && (
                                                            <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Ver Link</a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => actions.removeHistoryItem(selectedDate, video.id)}
                                                className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all"
                                                title="Remover do histórico"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-slate-500 italic">Nenhum vídeo publicado.</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Analytics */}
            <Card className="bg-viral-800 border-viral-700">
                <CardHeader className="pb-2">
                    <h3 className="font-bold text-white text-lg flex items-center gap-2">
                        <BarChart2 className="w-5 h-5 text-blue-400" /> Performance
                    </h3>
                </CardHeader>
                <CardContent>
                    <div style={{ height: 160 }}>
                        <ResponsiveContainer>
                            <LineChart data={analyticsData}>
                                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a0b2e', borderColor: '#2d1b4e', color: '#f8fafc' }}
                                    itemStyle={{ color: '#00ff9d' }}
                                />
                                <Line type="monotone" dataKey="views" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#00ff9d', strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: '#fff' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </aside>
    );
}
