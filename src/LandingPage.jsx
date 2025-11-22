import React, { useState } from "react";
import { motion } from "framer-motion";
import ViralCutsDashboard from "./App.jsx";

export default function LandingPage() {
  const [showDashboard, setShowDashboard] = useState(false);
  if (showDashboard) return <ViralCutsDashboard />;
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-100 font-sans text-slate-900">
      {/* Botão fixo para acessar dashboard */}
      <div className="fixed top-4 right-4 z-50">
        <motion.button
          whileHover={{ scale: 1.08, boxShadow: "0 4px 24px #facc15cc" }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setShowDashboard(true)}
          className="px-5 py-2 bg-slate-900 text-yellow-300 font-bold rounded-xl shadow-lg hover:bg-slate-800 transition text-base border-2 border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          Acessar Dashboard
        </motion.button>
      </div>
      {/* SEO Meta */}
      <head>
        <title>Monetize YouTube Shorts e TikTok em 30 Dias | Automação e Cortes Virais</title>
        <meta name="description" content="Aprenda a usar automação, clipping e nichos virais (Pets, Hacks) para atingir 10 milhões de views e começar a ganhar dinheiro em 30 dias." />
        <link rel="canonical" href="/monetizacao-shorts-rapida" />
      </head>
      {/* Hero Section */}
      <section className="w-full py-16 px-4 md:px-0 flex flex-col items-center text-center bg-gradient-to-b from-yellow-100 to-white">
        <h1 className="text-4xl md:text-5xl font-black mb-4 text-orange-600 drop-shadow-lg">Monetize Seu Canal em 30 Dias 🚀</h1>
        <h2 className="text-xl md:text-2xl font-semibold mb-6 text-slate-700 max-w-2xl">O Método de Cortes Virais e Automação para YouTube Shorts e TikTok</h2>
        <p className="text-lg md:text-xl max-w-2xl mb-8 text-slate-600">Esqueça vídeos longos. Crie de <b>4 a 6 cortes virais por dia</b> em nichos de consumo massivo, atinja <b>10 Milhões de Views</b> e receba sua primeira receita mais rápido que 99% dos criadores.</p>
        <motion.a
          href="#cta"
          whileHover={{ scale: 1.06, boxShadow: "0 4px 32px #fb923c99" }}
          whileTap={{ scale: 0.97 }}
          className="inline-block px-8 py-4 bg-orange-500 text-white font-bold rounded-2xl shadow-lg hover:bg-orange-600 transition text-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
        >
          Quero Acessar o Método de Automação Agora
        </motion.a>
      </section>

      {/* Seção 1: O Problema & A Oportunidade */}
      <section className="max-w-3xl mx-auto py-12 px-4">
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">Cansado da Rota Lenta? <span>💡</span></h3>
        <p className="mb-2 text-slate-700">A rota tradicional para monetizar exige meses de conteúdo longo, roteiros caros e <b>4.000 horas de exibição</b>. A nova era do Short-Form Content (Shorts e TikTok) oferece um atalho:</p>
        <ul className="list-disc ml-6 mb-2 text-slate-700">
          <li><b>10 Milhões de Views</b> em 90 dias (YouTube)</li>
          <li>Programas de recompensa com menos de <b>10k seguidores</b> (TikTok)</li>
        </ul>
        <p className="mb-2 text-slate-700">Nossa Estratégia: Foco total em temas de consumo massivo (<b>Pets, Life Hacks, Fails</b>) e uma Pipeline de Produção Escalável que faz o trabalho pesado por você.</p>
      </section>

      {/* Seção 2: O Método (3 Pilares) */}
      <section className="max-w-3xl mx-auto py-12 px-4">
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">O Método V.A.I. (Viralize, Automatize, Incremente) 🎯</h3>
        <ol className="list-decimal ml-6 text-slate-700 space-y-2">
          <li><b>Escolha de Nicho Estratégica:</b> Foque em temas com baixo custo de produção e alto potencial de repetição/descoberta (trends, fácil de entender sem som) para alcance imediato.</li>
          <li><b>Pipeline de Automação:</b> Utilize ferramentas (Descript, Opus.pro, scripts) para o Clipping Automático, Legendas em Lote e Upload/Agendamento em múltiplas plataformas (YouTube API, Zapier).</li>
          <li><b>Escalada Rápida e Compliance:</b> Adicione valor único (edição própria, contexto, legendas) para acelerar a monetização e evitar a fiscalização de conteúdo repetitivo do YouTube.</li>
        </ol>
      </section>

      {/* Seção 3: 5 Passos Chave */}
      <section className="max-w-3xl mx-auto py-12 px-4">
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">Estratégias de Aceleração que Funcionam 🔑</h3>
        <ul className="space-y-2 text-slate-700">
          <li><b>Foco Viral (Temas Testados):</b> Concentre-se nos nichos que sempre viralizam e entregam valor em &lt;30s: <b>Pets fofos, Dicas rápidas visuais e Compilações de Falhas Engraçadas</b>.</li>
          <li><b>O Padrão de 30 Segundos:</b> Utilize o Formato Ideal (<b>Hook 0-2s → Corpo 3-20s → CTA 21-30s</b>) para maximizar a retenção média.</li>
          <li><b>Consistência Robusta:</b> Inicie com 2 a 4 uploads por dia e escale para 6+ assim que sua automação estiver estável.</li>
          <li><b>Otimização Imediata (A/B Testing):</b> Monitore retenção média e views em 24h. Faça A/B testing de 3 variações de hook/título por vídeo nas primeiras horas.</li>
          <li><b>Legendas são Obrigatórias:</b> Use legendas automáticas e revisadas (via Descript/YouTube) para melhorar a retenção e discoverability em 100% dos seus vídeos.</li>
        </ul>
      </section>

      {/* Seção 4: Requisitos e Metas */}
      <section className="max-w-3xl mx-auto py-12 px-4">
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">A Matemática da Monetização Rápida 💰</h3>
        <div className="mb-4">
          <table className="w-full text-left border border-slate-200 rounded-xl overflow-hidden mb-2">
            <thead className="bg-orange-100">
              <tr>
                <th className="py-2 px-3 font-bold">Rota Tradicional</th>
                <th className="py-2 px-3 font-bold">Rota Short-Form</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr>
                <td className="py-2 px-3">4.000 horas de exibição</td>
                <td className="py-2 px-3">10M views em 90 dias</td>
              </tr>
              <tr>
                <td className="py-2 px-3">Conteúdo longo, produção cara</td>
                <td className="py-2 px-3">Conteúdo curto, produção rápida</td>
              </tr>
              <tr>
                <td className="py-2 px-3">Monetização lenta</td>
                <td className="py-2 px-3">Monetização acelerada</td>
              </tr>
            </tbody>
          </table>
        </div>
        <ul className="list-disc ml-6 text-slate-700">
          <li><b>Meta no YouTube YPP (Shorts):</b> 1.000 inscritos, 10 Milhões de Visualizações nos últimos 90 dias.</li>
          <li><b>Meta no TikTok:</b> A partir de 1k ou 10k seguidores (dependendo do país), você já pode buscar parcerias pagas, Gifts e Live.</li>
          <li><b>Atenção à Compliance:</b> Para monetizar rápido, adicione valor único aos seus cortes. Nunca publique conteúdo de massa sem transformação (legendas, contexto, vinheta própria).</li>
        </ul>
      </section>

      {/* Seção 5: Automação e Ferramentas */}
      <section className="max-w-3xl mx-auto py-12 px-4">
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">O Poder da Pipeline Escalável 🛠️</h3>
        <ul className="space-y-2 text-slate-700">
          <li><b>Clipping Inteligente:</b> Use Opus.pro ou Descript para gerar 5-20 cortes automáticos de vídeos longos.</li>
          <li><b>Edição em Lote:</b> CapCut ou scripts FFmpeg para aplicar o template de legenda e vinheta em segundos.</li>
          <li><b>Upload Multiplataforma:</b> Configure fluxos Zapier/Make ou use a YouTube Data API (Python) para agendar e publicar automaticamente em YouTube Shorts e TikTok.</li>
          <li><b>Organização de Projetos:</b> Use Airtable/Notion para rastrear o status de cada corte (<span className="font-mono">raw → ready → live</span>) e monitorar as métricas em tempo real.</li>
        </ul>
      </section>

      {/* Seção 6: Prova Social/Resultados (Placeholder) */}
      <section className="max-w-3xl mx-auto py-12 px-4 text-center">
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 justify-center">Resultados de Alunos <span>📈</span></h3>
        <div className="text-slate-500 italic">(Em breve: depoimentos e prints de resultados reais)</div>
      </section>

      {/* Seção 7: CTA Final */}
      <section id="cta" className="w-full py-16 px-4 flex flex-col items-center text-center bg-gradient-to-t from-orange-100 to-white mt-8">
        <h3 className="text-3xl md:text-4xl font-black mb-4 text-orange-600 drop-shadow-lg">PARE DE PERDER TEMPO!</h3>
        <p className="text-lg md:text-xl max-w-2xl mb-8 text-slate-700">Se você quer o Plano de 30 Dias Detalhado, o Exemplo de Script Python/FFmpeg para upload e os Templates de Edição, você precisa do nosso <b>[NOME DO PRODUTO: GUIA/CURSO]</b>.</p>
        <motion.a
          href="#"
          whileHover={{ scale: 1.07, boxShadow: "0 6px 36px #facc15cc" }}
          whileTap={{ scale: 0.96 }}
          className="inline-block px-10 py-5 bg-yellow-400 text-slate-900 font-extrabold rounded-2xl shadow-xl hover:bg-yellow-500 transition text-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          Quero Acessar o Método de Automação Agora
        </motion.a>
      </section>
    </div>
  );
}
