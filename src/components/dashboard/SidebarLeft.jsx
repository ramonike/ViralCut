import React, { useRef } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { exportCSV } from "../../hooks/useDashboardState";
import { Upload } from "lucide-react";

export function SidebarLeft({ state, actions }) {
    const { checklists, uploadQueue, settings } = state;
    const { addToUploadQueue, resetState } = actions;
    const fileInputRef = useRef(null);

    const totalDone = checklists.reduce((acc, cl) => acc + cl.items.filter((i) => i.done).length, 0);
    const totalItems = checklists.reduce((acc, cl) => acc + cl.items.length, 0);

    function exportChecklistCSV() {
        const rows = checklists.flatMap((cl) => cl.items.map((it) => ({ checklist: cl.title, id: it.id, text: it.text, done: it.done })));
        exportCSV(rows, "checklists.csv");
    }

    function handleFileSelect(e) {
        const file = e.target.files?.[0];
        if (file) {
            addToUploadQueue({
                title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension for title
                source: "upload",
                platform: "YouTube Shorts", // Default
                file: file
            });
            // Reset input
            e.target.value = "";
        }
    }

    const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
    const dailyUploads = uploadQueue.filter(item => {
        // Check if item is done and was uploaded today (mock logic for date check, assuming 'done' items are recent)
        // In a real app, we would store 'uploadedAt' timestamp.
        // For now, let's count 'done' items as today's progress for the visual demo, 
        // or we could add a 'uploadedAt' field in markQueueStatus.
        return item.status === 'done';
    }).length;

    const goal = settings.dailyGoal || 4;
    const progress = Math.min((dailyUploads / goal) * 100, 100);

    return (
        <aside className="md:col-span-3 flex flex-col gap-6">
            {/* Meta Diária Widget */}
            <Card className="bg-viral-800 border-viral-700 shadow-lg shadow-viral-900/50">
                <CardHeader className="pb-2">
                    <h3 className="font-bold text-viral-neon text-lg flex items-center gap-2">
                        🚀 Meta Diária
                    </h3>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-end">
                            <span className="text-4xl font-black text-white">{dailyUploads}</span>
                            <span className="text-sm text-slate-400 mb-1">/ {goal} vídeos</span>
                        </div>
                        <div className="w-full h-3 bg-viral-900 rounded-full overflow-hidden border border-viral-700">
                            <div
                                className="h-full bg-gradient-to-r from-viral-500 to-viral-pink transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                            {progress >= 100 ? "🔥 Meta batida! Você é uma máquina!" : "Continue postando para crescer!"}
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white/5 border-slate-200/10 backdrop-blur-sm">
                <CardHeader>
                    <h3 className="font-bold text-slate-700 text-lg">Resumo Geral</h3>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500">Checklists</p>
                                <p className="font-bold text-slate-800 text-lg">{totalDone} / {totalItems}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-500">Fila</p>
                                <p className="font-bold text-slate-800 text-lg">{uploadQueue.length}</p>
                            </div>
                        </div>
                        <Button onClick={exportChecklistCSV} variant="outline" className="w-full border-slate-300 text-slate-600 hover:bg-slate-50">Exportar CSV</Button>

                        <div className="pt-4 border-t border-slate-100">
                            <p className="text-xs text-slate-400">Canal</p>
                            <p className="text-sm font-semibold text-slate-700">{settings.channelName}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white/5 border-slate-200/10">
                <CardHeader>
                    <h3 className="font-bold text-slate-700 text-lg">Ações</h3>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-3">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="video/*"
                            onChange={handleFileSelect}
                        />
                        <Button onClick={() => fileInputRef.current?.click()} className="bg-viral-500 hover:bg-viral-400 text-white font-bold shadow-lg shadow-viral-500/20 transition-all hover:scale-105">
                            <Upload className="mr-2 h-4 w-4" /> Upload Vídeo
                        </Button>
                        <Button onClick={() => { addToUploadQueue({ title: "Item Manual", source: "manual" }); }} variant="secondary">Adicionar Manual</Button>
                        <Button onClick={resetState} variant="ghost" className="text-slate-400 hover:text-red-500">Resetar Painel</Button>
                    </div>
                </CardContent>
            </Card>
        </aside>
    );
}
