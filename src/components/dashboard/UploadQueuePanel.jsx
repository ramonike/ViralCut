import React, { useState } from 'react';
import { Button } from '../ui/button';
import { UploadCloud, FileCheck, Trash2, Clock, Calendar, CheckCircle2 } from 'lucide-react';

export function UploadQueuePanel({ uploadQueue, markQueueStatus, removeQueueItem }) {
    const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'posted'

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toLocaleDateString('en-CA');

    // Separate videos into categories
    const categorizeVideos = () => {
        const posted = [];
        const todayVideos = [];
        const upcoming = [];

        uploadQueue.forEach(item => {
            const isUploaded = item.status === 'done' || item.status === 'success';
            const hasFuturePublish = item.publishAt && new Date(item.publishAt) > new Date();

            // If uploaded BUT has a future publish date, treat as UPCOMING (Scheduled)
            if (isUploaded && !hasFuturePublish) {
                posted.push(item);
            } else if (item.scheduledAt || item.publishAt) {
                const itemDate = new Date(item.scheduledAt || item.publishAt);
                itemDate.setHours(0, 0, 0, 0);
                const itemDateStr = itemDate.toLocaleDateString('en-CA');

                if (itemDateStr === todayStr) {
                    todayVideos.push(item);
                } else if (itemDate > today) {
                    upcoming.push(item);
                }
            } else {
                todayVideos.push(item);
            }
        });

        return { posted, todayVideos, upcoming };
    };

    const { posted, todayVideos, upcoming } = categorizeVideos();

    // Group upcoming by date (next 7 days)
    const groupUpcomingByDate = () => {
        const grouped = {};
        const next7Days = [];

        // Generate next 7 days
        for (let i = 1; i <= 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const dateStr = date.toLocaleDateString('en-CA');
            next7Days.push(dateStr);
            grouped[dateStr] = [];
        }

        // Assign videos to dates
        upcoming.forEach(item => {
            const itemDate = new Date(item.scheduledAt || item.publishAt);
            const itemDateStr = itemDate.toLocaleDateString('en-CA');
            if (grouped[itemDateStr]) {
                grouped[itemDateStr].push(item);
            }
        });

        return { grouped, next7Days };
    };

    const { grouped: upcomingGrouped, next7Days } = groupUpcomingByDate();

    const renderVideoItem = (q, showDate = false) => (
        <div key={q.id} className="glass-card rounded-lg p-3 flex items-center justify-between group border border-surface-700/50 hover:border-surface-600 transition-all">
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-200 text-sm truncate" title={q.title}>{q.title}</p>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{q.platform}</span>
                    {showDate && (q.scheduledAt || q.publishAt) && (
                        <span className="text-[10px] text-purple-400 flex items-center gap-0.5 bg-purple-500/10 px-1.5 py-0.5 rounded">
                            <Clock className="w-3 h-3" />
                            {new Date(q.scheduledAt || q.publishAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    )}
                </div>
                {q.status === "uploading" && (
                    <span className="text-xs text-primary animate-pulse flex items-center gap-1 mt-1">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" /> Enviando...
                    </span>
                )}
                {(q.status === "done" || q.status === "success") && (
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
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                {q.status !== "done" && q.status !== "success" && (
                    <>
                        <Button
                            size="icon"
                            className="h-7 w-7 hover:bg-surface-700"
                            onClick={() => markQueueStatus(q.id, 'uploading')}
                            variant="ghost"
                            disabled={q.status === "uploading"}
                        >
                            <UploadCloud className="w-4 h-4 text-primary" />
                        </Button>
                        <Button
                            size="icon"
                            className="h-7 w-7 hover:bg-surface-700"
                            onClick={() => markQueueStatus(q.id, 'done')}
                            variant="ghost"
                            disabled={q.status === "uploading"}
                        >
                            <FileCheck className="w-4 h-4 text-green-400" />
                        </Button>
                    </>
                )}
                <Button
                    size="icon"
                    className="h-7 w-7 hover:bg-surface-700"
                    onClick={() => removeQueueItem(q.id)}
                    variant="ghost"
                >
                    <Trash2 className="w-4 h-4 text-red-400" />
                </Button>
            </div>
        </div>
    );

    return (
        <div className="glass-panel rounded-xl overflow-hidden">
            <div className="p-4 border-b border-surface-700/50 flex items-center justify-between">
                <h3 className="font-bold text-primary-light text-lg flex items-center gap-2">
                    <UploadCloud className="w-5 h-5" /> Fila de Uploads
                </h3>
                <span className="text-xs font-medium bg-surface-800 px-2 py-1 rounded-full text-slate-400">
                    {uploadQueue.length} itens
                </span>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-surface-700/50">
                <button
                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'upcoming'
                        ? 'bg-surface-800 text-primary border-b-2 border-primary'
                        : 'text-slate-500 hover:text-slate-300 hover:bg-surface-800/50'
                        }`}
                    onClick={() => setActiveTab('upcoming')}
                >
                    <Calendar className="w-3 h-3 inline mr-1" />
                    Próximos
                </button>
                <button
                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'posted'
                        ? 'bg-surface-800 text-green-400 border-b-2 border-green-400'
                        : 'text-slate-500 hover:text-slate-300 hover:bg-surface-800/50'
                        }`}
                    onClick={() => setActiveTab('posted')}
                >
                    <CheckCircle2 className="w-3 h-3 inline mr-1" />
                    Postados ({posted.length})
                </button>
            </div>

            <div className="p-4">
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                    {activeTab === 'upcoming' ? (
                        <>
                            {/* Today Section */}
                            {todayVideos.length > 0 && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 sticky top-0 bg-surface-900/95 backdrop-blur-sm py-2 z-10">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                                        <h4 className="text-xs font-bold text-primary uppercase tracking-wider">
                                            Hoje
                                        </h4>
                                        <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent"></div>
                                    </div>
                                    {todayVideos.map(q => renderVideoItem(q, true))}
                                </div>
                            )}

                            {/* Next 7 Days */}
                            {next7Days.map((dateStr, idx) => {
                                const videos = upcomingGrouped[dateStr];
                                if (videos.length === 0) return null;

                                const date = new Date(dateStr + 'T12:00:00');
                                const isTomorrow = idx === 0;
                                const dayLabel = isTomorrow
                                    ? 'Amanhã'
                                    : date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' });

                                return (
                                    <div key={dateStr} className="space-y-2">
                                        <div className="flex items-center gap-2 sticky top-0 bg-surface-900/95 backdrop-blur-sm py-2 z-10">
                                            <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                                            <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider capitalize">
                                                {dayLabel}
                                            </h4>
                                            <div className="flex-1 h-px bg-gradient-to-r from-purple-400/50 to-transparent"></div>
                                            <span className="text-[10px] text-slate-500 font-medium">
                                                {videos.length} vídeo{videos.length !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                        {videos.map(q => renderVideoItem(q, true))}
                                    </div>
                                );
                            })}

                            {todayVideos.length === 0 && upcoming.length === 0 && (
                                <div className="text-center py-12 text-slate-500 border-2 border-dashed border-surface-700/50 rounded-xl bg-surface-800/30">
                                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                    <p className="text-sm font-medium">Nenhum vídeo agendado</p>
                                    <p className="text-xs mt-1 opacity-70">Agende uploads pelo calendário</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            {/* Posted Videos */}
                            {posted.length > 0 ? (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                        <h4 className="text-xs font-bold text-green-400 uppercase tracking-wider">
                                            Vídeos Publicados
                                        </h4>
                                        <div className="flex-1 h-px bg-gradient-to-r from-green-400/50 to-transparent"></div>
                                    </div>
                                    {posted.map(q => renderVideoItem(q, false))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-slate-500 border-2 border-dashed border-surface-700/50 rounded-xl bg-surface-800/30">
                                    <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                    <p className="text-sm font-medium">Nenhum vídeo postado ainda</p>
                                    <p className="text-xs mt-1 opacity-70">Seus vídeos publicados aparecerão aqui</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
