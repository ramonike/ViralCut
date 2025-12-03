import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, ExternalLink, Plus, Clock, X, UploadCloud, Trash2 } from 'lucide-react';
import { VideoDetailModal } from './VideoDetailModal';

// Schedule Modal Component
const ScheduleModal = ({ isOpen, onClose, date, onSchedule }) => {
    const [time, setTime] = useState("12:00");
    const [title, setTitle] = useState("");
    const [platform, setPlatform] = useState("YouTube Shorts");
    const [file, setFile] = useState(null);
    const [privacyStatus, setPrivacyStatus] = useState("public");
    const [useYouTubeScheduling, setUseYouTubeScheduling] = useState(true);

    if (!isOpen) return null;

    const handleSubmit = () => {
        const scheduledDateTime = new Date(`${date}T${time}:00`).toISOString();
        onSchedule({
            title,
            platform,
            scheduledAt: scheduledDateTime,
            file,
            privacyStatus,
            publishAt: useYouTubeScheduling ? scheduledDateTime : null
        });
        onClose();
        setTitle("");
        setTime("12:00");
        setFile(null);
        setPrivacyStatus("public");
        setUseYouTubeScheduling(true);
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            if (!title) {
                setTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ""));
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div className="bg-surface-900 border border-surface-700 rounded-xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full bg-surface-800 border border-surface-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary [color-scheme:dark]"
                            style={{ colorScheme: 'dark' }}
                        />
                    </div>

                    <div>
                        <label className="text-xs text-slate-400 font-bold uppercase block mb-1">Título do Vídeo</label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ex: Curiosidades sobre Gatos..."
                            className="bg-surface-800 border-surface-700 text-white placeholder:text-slate-500"
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

                    {platform === "YouTube Shorts" && (
                        <>
                            <div>
                                <label className="text-xs text-slate-400 font-bold uppercase block mb-1">Visibilidade</label>
                                <select
                                    value={privacyStatus}
                                    onChange={(e) => setPrivacyStatus(e.target.value)}
                                    className="w-full bg-surface-800 border border-surface-700 rounded-md p-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="public">Público</option>
                                    <option value="private">Privado</option>
                                    <option value="unlisted">Não Listado</option>
                                </select>
                            </div>

                            <div className="bg-surface-800/50 border border-surface-700 rounded-lg p-3">
                                <label className="flex items-start gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={useYouTubeScheduling}
                                        onChange={(e) => setUseYouTubeScheduling(e.target.checked)}
                                        className="mt-0.5 w-4 h-4 rounded border-surface-600 bg-surface-700 text-primary focus:ring-primary focus:ring-offset-0"
                                    />
                                    <div>
                                        <span className="text-sm font-semibold text-white">Usar agendamento nativo do YouTube</span>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            {useYouTubeScheduling
                                                ? "✅ Vídeo será enviado agora e publicado automaticamente pelo YouTube no horário agendado"
                                                : "⚠️ Vídeo ficará na fila e será enviado apenas no horário agendado (requer dashboard aberto)"
                                            }
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </>
                    )}

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

export function CalendarWidget({ history, uploadQueue, addToUploadQueue, rescheduleVideo, moveVideoInHistory, updateVideoMetadata, removeHistoryItem }) {
    const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-CA'));
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    };

    const handleDateClick = (dateStr) => {
        setSelectedDate(dateStr);
    };

    const handleVideoClick = (video) => {
        setSelectedVideo(video);
        setIsVideoModalOpen(true);
    };

    const handleVideoDelete = (videoId) => {
        Object.keys(history).forEach(date => {
            const dayData = history[date];
            if (dayData?.completedItems?.some(item => item.id === videoId)) {
                removeHistoryItem(date, videoId);
            }
        });
    };

    const handleSchedule = (data) => {
        addToUploadQueue({
            title: data.title,
            platform: data.platform,
            scheduledAt: data.scheduledAt,
            source: "scheduled",
            file: data.file,
            privacyStatus: data.privacyStatus,
            publishAt: data.publishAt
        });
        setIsScheduleModalOpen(false);
    };

    // Get scheduled videos for selected date
    const getScheduledVideosForDate = (dateStr) => {
        if (!uploadQueue) return [];
        return uploadQueue.filter(item => {
            if (!item.scheduledAt && !item.publishAt) return false;

            const isUploaded = item.status === 'done' || item.status === 'success';
            const hasFuturePublish = item.publishAt && new Date(item.publishAt) > new Date();

            // Exclude posted videos ONLY if they don't have a future publish date
            if (isUploaded && !hasFuturePublish) return false;

            const itemDate = new Date(item.scheduledAt || item.publishAt);
            const itemDateStr = itemDate.toLocaleDateString('en-CA');
            return itemDateStr === dateStr;
        }).sort((a, b) => new Date(a.scheduledAt || a.publishAt) - new Date(b.scheduledAt || b.publishAt));
    };

    const selectedDayData = history[selectedDate];
    const selectedDateObj = new Date(selectedDate + "T12:00:00");
    const scheduledVideos = getScheduledVideosForDate(selectedDate);
    const hasScheduledVideos = scheduledVideos.length > 0;
    const hasPostedVideos = selectedDayData && selectedDayData.completedItems && selectedDayData.completedItems.length > 0;

    return (
        <>
            <VideoDetailModal
                video={selectedVideo}
                isOpen={isVideoModalOpen}
                onClose={() => setIsVideoModalOpen(false)}
                onReschedule={rescheduleVideo}
                onDelete={handleVideoDelete}
                onEdit={updateVideoMetadata}
            />

            <ScheduleModal
                isOpen={isScheduleModalOpen}
                onClose={() => setIsScheduleModalOpen(false)}
                date={selectedDate}
                onSchedule={handleSchedule}
            />

            <div className="glass-panel rounded-xl overflow-hidden">
                <div className="p-4 border-b border-surface-700/50">
                    <h3 className="font-bold text-white text-lg flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-primary" /> Calendário
                    </h3>
                </div>
                <div className="p-4">
                    <div className="text-xs text-slate-400 mb-4 flex justify-between items-center font-medium uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                            <button onClick={handlePrevMonth} className="hover:text-white transition-colors p-1 hover:bg-surface-700 rounded">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span>{currentDate.toLocaleString('default', { month: 'long' })} {currentYear}</span>
                            <button onClick={handleNextMonth} className="hover:text-white transition-colors p-1 hover:bg-surface-700 rounded">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex gap-2">
                            <span className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Postado
                            </span>
                            <span className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div> Agendado
                            </span>
                            <span className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div> Hoje
                            </span>
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
                            const scheduledForDay = getScheduledVideosForDate(dateStr);
                            const isSelected = selectedDate === dateStr;
                            const isToday = dateStr === new Date().toLocaleDateString('en-CA');
                            const hasActivity = dayData && dayData.completedItems && dayData.completedItems.length > 0;
                            const hasScheduled = scheduledForDay.length > 0;

                            let bgClass = "bg-surface-800/50 text-slate-500 hover:bg-surface-700";
                            let borderClass = "border-transparent";

                            if (isToday) {
                                bgClass = "bg-primary text-white font-bold shadow-lg shadow-primary/30";
                                if (hasActivity) {
                                    borderClass = "border-2 border-green-400";
                                } else if (hasScheduled) {
                                    borderClass = "border-2 border-purple-400";
                                }
                            } else if (hasActivity) {
                                bgClass = "bg-green-500/20 text-green-400 border border-green-500/30";
                            } else if (hasScheduled) {
                                bgClass = "bg-purple-500/20 text-purple-400 border border-purple-500/30";
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

                        {hasPostedVideos || hasScheduledVideos ? (
                            <div className="space-y-4">
                                {/* Scheduled Videos */}
                                {hasScheduledVideos && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                                            <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                                                Agendados ({scheduledVideos.length})
                                            </h4>
                                            <div className="flex-1 h-px bg-gradient-to-r from-purple-400/50 to-transparent"></div>
                                        </div>
                                        {scheduledVideos.map((video, idx) => (
                                            <div key={video.id} className="flex items-center gap-2 text-xs py-2 px-3 bg-surface-800 rounded-lg border border-purple-500/30">
                                                <span className="text-purple-400 font-bold">{idx + 1}.</span>
                                                <div className="flex-1 min-w-0">
                                                    <span className="text-slate-300 truncate block" title={video.title}>
                                                        {video.title}
                                                    </span>
                                                    <span className="text-[10px] text-purple-400 flex items-center gap-1 mt-0.5">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(video.scheduledAt || video.publishAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Posted Videos */}
                                {hasPostedVideos && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                            <h4 className="text-xs font-bold text-green-400 uppercase tracking-wider">
                                                Publicados ({selectedDayData.completedItems.filter(item => item.type === 'youtube_video').length})
                                            </h4>
                                            <div className="flex-1 h-px bg-gradient-to-r from-green-400/50 to-transparent"></div>
                                        </div>
                                        {selectedDayData.completedItems
                                            .filter(item => item.type === 'youtube_video')
                                            .map((video) => (
                                                <div
                                                    key={video.id}
                                                    onClick={() => handleVideoClick(video)}
                                                    className="flex items-center justify-between text-xs py-2 px-3 hover:bg-surface-800 rounded-lg transition-all group cursor-pointer border border-transparent hover:border-surface-600"
                                                >
                                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                                        {video.thumbnail && (
                                                            <img
                                                                src={video.thumbnail}
                                                                alt=""
                                                                className="w-8 h-8 rounded object-cover flex-shrink-0"
                                                            />
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <span className="text-slate-300 truncate block" title={video.title}>
                                                                {video.title}
                                                            </span>
                                                            {video.viewCount !== undefined && (
                                                                <span className="text-[10px] text-slate-500">
                                                                    {video.viewCount.toLocaleString()} views
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <a
                                                        href={video.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="text-primary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                                    >
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                </div>
                                            ))
                                        }
                                    </div>
                                )}

                                {/* Add More Button */}
                                <div className="pt-2 border-t border-surface-700/50">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="w-full text-xs border-dashed border-slate-600 text-slate-400 hover:text-white hover:border-white"
                                        onClick={() => setIsScheduleModalOpen(true)}
                                    >
                                        <Plus className="w-3 h-3 mr-1" /> Agendar Mais
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-xs text-slate-600 italic">Nada agendado ou postado neste dia.</p>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="mt-2 text-xs border-dashed border-slate-600 text-slate-400 hover:text-white hover:border-white"
                                    onClick={() => setIsScheduleModalOpen(true)}
                                >
                                    <Plus className="w-3 h-3 mr-1" /> Agendar Upload
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
