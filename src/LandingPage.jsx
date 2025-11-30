import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Play, Star, TrendingUp, Zap, Shield, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans text-slate-100 selection:bg-red-600 selection:text-white">
      {/* Navbar Flutuante */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center font-bold text-white">
              V
            </div>
            <span className="font-bold text-xl tracking-tighter">ViralCuts</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition border border-white/10 text-sm"
          >
            Área de Membros
          </motion.button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-red-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Nova Estratégia 2025
          </motion.div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight tracking-tight">
            MONETIZE SEU CANAL EM <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">30 DIAS</span>
          </h1>

          <p className="text-lg md:text-2xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            O método de <strong className="text-white">Cortes Virais e Automação</strong> para dominar o YouTube Shorts e TikTok sem aparecer.
          </p>

          {/* VSL Placeholder */}
          <div className="relative aspect-video max-w-3xl mx-auto bg-slate-900 rounded-2xl border border-white/10 shadow-2xl shadow-red-900/20 mb-12 overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/30 transition">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-600/50 group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-white fill-current ml-1" />
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop"
              alt="Dashboard Preview"
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              <div className="bg-black/60 backdrop-blur px-3 py-1 rounded text-xs font-medium text-white">
                ▶ Assistir Aula Gratuita
              </div>
              <div className="bg-red-600 px-2 py-1 rounded text-xs font-bold text-white">
                LIVE
              </div>
            </div>
          </div>

          <motion.a
            href="#cta"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 hover:shadow-red-600/40 transition text-lg md:text-xl group"
          >
            QUERO ACESSAR O MÉTODO
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.a>

          <p className="mt-4 text-sm text-slate-500">
            🔒 Acesso imediato • Garantia de 7 dias
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Alunos", value: "1,200+" },
            { label: "Views Geradas", value: "50M+" },
            { label: "Canais Monetizados", value: "350+" },
            { label: "Faturamento", value: "R$ 2M+" },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-3xl md:text-4xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-sm text-slate-500 uppercase tracking-wider font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              Cansado da <span className="text-red-500">Rota Lenta?</span>
            </h2>
            <p className="text-slate-400 text-lg mb-6 leading-relaxed">
              A rota tradicional exige meses de roteiros caros, edição complexa e 4.000 horas de exibição. É exaustivo e demorado.
            </p>
            <div className="space-y-4">
              {[
                "4.000 horas de exibição necessárias",
                "Edição que leva horas por vídeo",
                "Roteiros complexos e caros",
                "Meses sem ver 1 centavo"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-red-500 text-sm">✕</span>
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl blur-2xl opacity-20" />
            <div className="relative bg-slate-900 border border-white/10 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Zap className="text-yellow-400" /> A Nova Era (Short-Form)
              </h3>
              <div className="space-y-4">
                {[
                  "10 Milhões de Views em 90 dias",
                  "Cortes virais feitos em minutos",
                  "Sem aparecer, sem roteiros",
                  "Monetização acelerada"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-white">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Method Section */}
      <section className="py-24 px-4 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              O Método <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">V.A.I.</span>
            </h2>
            <p className="text-slate-400 text-lg">
              Viralize, Automatize, Incremente. Três pilares para construir um império de canais dark.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <TrendingUp className="w-8 h-8 text-blue-400" />,
                title: "1. Viralize",
                desc: "Escolha nichos de consumo massivo (Pets, Hacks, Fails) com baixo custo e alto potencial de retenção."
              },
              {
                icon: <Zap className="w-8 h-8 text-yellow-400" />,
                title: "2. Automatize",
                desc: "Use nossa pipeline de IA para gerar cortes, legendas e agendar uploads em múltiplas plataformas."
              },
              {
                icon: <Shield className="w-8 h-8 text-green-400" />,
                title: "3. Incremente",
                desc: "Adicione valor único (edição, contexto) para evitar conteúdo repetitivo e garantir a monetização."
              }
            ].map((card, i) => (
              <div key={i} className="bg-slate-900/50 border border-white/5 p-8 rounded-2xl hover:border-white/10 transition group">
                <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                <p className="text-slate-400 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-black pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-8">
            Pronto para Escalar seu Canal?
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Receba o Plano de 30 Dias, Scripts de Automação e Templates de Edição. Tudo o que você precisa para começar hoje.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <motion.a
              href="/register"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full md:w-auto px-10 py-5 bg-white text-slate-900 font-black rounded-xl shadow-xl hover:bg-slate-200 transition text-xl"
            >
              COMEÇAR AGORA
            </motion.a>
            <motion.a
              href="/login"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full md:w-auto px-10 py-5 bg-transparent border border-white/20 text-white font-bold rounded-xl hover:bg-white/10 transition text-xl"
            >
              JÁ SOU ALUNO
            </motion.a>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> Pagamento Seguro</span>
            <span className="flex items-center gap-2"><Star className="w-4 h-4" /> 4.9/5 Avaliação</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-black text-slate-500 text-sm">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white/10 rounded flex items-center justify-center text-white font-bold text-xs">V</div>
            <span className="font-bold text-slate-300">ViralCuts</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition">Termos</a>
            <a href="#" className="hover:text-white transition">Privacidade</a>
            <a href="#" className="hover:text-white transition">Suporte</a>
          </div>
          <div>
            © 2025 ViralCuts. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
