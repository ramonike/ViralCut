import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { CheckSquare, Plus, RefreshCw } from "lucide-react";

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
        <Card className="bg-viral-800 border-viral-700 shadow-lg h-full">
            <CardHeader className="pb-2 border-b border-viral-700/50 flex flex-row items-center justify-between">
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
            </CardHeader>
            <CardContent className="pt-4 flex flex-col h-[calc(100%-60px)]">
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
                                    onClick={() => toggleItem(activeList.id, item.id)}
                                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all group ${item.done
                                            ? "bg-viral-900/30 border-viral-700 opacity-60"
                                            : "bg-viral-900 border-viral-600 hover:border-viral-500 hover:shadow-md hover:shadow-viral-500/10"
                                        }`}
                                >
                                    <div
                                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${item.done
                                                ? "bg-viral-neon border-viral-neon"
                                                : "border-slate-500 group-hover:border-viral-400"
                                            }`}
                                    >
                                        {item.done && <span className="text-viral-900 text-xs font-bold">✓</span>}
                                    </div>
                                    <span
                                        className={`text-sm ${item.done ? "text-slate-500 line-through" : "text-slate-200"
                                            }`}
                                    >
                                        {item.text}
                                    </span>
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
            </CardContent>
        </Card>
    );
}
