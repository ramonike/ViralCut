import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { CheckSquare, Plus, RefreshCw, ExternalLink, Youtube, Video, Image, MessageSquare, Zap, DollarSign, ShoppingBag } from "lucide-react";

// Brand Button Component
const BrandButton = ({ type, url }) => {
    const brands = {
        google: {
            label: "Google",
            icon: <span className="font-bold text-lg">G</span>,
            className: "bg-white text-slate-900 hover:bg-slate-200"
        },
        youtube: {
            label: "YouTube",
            icon: <Youtube className="w-4 h-4" />,
            className: "bg-[#FF0000] text-white hover:bg-[#CC0000]"
        },
        youtube_studio: {
            label: "Studio",
            icon: <Video className="w-4 h-4" />,
            className: "bg-[#FF0000] text-white hover:bg-[#CC0000]"
        },
        youtube_monetization: {
            label: "Monetização",
            icon: <DollarSign className="w-4 h-4" />,
            className: "bg-[#2bb24c] text-white hover:bg-[#23963f]"
        },
        tiktok: {
            label: "TikTok",
            icon: <span className="font-bold">♪</span>,
            className: "bg-black text-white border border-slate-700 hover:bg-slate-900"
        },
        tiktok_marketplace: {
            label: "Marketplace",
            icon: <ShoppingBag className="w-4 h-4" />,
            className: "bg-black text-white border border-slate-700 hover:bg-slate-900"
        },
        canva: {
            label: "Canva",
            icon: <Image className="w-4 h-4" />,
            className: "bg-[#00C4CC] text-white hover:bg-[#009FA6]"
        },
        chatgpt: {
            label: "ChatGPT",
            icon: <MessageSquare className="w-4 h-4" />,
            className: "bg-[#74AA9C] text-white hover:bg-[#5E8A7E]"
        },
        opus: {
            label: "OpusClip",
            icon: <Video className="w-4 h-4" />,
            className: "bg-[#5D3FD3] text-white hover:bg-[#4B32AA]"
        },
        zapier: {
            label: "Zapier",
            icon: <Zap className="w-4 h-4" />,
            className: "bg-[#FF4F00] text-white hover:bg-[#CC3F00]"
        },
        make: {
            label: "Make",
            icon: <Zap className="w-4 h-4" />,
            className: "bg-[#6D28D9] text-white hover:bg-[#5B21B6]"
        },
        default: {
            label: "Link",
            icon: <ExternalLink className="w-4 h-4" />,
            className: "bg-slate-700 text-white hover:bg-slate-600"
        }
    };

    const style = brands[type] || brands.default;

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all shadow-sm ${style.className}`}
            onClick={(e) => e.stopPropagation()}
            title={`Abrir ${style.label}`}
        >
            {style.icon}
            <span className="hidden sm:inline">{style.label}</span>
        </a>
    );
};

export function ChecklistSection({ state, actions }) {
    const { checklists } = state;
    const { toggleItem, addChecklistItem, resetChecklist } = actions;
    const [newItemText, setNewItemText] = useState("");
    const [activeListId, setActiveListId] = useState(checklists[0]?.id);

    const activeList = checklists.find((c) => c.id === activeListId);

    function handleAdd() {
        if (!newItemText.trim()) return;
        addChecklistItem(activeListId, newItemText);
        setNewItemText("");
    }

    return (
        <div id="checklist-section" className="glass-panel rounded-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-700">
            <div className="p-4 border-b border-surface-700/50 flex items-center justify-between">
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-viral-neon" /> Checklists
                </h3>
                <div className="flex gap-1">
                    {checklists.map((cl) => (
                        <button
                            key={cl.id}
                            onClick={() => setActiveListId(cl.id)}
                            className={`text-xs px-3 py-1 rounded-full transition-all ${activeListId === cl.id
                                ? "bg-viral-500 text-white font-bold shadow-lg shadow-viral-500/20"
                                : "bg-viral-900/50 text-slate-400 hover:bg-viral-700"
                                }`}
                        >
                            {cl.title}
                        </button>
                    ))}
                </div>
            </div>
            <div className="p-4 flex flex-col h-[400px]">
                {activeList && (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-sm text-slate-400">
                                {activeList.items.filter(i => i.done).length}/{activeList.items.length} concluídos
                            </p>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => resetChecklist(activeList.id)}
                                className="text-xs text-viral-400 hover:text-white hover:bg-viral-700 h-7"
                                title="Resetar itens para amanhã"
                            >
                                <RefreshCw className="w-3 h-3 mr-1" /> Resetar Diário
                            </Button>
                        </div>

                        <div className="space-y-2 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            {activeList.items.map((item) => (
                                <div
                                    key={item.id}
                                    className={`flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg border transition-all group ${item.done
                                        ? "bg-viral-900/30 border-viral-700 opacity-60"
                                        : "bg-viral-900 border-viral-600 hover:border-viral-500 hover:shadow-md hover:shadow-viral-500/10"
                                        }`}
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        <div
                                            onClick={() => toggleItem(activeList.id, item.id)}
                                            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors cursor-pointer flex-shrink-0 ${item.done
                                                ? "bg-viral-neon border-viral-neon"
                                                : "border-slate-500 group-hover:border-viral-400"
                                                }`}
                                        >
                                            {item.done && <span className="text-viral-900 text-xs font-bold">✓</span>}
                                        </div>
                                        <span
                                            onClick={() => toggleItem(activeList.id, item.id)}
                                            className={`text-sm flex-1 cursor-pointer ${item.done ? "text-slate-500 line-through" : "text-slate-200"
                                                }`}
                                        >
                                            {item.text}
                                        </span>
                                    </div>

                                    {/* Action Buttons */}
                                    {item.actions && item.actions.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pl-8 sm:pl-0">
                                            {item.actions.map((action, idx) => (
                                                <BrandButton key={idx} type={action.type} url={action.url} />
                                            ))}
                                        </div>
                                    )}

                                    {/* Legacy Link Fallback */}
                                    {item.link && !item.actions && (
                                        <div className="pl-8 sm:pl-0">
                                            <BrandButton type="default" url={item.link} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 flex gap-2 pt-4 border-t border-viral-700/50">
                            <Input
                                value={newItemText}
                                onChange={(e) => setNewItemText(e.target.value)}
                                placeholder="Novo item..."
                                className="bg-viral-900 border-viral-700 text-slate-200 focus-visible:ring-viral-500 placeholder:text-slate-600"
                                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                            />
                            <Button onClick={handleAdd} className="bg-viral-700 hover:bg-viral-600 text-white">
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
