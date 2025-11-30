import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { UploadCloud, FileCheck, Trash2, Calendar as CalendarIcon, CheckCircle2, Sparkles, ExternalLink, RefreshCw, TrendingUp, Search, Clock, X, Plus } from "lucide-react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// Simple Modal Component for Scheduling
const ScheduleModal = ({ isOpen, onClose, date, onSchedule }) => {
    const [time, setTime] = useState("12:00");
    const [title, setTitle] = useState("");
    const [platform, setPlatform] = useState("YouTube Shorts");
    const [file, setFile] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = () => {
        // Combine date and time into ISO string
        const scheduledDateTime = new Date(`${date}T${time}:00`).toISOString();
        onSchedule({ title, platform, scheduledAt: scheduledDateTime, file });
        onClose();
        setTitle("");
        setTime("12:00");
        setFile(null);
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            // Auto-fill title if empty
            if (!title) {
                setTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ""));
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-surface-900 border border-surface-700 rounded-xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" /> Agendar Upload
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-slate-400 font-bold uppercase block mb-1">Data</label>
                        <div className="p-2 bg-surface-800 rounded border border-surface-700 text-slate-300 text-sm">
                            {new Date(date + "T12:00:00").toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-slate-400 font-bold uppercase block mb-1">Vídeo</label>
                        <div className="flex items-center gap-2">
                            <label className="flex-1 cursor-pointer bg-surface-800 hover:bg-surface-700 border border-surface-700 rounded-md p-2 flex items-center justify-center gap-2 text-sm text-slate-300 transition-colors">
                                <UploadCloud className="w-4 h-4" />
                                {file ? file.name : "Selecionar arquivo..."}
                                <input
                                    type="file"
                                    accept="video/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </label>
                            {file && (
                                <button
                                    onClick={() => setFile(null)}
                                    className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-md transition-colors"
                                    title="Remover arquivo"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-slate-400 font-bold uppercase block mb-1">Horário</label>
                        <Input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="bg-surface-800 border-surface-700 text-white"
                        />
                    </div>

                    <div>
                        <label className="text-xs text-slate-400 font-bold uppercase block mb-1">Título do Vídeo</label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ex: Curiosidades sobre Gatos..."
                            className="bg-surface-800 border-surface-700 text-white"
                        />
                    </div>

                    <div>
                        <label className="text-xs text-slate-400 font-bold uppercase block mb-1">Plataforma</label>
                        <select
                            value={platform}
                            onChange={(e) => setPlatform(e.target.value)}
                            className="w-full bg-surface-800 border border-surface-700 rounded-md p-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="YouTube Shorts">YouTube Shorts</option>
                            <option value="TikTok">TikTok</option>
                        </select>
                    </div>

                    <div className="pt-2 flex gap-2 justify-end">
                        <Button variant="ghost" onClick={onClose} className="text-slate-400 hover:text-white">Cancelar</Button>
                        <Button onClick={handleSubmit} className="bg-primary hover:bg-primary-dark text-white" disabled={!file && !title}>
                            Agendar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export function SidebarRight({ state, actions }) {
    const { uploadQueue, analytics = {}, history = {} } = state;
    const { markQueueStatus, removeQueueItem, addToUploadQueue } = actions;
    const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-CA'));
    const [showSearch, setShowSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeQueueTab, setActiveQueueTab] = useState('queue'); // 'queue' | 'scheduled'
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isLoading = !state.channelStats;

    // Filter queue based on tab
    const filteredQueue = uploadQueue.filter(item => {
        if (activeQueueTab === 'queue') {
            // Show items without schedule or scheduled for today/past
            if (!item.scheduledAt) return true;
            const itemDate = new Date(item.scheduledAt);
            const today = new Date();
            today.setHours(23, 59, 59, 999); // End of today
            return itemDate <= today;
        } else {
            // Show items scheduled for future (tomorrow onwards)
            if (!item.scheduledAt) return false;
            const itemDate = new Date(item.scheduledAt);
            const today = new Date();
            today.setHours(23, 59, 59, 999);
            return itemDate > today;
        }
    });

    const getAnalyticsData = () => {
        const days = [];
        const today = new Date();
        const fetchedData = analytics?.views24h || [];

        const dataMap = {};
        fetchedData.forEach(item => {
            dataMap[item.name] = item.views;
        });

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);

            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const dateStr = `${day}/${month}`;

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

    const handleDateClick = (dateStr) => {
        setSelectedDate(dateStr);
        // Open modal if date is today or future
        const clickedDate = new Date(dateStr + "T12:00:00");
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);

        if (clickedDate >= todayDate) {
            setIsModalOpen(true);
        }
    };

    const handleSchedule = (data) => {
        addToUploadQueue({
            title: data.title,
            platform: data.platform,
            scheduledAt: data.scheduledAt,
            source: "scheduled",
            file: data.file
        });
    };

    const selectedDayData = history[selectedDate];
    const selectedDateObj = new Date(selectedDate + "T12:00:00");

    return (
        <aside className="md:col-span-3 flex flex-col gap-6 animate-in slide-in-from-right-4 duration-500">
            <ScheduleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                date={selectedDate}
                onSchedule={handleSchedule}
            />

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

                {/* Tabs */}
                <div className="flex border-b border-surface-700/50">
                    <button
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${activeQueueTab === 'queue' ? 'bg-surface-800 text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-slate-300 hover:bg-surface-800/50'}`}
                        onClick={() => setActiveQueueTab('queue')}
                    >
                        Fila (Hoje)
                    </button>
                    <button
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${activeQueueTab === 'scheduled' ? 'bg-surface-800 text-purple-400 border-b-2 border-purple-400' : 'text-slate-500 hover:text-slate-300 hover:bg-surface-800/50'}`}
                        onClick={() => setActiveQueueTab('scheduled')}
                    >
                        Agendados
                    </button>
                </div>

                <div className="p-4">
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                        {filteredQueue.length === 0 && (
                            <div className="text-center py-8 text-slate-500 border-2 border-dashed border-surface-700/50 rounded-xl bg-surface-800/30">
                                <p className="text-sm font-medium">
                                    {activeQueueTab === 'queue' ? 'Fila vazia' : 'Nenhum agendamento'}
                                </p>
                                <p className="text-xs mt-1 opacity-70">
                                    {activeQueueTab === 'queue' ? 'Adicione vídeos para começar' : 'Agende vídeos pelo calendário'}
                                </p>
                            </div>
                        )}

                        {(() => {
                            // Group items by date
                            const grouped = filteredQueue.reduce((acc, item) => {
                                const dateKey = item.scheduledAt
                                    ? new Date(item.scheduledAt).toLocaleDateString('en-CA')
                                    : "today"; // Default to today/unscheduled bucket

                                if (!acc[dateKey]) acc[dateKey] = [];
                                acc[dateKey].push(item);
                                return acc;
                            }, {});

                            // Sort dates
                            const sortedDates = Object.keys(grouped).sort();

                            return sortedDates.map(dateStr => {
                                let label;
                                if (dateStr === "today") {
                                    label = "Hoje / Não Agendado";
                                } else {
                                    const dateObj = new Date(dateStr + "T12:00:00");
                                    const todayStr = new Date().toLocaleDateString('en-CA');
                                    const tomorrow = new Date();
                                    tomorrow.setDate(tomorrow.getDate() + 1);
                                    const tomorrowStr = tomorrow.toLocaleDateString('en-CA');

                                    label = dateObj.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
                                    if (dateStr === todayStr) label = "Hoje";
                                    else if (dateStr === tomorrowStr) label = "Amanhã";
                                }

                                return (
                                    <div key={dateStr} className="space-y-2">
                                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider sticky top-0 bg-surface-900/90 backdrop-blur-sm py-1 z-10 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                                            {label}
                                        </h4>
                                        {grouped[dateStr].map((q) => (
                                            <div key={q.id} className="glass-card rounded-xl p-3 flex items-center justify-between group border border-surface-700/50 hover:border-surface-600 transition-colors">
                                                <div className="overflow-hidden">
                                                    <p className="font-semibold text-slate-200 text-sm truncate w-32 md:w-40" title={q.title}>{q.title}</p>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{q.platform}</p>
                                                        {q.scheduledAt && (
                                                            <span className="text-[10px] text-purple-400 flex items-center gap-0.5 bg-purple-500/10 px-1 rounded">
                                                                <Clock className="w-3 h-3" />
                                                                {new Date(q.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        )}
                                                    </div>

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
                                                    {q.status === "ready" && q.scheduledAt && (
                                                        <span className="text-xs text-purple-400 flex items-center gap-1 mt-1">
                                                            <Clock className="w-3 h-3" /> Agendado
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
                                );
                            });
                        })()}
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
                    <div className="flex items-center gap-1">
                        {showSearch ? (
                            <input
                                autoFocus
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        actions.refreshChannelStats(true, searchTerm);
                                    }
                                }}
                                onBlur={() => {
                                    if (!searchTerm) setShowSearch(false);
                                }}
                                placeholder="Buscar..."
                                className="bg-surface-800 text-xs text-slate-200 rounded px-2 py-1 border border-surface-700 focus:border-purple-500 outline-none w-24 transition-all focus:w-32"
                            />
                        ) : (
                            <button
                                onClick={() => setShowSearch(true)}
                                className="text-xs text-slate-500 hover:text-purple-400 transition-colors p-1 rounded hover:bg-surface-800"
                                title="Buscar tema"
                            >
                                <Search className="w-3 h-3" />
                            </button>
                        )}
                        <button
                            onClick={() => actions.refreshChannelStats(true)}
                            className="text-xs text-slate-500 hover:text-purple-400 transition-colors p-1 rounded hover:bg-surface-800"
                            title="Atualizar sugestões"
                        >
                            <RefreshCw className="w-3 h-3" />
                        </button>
                    </div>
                </div>

                <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
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
                            const dayData = history[dateStr];
                            const status = getDayStatus(day);
                            const isSelected = selectedDate === dateStr;
                            const isToday = dateStr === new Date().toLocaleDateString('en-CA');
                            const hasActivity = dayData && dayData.completedItems && dayData.completedItems.length > 0;

                            let bgClass = "bg-surface-800/50 text-slate-500 hover:bg-surface-700";
                            let borderClass = "border-transparent";

                            if (isToday) {
                                bgClass = "bg-primary text-white font-bold shadow-lg shadow-primary/30";
                                if (hasActivity) {
                                    borderClass = "border-2 border-green-400"; // Green border for activity
                                }
                            } else if (hasActivity) {
                                bgClass = "bg-green-500/20 text-green-400 border border-green-500/30";
                            }

                            if (isSelected) {
                                borderClass = "ring-2 ring-white ring-offset-2 ring-offset-surface-900";
                            }

                            return (
                                <button
                                    key={i}
                                    onClick={() => handleDateClick(dateStr)}
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
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="mt-2 text-xs border-dashed border-slate-600 text-slate-400 hover:text-white hover:border-white"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    <Plus className="w-3 h-3 mr-1" /> Agendar Upload
                                </Button>
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
