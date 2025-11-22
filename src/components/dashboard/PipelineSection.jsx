import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";

export function PipelineSection({ state, actions }) {
    const { addToUploadQueue } = actions;
    const { uploadQueue } = state;

    return (
        <Card>
            <CardHeader>
                <h3 className="font-bold text-blue-800 text-lg">Pipeline & Automação</h3>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-slate-500 mb-4">Fluxos recomendados (clipping → edição → legendas → upload automatizado)</p>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-blue-700">Clipping automático</p>
                            <p className="text-xs text-slate-400">Descript / Opus.pro</p>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={() => alert('Abrir integração: Descript (placeholder)')} variant="secondary">Configurar</Button>
                            <Button onClick={() => addToUploadQueue({ title: "Clipping automático: novo item", source: "clipper" })} variant="primary">Simular saída</Button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-blue-700">Legendas automáticas</p>
                            <p className="text-xs text-slate-400">Descript / YouTube captions</p>
                        </div>
                        <Button onClick={() => alert('Executar job de legendas (placeholder)')} variant="secondary">Executar</Button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-blue-700">Upload automático</p>
                            <p className="text-xs text-slate-400">YouTube Data API / Zapier</p>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} variant="secondary">Conectar YouTube</Button>
                            <Button
                                onClick={() => {
                                    if (!uploadQueue.length) alert('Fila vazia — adicione itens ao queue');
                                    else actions.startUploadQueue();
                                }}
                                variant="primary"
                            >
                                Iniciar Uploads
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
