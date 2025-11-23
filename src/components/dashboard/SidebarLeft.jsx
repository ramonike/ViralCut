import React, { useRef } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { exportCSV } from "../../hooks/useDashboardState";
import { Upload, Home, BarChart2, Settings, Layers, CheckSquare, Crown, Plus } from "lucide-react";

export function SidebarLeft({ state, actions }) {
    const { checklists, uploadQueue, settings, channelStats } = state;
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
                title: file.name.replace(/\.[^/.]+$/, ""),
                source: "upload",
                platform: "YouTube Shorts",
                file: file
            });
            e.target.value = "";
        }
    }

    const dailyUploads = uploadQueue.filter(item => item.status === 'done').length;
    const goal = settings.dailyGoal || 4;
    const progress = Math.min((dailyUploads / goal) * 100, 100);

    const NavItem = ({ icon: Icon, label, active, onClick }) => (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${active
                ? "bg-primary/10 text-primary border border-primary/20"
                : "text-slate-400 hover:bg-surface-800 hover:text-slate-200"
                }`}
        >
            <Icon className={`w-5 h-5 ${active ? "text-primary" : "text-slate-500 group-hover:text-slate-300"}`} />
            <span className="font-medium text-sm">{label}</span>
            {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,0.5)]" />}
        </button>
    );

    return (
        <aside className="flex flex-col gap-6 animate-in slide-in-from-left-4 duration-500">
            {/* User Profile Widget */}
            <div className="glass-panel rounded-xl p-4 border-surface-700/50">
                <div className="flex items-center gap-3 mb-4">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-surface-800 border border-surface-700 overflow-hidden">
                            {channelStats?.thumbnails?.default?.url ? (
                                <img src={channelStats.thumbnails.default.url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">
                                    {settings.channelName?.[0] || "U"}
                                </div>
                            )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-surface-900 rounded-full p-0.5">
                            <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-surface-900"></div>
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-slate-200 truncate">{channelStats?.title || settings.channelName || "Seu Canal"}</h3>
                        <div className="flex items-center gap-1">
                            <span className="text-[10px] font-bold bg-gradient-to-r from-yellow-500 to-amber-600 text-white px-1.5 py-0.5 rounded flex items-center gap-1 w-fit">
                                <Crown className="w-2 h-2" /> PRO
                            </span>
                        </div>
                    </div>
                </div>

                {/* Daily Goal Mini-Tracker */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Meta Diária</span>
                        <span className="text-slate-200 font-medium">{dailyUploads}/{goal}</span>
                    </div>
                    <div className="h-1.5 bg-surface-900 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-primary-light transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="space-y-1">
                <p className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Menu</p>
                <NavItem icon={Home} label="Dashboard" active={true} />
                <NavItem icon={Layers} label="Pipeline" />
                <NavItem icon={CheckSquare} label="Checklists" />
                <NavItem icon={BarChart2} label="Analytics" />
                <NavItem icon={Settings} label="Configurações" />
            </nav>

            {/* Quick Actions */}
            <div className="space-y-3 mt-auto">
                <p className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Ações Rápidas</p>

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="video/*"
                    onChange={handleFileSelect}
                />

                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full group relative overflow-hidden rounded-xl bg-primary p-3 transition-all hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/20"
                >
                    <div className="flex items-center justify-center gap-2 text-white font-bold">
                        <Upload className="w-4 h-4" />
                        <span>Upload Vídeo</span>
                    </div>
                </button>
            </div>

            {/* Stats Summary */}
            <div className="glass-panel rounded-xl p-4 mt-4">
                <div className="grid grid-cols-2 gap-4 divide-x divide-surface-700/50">
                    <div className="text-center">
                        <p className="text-[10px] text-slate-500 uppercase font-bold">Checklists</p>
                        <p className="text-xl font-black text-slate-200">{totalDone}</p>
                    </div>
                    <div className="text-center pl-4">
                        <p className="text-[10px] text-slate-500 uppercase font-bold">Fila</p>
                        <p className="text-xl font-black text-slate-200">{uploadQueue.length}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
