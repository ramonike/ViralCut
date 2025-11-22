import { uploadToYouTube } from "./realUpload";

/**
 * Simula upload de vídeo para YouTube/TikTok ou usa implementação real se token fornecido.
 * @param {Object} item - Dados do vídeo (title, platform, etc)
 * @param {string} [token] - Token de acesso (opcional, se presente tenta upload real)
 * @param {File} [file] - Arquivo de vídeo (necessário para upload real)
 * @returns {Promise<{status: string, url?: string, error?: string}>}
 */
export async function uploadVideo(item, token, file) {
  // Se for YouTube e tiver token e arquivo, tenta upload real
  // Mas se o token for "MOCK_TOKEN", força a simulação
  if (item.platform === "YouTube Shorts" && token && token !== "MOCK_TOKEN" && file) {
    return await uploadToYouTube({
      file: file,
      title: item.title,
      description: item.description,
      token: token
    });
  }


  // Fallback para simulação
  console.log("Simulando upload (sem token ou arquivo real)...", item);
  await new Promise((res) => setTimeout(res, 2000));

  if (Math.random() < 0.9) {
    return {
      status: "success",
      url: `https://youtube.com/shorts/${Math.random().toString(36).slice(2, 10)}`,
    };
  } else {
    return {
      status: "error",
      error: "Falha no upload simulado. Tente novamente.",
    };
  }
}
