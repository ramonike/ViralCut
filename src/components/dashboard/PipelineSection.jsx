import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Link as LinkIcon, Settings, RefreshCw, Plus, Trash2 } from "lucide-react";

export function PipelineSection({ state, actions }) {
    const { addToUploadQueue } = actions;
    const { settings, pipeline } = state;

    const handleAddClip = (clip) => {
        addToUploadQueue({
            title: clip.title,
            source: "opus",
            platform: "YouTube Shorts",
            file: null, // In real app, we might download it first
            url: clip.url
        });
    };

    return (
        <div className="space-y-6">
            {/* Link Drop Zone - Vizard.ai */}
            <Card className="bg-viral-800 border-viral-700">
                <CardHeader className="pb-2 border-b border-viral-700/50">
                    <h3 className="font-bold text-blue-400 text-lg flex items-center gap-2">
                        <LinkIcon className="w-5 h-5" /> Novo Projeto (Vizard.ai)
                    </h3>
                </CardHeader>
                <CardContent className="pt-4">
                    <div
                        className="border-2 border-dashed border-viral-600 rounded-xl p-8 text-center hover:bg-viral-900/50 transition-colors relative group cursor-pointer"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={async (e) => {
                            e.preventDefault();
                            const text = e.dataTransfer.getData("text/uri-list") || e.dataTransfer.getData("text/plain");
                            if (text) {
                                try {
                                    await navigator.clipboard.writeText(text);

                                    // Explicit instruction to user
                                    alert(
                                        "LINK COPIADO COM SUCESSO! 📋\n\n" +
                                        "O Vizard.ai não permite colar automaticamente.\n\n" +
                                        "1. A página do Vizard abrirá em uma nova aba.\n" +
                                        "2. Clique no campo de vídeo.\n" +
                                        "3. Pressione CTRL+V para colar o link."
                                    );

                                    window.open("https://vizard.ai/workspace", "_blank");
                                } catch (err) {
                                    console.error("Failed to copy:", err);
                                    prompt("Não foi possível copiar automaticamente. Copie o link abaixo:", text);
                                    window.open("https://vizard.ai/workspace", "_blank");
                                }
                            }
                        }}
                        onClick={() => window.open("https://vizard.ai/workspace", "_blank")}
                    >
                        <div className="flex flex-col items-center gap-2 pointer-events-none">
                            <div className="w-16 h-16 rounded-full bg-viral-900/80 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                <LinkIcon className="w-8 h-8 text-viral-neon" />
                            </div>
                            <p className="text-slate-200 font-medium text-lg">Arraste um link do YouTube aqui</p>
                            <p className="text-sm text-slate-500 max-w-md mx-auto">
                                Solte para <strong>COPIAR</strong> o link.
                                <br />
                                <span className="text-xs opacity-70">Depois, cole (Ctrl+V) no Vizard.ai para criar os cortes.</span>
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Active Jobs */}
            <div className="space-y-4">
                <h3 className="font-bold text-slate-300 text-lg">Projetos Recentes</h3>
                {pipeline.jobs.length === 0 && (
                    <p className="text-slate-500 text-sm italic">Nenhum projeto iniciado.</p>
                )}
                {pipeline.jobs.map((job) => (
                    <Card key={job.projectId} className="bg-viral-800 border-viral-700 overflow-hidden">
                        <div className="p-4 flex items-center justify-between border-b border-viral-700/50 bg-viral-900/30">
                            <div>
                                <p className="font-bold text-slate-200">{job.originalName}</p>
                                <p className="text-xs text-slate-500">ID: {job.projectId}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`text-xs px-2 py-1 rounded-full border ${job.status === 'done'
                                    ? 'bg-green-500/10 text-green-400 border-green-500/30'
                                    : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                                    }`}>
                                    {job.status === 'done' ? 'Concluído' : 'Processando...'}
                                </span>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => checkOpusJob(job.projectId)}
                                    disabled={job.status === 'done'}
                                >
                                    <RefreshCw className={`w-4 h-4 ${job.status !== 'done' ? '' : 'text-slate-600'}`} />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => actions.removeOpusJob(job.projectId)}
                                    className="text-slate-500 hover:text-red-400"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Clips Result */}
                        {job.clips && job.clips.length > 0 && (
                            <div className="p-4 bg-viral-900/50">
                                <p className="text-xs text-slate-400 mb-3 uppercase font-bold">Cortes Gerados ({job.clips.length})</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {job.clips.map((clip) => (
                                        <div key={clip.id} className="flex gap-3 bg-viral-800 p-2 rounded-lg border border-viral-700 hover:border-viral-500 transition-colors">
                                            <div className="w-20 h-28 bg-black rounded overflow-hidden flex-shrink-0">
                                                <img src={clip.thumbnail} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between py-1">
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <p className="font-semibold text-sm text-slate-200 line-clamp-2" title={clip.title}>{clip.title}</p>
                                                        <span className="text-[10px] font-bold text-green-400 bg-green-900/30 px-1 rounded">{clip.score}</span>
                                                    </div>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    className="w-full mt-2 h-8 text-xs"
                                                    variant="secondary"
                                                    onClick={() => handleAddClip(clip)}
                                                >
                                                    <Plus className="w-3 h-3 mr-1" /> Adicionar à Fila
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
}
