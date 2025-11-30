import React, { useEffect, useRef, useState } from "react";
import { PlusCircle, LayoutDashboard, UserCircle, Lock } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { FloatingCTA } from "./ui/FloatingCTA";
import { useDashboardState } from "../hooks/useDashboardState";
import { SidebarLeft } from "./dashboard/SidebarLeft";
import { SidebarRight } from "./dashboard/SidebarRight";
import { ChecklistSection } from "./dashboard/ChecklistSection";
import { PipelineSection } from "./dashboard/PipelineSection";
import { ProfileSection } from "./dashboard/ProfileSection";
import EmailVerificationBanner from "./EmailVerificationBanner";

export default function Dashboard() {
    const { state, actions } = useDashboardState();
    const [shareLink, setShareLink] = useState("");
    const [message, setMessage] = useState("");
    const [activeTab, setActiveTab] = useState("dashboard");
    const [user, setUser] = useState(null);
    const linkInputRef = useRef(null);

    useEffect(() => {
        if (typeof window !== "undefined") setShareLink(window.location.href);

        // Check session and get user data
        fetch('http://localhost:3000/api/auth/session', {
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.user) {
                    setUser(data.user);
                }
            })
            .catch((err) => console.error('Failed to get session:', err));
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

    // Check if "Create Google Account" checklist item is done
    const setupChecklist = state.checklists.find(c => c.id === "setup");
    const googleAccountItem = setupChecklist?.items.find(i => i.id === "g_account");
    const isProfileUnlocked = googleAccountItem?.done;

    return (
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
                            <div className="relative group/profile">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    disabled={!isProfileUnlocked}
                                    onClick={() => isProfileUnlocked && setActiveTab("profile")}
                                    className={`transition-all ${activeTab === "profile"
                                        ? "bg-slate-700 text-white shadow-md shadow-blue-500/10"
                                        : isProfileUnlocked
                                            ? "text-slate-400 hover:text-white hover:bg-slate-800"
                                            : "text-slate-600 cursor-not-allowed opacity-50"
                                        }`}
                                >
                                    {isProfileUnlocked ? <UserCircle className="w-4 h-4 mr-2" /> : <Lock className="w-3 h-3 mr-2" />}
                                    Perfil & Conexões
                                </Button>
                                {!isProfileUnlocked && (
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 p-2 bg-slate-800 text-xs text-slate-300 rounded shadow-xl border border-slate-700 opacity-0 group-hover/profile:opacity-100 transition-opacity pointer-events-none z-50 text-center">
                                        Conclua a criação da conta Google para liberar.
                                    </div>
                                )}
                            </div>
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
                            disabled={!isProfileUnlocked}
                            onClick={() => isProfileUnlocked && setActiveTab("profile")}
                            className={`flex-1 transition-all ${activeTab === "profile"
                                ? "bg-slate-700 text-white shadow-md"
                                : isProfileUnlocked
                                    ? "text-slate-400 hover:text-white hover:bg-slate-800"
                                    : "text-slate-600 cursor-not-allowed opacity-50"
                                }`}
                        >
                            {isProfileUnlocked ? <UserCircle className="w-4 h-4 mr-2" /> : <Lock className="w-3 h-3 mr-2" />}
                            Perfil
                        </Button>
                    </div>
                </div>
            </header>

            {/* Conteúdo principal */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
                {/* Email Verification Banner */}
                {user && !user.emailVerified && (
                    <EmailVerificationBanner userEmail={user.email} />
                )}

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
    );
}
