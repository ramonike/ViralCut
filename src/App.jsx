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

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-slate-900 text-red-400 min-h-screen">
          <h1 className="text-2xl font-bold mb-4">Something went wrong.</h1>
          <pre className="bg-slate-800 p-4 rounded overflow-auto text-xs">
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

import LandingPage from "./LandingPage";

export default function ViralCutsDashboard() {
  const { state, actions } = useDashboardState();
  const [shareLink, setShareLink] = useState("");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard' | 'profile'
  const [showLanding, setShowLanding] = useState(true);
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

  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen w-full bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
        {/* Header fixo */}
        <header className="sticky top-0 z-30 w-full bg-slate-900/95 backdrop-blur-lg border-b border-slate-700/50 shadow-xl shadow-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Main header row */}
            <div className="flex items-center justify-between h-16 md:h-20">
              {/* Logo */}
              <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setActiveTab("dashboard")}>
                <div className="flex flex-col gap-0.5">
                  <h1 className="text-2xl md:text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-400 to-blue-500 drop-shadow-sm group-hover:scale-105 transition-transform">
                    ViralCuts
                  </h1>
                  <p className="text-[9px] md:text-[10px] text-slate-400 font-medium tracking-wide uppercase">Creator Dashboard v1.0</p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1 bg-slate-800/50 p-1 rounded-lg border border-slate-700/50 backdrop-blur-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab("dashboard")}
                  className={`transition-all ${activeTab === "dashboard" ? "bg-slate-700 text-white shadow-md shadow-blue-500/10" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab("profile")}
                  className={`transition-all ${activeTab === "profile" ? "bg-slate-700 text-white shadow-md shadow-blue-500/10" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
                >
                  <UserCircle className="w-4 h-4 mr-2" /> Perfil & Conexões
                </Button>
              </nav>

              {/* Actions */}
              <div className="flex gap-2 items-center">
                <div className="hidden sm:flex items-center gap-2 bg-slate-800/50 p-1 rounded-lg border border-slate-700/50 backdrop-blur-sm">
                  <Input ref={linkInputRef} value={shareLink} readOnly className="w-32 md:w-48 text-xs bg-transparent border-none text-slate-400 focus-visible:ring-0 h-8" />
                  <Button onClick={copyLink} size="sm" variant="ghost" className="h-8 text-blue-400 hover:text-white hover:bg-slate-700 transition-all">Copiar</Button>
                </div>
                <Button onClick={() => seedExample()} className="bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all hover:scale-105 shadow-lg shadow-blue-600/20">
                  <PlusCircle className="mr-0 md:mr-2 h-4 w-4" /> <span className="hidden md:inline">Seed</span>
                </Button>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center gap-1 pb-3 pt-2 border-t border-slate-700/30">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("dashboard")}
                className={`flex-1 transition-all ${activeTab === "dashboard" ? "bg-slate-700 text-white shadow-md" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
              >
                <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("profile")}
                className={`flex-1 transition-all ${activeTab === "profile" ? "bg-slate-700 text-white shadow-md" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
              >
                <UserCircle className="w-4 h-4 mr-2" /> Perfil
              </Button>
            </div>
          </div>
        </header>

        {/* Conteúdo principal */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
          {activeTab === "dashboard" ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Left Sidebar - Hidden on mobile, shown on desktop */}
              <div className="hidden lg:block lg:col-span-3">
                <SidebarLeft state={state} actions={actions} />
              </div>

              {/* Main Content */}
              <section className="lg:col-span-6 flex flex-col gap-4 md:gap-6">
                <ChecklistSection state={state} actions={actions} />
                <PipelineSection state={state} actions={actions} />
              </section>

              {/* Right Sidebar */}
              <div className="lg:col-span-3">
                <SidebarRight state={state} actions={actions} />
              </div>
            </div>
          ) : (
            <ProfileSection state={state} actions={actions} />
          )}

          {/* Rodapé */}
          <footer className="mt-12 md:mt-16 text-center text-xs text-slate-500 pb-8">
            Feito para seguir o planejamento de 30 dias — pronto para integrar scripts FFmpeg e YouTube/TikTok APIs.
          </footer>
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
    </ErrorBoundary>
  );
}
