import React, { useState } from 'react';
import { X, ExternalLink, Calendar, Eye, ThumbsUp, Clock, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function VideoDetailModal({ video, isOpen, onClose, onReschedule, onDelete, onEdit }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(video?.title || '');
    const [editedDescription, setEditedDescription] = useState(video?.description || '');

    if (!isOpen || !video) return null;

    const handleSave = () => {
        onEdit?.(video.id, { title: editedTitle, description: editedDescription });
        setIsEditing(false);
    };

    const handleReschedule = () => {
        const newDate = prompt('Nova data (YYYY-MM-DD):');
        if (newDate && /^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
            onReschedule?.(video.id, newDate);
            onClose();
        }
    };

    const handleDelete = () => {
        if (confirm(`Tem certeza que deseja remover "${video.title}"?`)) {
            onDelete?.(video.id);
            onClose();
        }
    };

    const statusColors = {
        success: 'bg-green-500/20 text-green-400 border-green-500/30',
        done: 'bg-green-500/20 text-green-400 border-green-500/30',
        ready: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        uploading: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        error: 'bg-red-500/20 text-red-400 border-red-500/30',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-surface-900 border border-surface-700 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-surface-900 border-b border-surface-700 p-6 flex items-start justify-between z-10">
                    <div className="flex-1 pr-4">
                        {isEditing ? (
                            <Input
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                className="bg-surface-800 border-surface-600 text-white text-lg font-bold"
                            />
                        ) : (
                            <h2 className="text-xl font-bold text-white">{video.title}</h2>
                        )}
                        {video.status && (
                            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold border ${statusColors[video.status] || 'bg-slate-500/20 text-slate-400 border-slate-500/30'}`}>
                                {video.status === 'done' || video.status === 'success' ? '✓ Publicado' :
                                    video.status === 'ready' ? '⏳ Agendado' :
                                        video.status === 'uploading' ? '⬆️ Enviando' :
                                            video.status === 'error' ? '❌ Erro' : video.status}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-surface-800 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Thumbnail */}
                    {video.thumbnail && (
                        <div className="relative rounded-xl overflow-hidden bg-surface-800 aspect-video">
                            <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Metrics */}
                    {(video.viewCount !== undefined || video.likes !== undefined) && (
                        <div className="grid grid-cols-2 gap-4">
                            {video.viewCount !== undefined && (
                                <div className="bg-surface-800/50 rounded-lg p-4 border border-surface-700">
                                    <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                                        <Eye className="w-4 h-4" />
                                        <span>Visualizações</span>
                                    </div>
                                    <p className="text-2xl font-bold text-white">{video.viewCount?.toLocaleString() || 0}</p>
                                </div>
                            )}
                            {video.likes !== undefined && (
                                <div className="bg-surface-800/50 rounded-lg p-4 border border-surface-700">
                                    <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                                        <ThumbsUp className="w-4 h-4" />
                                        <span>Curtidas</span>
                                    </div>
                                    <p className="text-2xl font-bold text-white">{video.likes?.toLocaleString() || 0}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Description */}
                    <div>
                        <label className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2 block">
                            Descrição
                        </label>
                        {isEditing ? (
                            <textarea
                                value={editedDescription}
                                onChange={(e) => setEditedDescription(e.target.value)}
                                rows={4}
                                className="w-full bg-surface-800 border border-surface-600 text-white rounded-lg p-3 text-sm resize-none focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                            />
                        ) : (
                            <p className="text-slate-300 text-sm whitespace-pre-wrap">
                                {video.description || 'Sem descrição'}
                            </p>
                        )}
                    </div>

                    {/* Metadata */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-slate-400">Plataforma:</span>
                            <p className="text-white font-medium">{video.platform || 'YouTube Shorts'}</p>
                        </div>
                        {video.publishedAt && (
                            <div>
                                <span className="text-slate-400">Publicado em:</span>
                                <p className="text-white font-medium">
                                    {new Date(video.publishedAt).toLocaleDateString('pt-BR')}
                                </p>
                            </div>
                        )}
                        {video.scheduledAt && (
                            <div>
                                <span className="text-slate-400">Agendado para:</span>
                                <p className="text-white font-medium">
                                    {new Date(video.scheduledAt).toLocaleString('pt-BR')}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="sticky bottom-0 bg-surface-900 border-t border-surface-700 p-6 flex gap-3">
                    {isEditing ? (
                        <>
                            <Button onClick={handleSave} className="flex-1">
                                Salvar Alterações
                            </Button>
                            <Button onClick={() => setIsEditing(false)} variant="outline">
                                Cancelar
                            </Button>
                        </>
                    ) : (
                        <>
                            {video.url && (
                                <Button
                                    onClick={() => window.open(video.url, '_blank')}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Ver no YouTube
                                </Button>
                            )}
                            <Button
                                onClick={() => setIsEditing(true)}
                                variant="outline"
                            >
                                <Edit2 className="w-4 h-4 mr-2" />
                                Editar
                            </Button>
                            <Button
                                onClick={handleReschedule}
                                variant="outline"
                            >
                                <Calendar className="w-4 h-4 mr-2" />
                                Reagendar
                            </Button>
                            <Button
                                onClick={handleDelete}
                                variant="outline"
                                className="text-red-400 border-red-500/30 hover:bg-red-500/10"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
