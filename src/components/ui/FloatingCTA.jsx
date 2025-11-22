import React, { useState, useEffect } from "react";
import { Zap, X } from "lucide-react";
import { Button } from "./button";

export function FloatingCTA({
    text = "🚀 Acesse o Método Completo",
    href = "#",
    delay = 3000 // Delay antes de aparecer (ms)
}) {
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        // Verificar se já foi dispensado nesta sessão
        const dismissed = sessionStorage.getItem("cta_dismissed");
        if (dismissed) {
            setIsDismissed(true);
            return;
        }

        // Mostrar após o delay
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [delay]);

    const handleDismiss = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsVisible(false);
        setIsDismissed(true);
        sessionStorage.setItem("cta_dismissed", "true");
    };

    if (isDismissed || !isVisible) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-8 fade-in duration-500">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-viral-neon/20 blur-xl rounded-full animate-pulse"></div>

            {/* Main CTA Button */}
            <div className="relative">
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                >
                    <Button
                        className="
                            bg-gradient-to-r from-viral-neon to-viral-500 
                            hover:from-viral-500 hover:to-viral-neon
                            text-viral-900 font-black text-sm
                            px-6 py-6 rounded-full shadow-2xl
                            border-2 border-white/20
                            transition-all duration-300
                            hover:scale-105 hover:shadow-viral-neon/50
                            flex items-center gap-3
                            group
                        "
                    >
                        <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        <span className="max-w-[200px] text-left leading-tight">
                            {text}
                        </span>
                    </Button>
                </a>

                {/* Dismiss button */}
                <button
                    onClick={handleDismiss}
                    className="
                        absolute -top-2 -right-2 
                        bg-slate-800 hover:bg-slate-700
                        text-slate-400 hover:text-white
                        rounded-full p-1.5
                        border border-slate-700
                        transition-all duration-200
                        hover:scale-110
                    "
                    aria-label="Fechar"
                >
                    <X className="w-3 h-3" />
                </button>
            </div>

            {/* Floating particles effect (optional) */}
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-viral-neon rounded-full animate-ping opacity-75"></div>
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-viral-pink rounded-full animate-ping opacity-75 animation-delay-150"></div>
        </div>
    );
}
