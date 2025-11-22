import React, { useEffect, useRef, useState } from "react";
import { PlusCircle, LayoutDashboard, UserCircle } from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { FloatingCTA } from "./components/ui/FloatingCTA";
import { useDashboardState } from "./hooks/useDashboardState";
import { SidebarLeft } from "./components/dashboard/SidebarLeft";
import { SidebarRight } from "./components/dashboard/SidebarRight";
import { ChecklistSection } from "./components/dashboard/ChecklistSection";
import { PipelineSection } from "./components/dashboard/PipelineSection";
import { ProfileSection } from "./components/dashboard/ProfileSection";

export default function ViralCutsDashboard() {
  const { state, actions } = useDashboardState();
  const [shareLink, setShareLink] = useState("");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard' | 'profile'
  const linkInputRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") setShareLink(window.location.href);
  }, []);

  async function copyLink() {
    if (!shareLink) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareLink);
        setMessage("Link copiado para a área de transferência!");
        return;
      }
    } catch (err) {
      console.warn("Clipboard API failed:", err);
    }
    try {
      if (linkInputRef.current) {
        linkInputRef.current.select();
        document.execCommand("copy");
        setMessage("Link copiado (fallback). Cole onde quiser.");
        return;
      }
    } catch (err) {
      console.error("Fallback copy failed:", err);
    }
    setMessage("Não foi possível copiar automaticamente. Selecione o link e copie manualmente.");
  }

  function seedExample() {
    actions.addToUploadQueue({ title: "Cachorro salva dono em 10s — impossível não rir", source: "clipper", platform: "YouTube Shorts", scheduledAt: new Date().toISOString() });
  }

  return (
    <div className="min-h-screen w-full bg-viral-900 text-slate-100 flex flex-col font-sans selection:bg-viral-neon selection:text-viral-900">
      {/* Header fixo */}
      <header className="sticky top-0 z-30 w-full bg-viral-900/80 backdrop-blur-md border-b border-viral-700 shadow-lg shadow-viral-900/50 py-4 px-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-8">
            <div className="flex flex-col gap-1 cursor-pointer" onClick={() => setActiveTab("dashboard")}>
              <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-viral-neon to-viral-500 drop-shadow-sm">
                ViralCuts
              </h1>
              <p className="text-sm text-viral-400 font-medium tracking-wide uppercase text-[10px]">Creator Dashboard v1.0</p>
            </div>

            {/* Navegação */}
            <nav className="hidden md:flex items-center gap-1 bg-viral-800/50 p-1 rounded-lg border border-viral-700/50">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("dashboard")}
                className={`${activeTab === "dashboard" ? "bg-viral-700 text-white shadow-sm" : "text-slate-400 hover:text-white hover:bg-viral-800"}`}
              >
                <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("profile")}
                className={`${activeTab === "profile" ? "bg-viral-700 text-white shadow-sm" : "text-slate-400 hover:text-white hover:bg-viral-800"}`}
              >
                <UserCircle className="w-4 h-4 mr-2" /> Perfil & Conexões
              </Button>
            </nav>
          </div>

          <div className="flex gap-3 items-center">
            <div className="flex items-center gap-2 bg-viral-800 p-1 rounded-lg border border-viral-700">
              <Input ref={linkInputRef} value={shareLink} readOnly className="w-48 text-xs bg-transparent border-none text-slate-400 focus-visible:ring-0 h-8" />
              <Button onClick={copyLink} size="sm" variant="ghost" className="h-8 text-viral-neon hover:text-white hover:bg-viral-700">Copiar</Button>
            </div>
            <Button onClick={() => seedExample()} className="bg-viral-neon text-viral-900 hover:bg-white font-bold transition-all">
              <PlusCircle className="mr-2 h-4 w-4" /> Seed
            </Button>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-10">
        {activeTab === "dashboard" ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4">
            <SidebarLeft state={state} actions={actions} />

            <section className="md:col-span-6 flex flex-col gap-8">
              <ChecklistSection state={state} actions={actions} />
              <PipelineSection state={state} actions={actions} />
            </section>

            <SidebarRight state={state} actions={actions} />
          </div>
        ) : (
          <ProfileSection state={state} actions={actions} />
        )}

        {/* Rodapé */}
        <footer className="mt-16 text-center text-xs text-slate-400 pb-8">Feito para seguir o planejamento de 30 dias — pronto para integrar scripts FFmpeg e YouTube/TikTok APIs.</footer>
      </main>

      {/* Toast simples para mensagens */}
      {message && (
        <div className="fixed bottom-4 right-4 bg-slate-800 text-white px-4 py-2 rounded shadow-lg text-sm z-50 animate-in fade-in slide-in-from-bottom-2">
          {message}
          <button onClick={() => setMessage("")} className="ml-2 font-bold text-slate-400 hover:text-white">x</button>
        </div>
      )}

      {/* Floating CTA */}
      <FloatingCTA
        text={state.settings.ctaText}
        href={state.settings.ctaLink}
        delay={5000}
      />
    </div>
  );
}
