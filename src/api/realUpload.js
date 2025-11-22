
// =============================
// INSTRUÇÕES PARA INTEGRAÇÃO REAL
// =============================

// YOUTUBE DATA API (Shorts)
// 1. Crie um projeto no Google Cloud Console: https://console.cloud.google.com/
// 2. Ative a YouTube Data API v3.
// 3. Configure OAuth2 (Client ID, Client Secret, Redirect URI).
// 4. Use uma biblioteca OAuth2 (ex: google-auth-library, react-oauth/google, ou implemente manualmente)
// 5. O usuário faz login e autoriza o app (scope: https://www.googleapis.com/auth/youtube.upload)
// 6. Use o access_token retornado para autenticar uploads.
// 7. Faça upload multipart para https://www.googleapis.com/upload/youtube/v3/videos
//    Veja exemplo oficial: https://developers.google.com/youtube/v3/guides/uploading_a_video
//    Dica: Use FormData para enviar o arquivo e os metadados (snippet.title, snippet.description, etc).
// 8. Salve o refresh_token para uploads futuros sem novo login.

// TIKTOK API
// 1. Crie um app em https://developers.tiktok.com/console/app/
// 2. Configure OAuth2 (Client Key, Client Secret, Redirect URI).
// 3. O usuário faz login e autoriza o app (scope: video.upload, video.publish)
// 4. Use o access_token retornado para autenticar uploads.
// 5. Upload é em 2 etapas:
//    a) Inicie upload: POST https://open-api.tiktok.com/video/upload/
//    b) Envie o arquivo de vídeo (chunked ou inteiro)
//    c) Publique o vídeo: POST https://open-api.tiktok.com/video/publish/
//    Veja docs: https://developers.tiktok.com/doc/upload-video/

// DICAS GERAIS:
// - Nunca exponha client secret no frontend. Use backend para tokens sensíveis.
// - Para testes, use bibliotecas como googleapis (Node.js) ou fetch/axios com OAuth2.
// - Para React puro, use bibliotecas OAuth2 client-side (ex: react-oauth/google) para obter o token.
// - O upload real exige que o usuário esteja autenticado e forneça permissão.


/**
 * Upload real para YouTube Shorts usando YouTube Data API v3
 * @param {Object} params - { file, title, description, token }
 * @returns {Promise<{status: string, url?: string, error?: string}>}
 *
 * Passos:
 * 1. Obtenha o access_token OAuth2 do usuário (veja instruções acima).
 * 2. Crie um FormData com o arquivo e os metadados:
 *    const form = new FormData();
 *    form.append('video', file);
 *    form.append('snippet', JSON.stringify({ title, description }));
 * 3. Faça POST para:
 *    https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status
 *    Headers: Authorization: Bearer <token>
 * 4. Trate a resposta e retorne a URL do vídeo.
 */
export async function uploadToYouTube({ file, title, description, token }) {
  if (!token) {
    return { status: "error", error: "Token de acesso não fornecido. Conecte sua conta nas configurações." };
  }

  try {
    const metadata = {
      snippet: {
        title: title,
        description: description || "Uploaded via ViralCuts Dashboard",
        tags: ["shorts", "viralcuts"],
        categoryId: "22", // People & Blogs
      },
      status: {
        privacyStatus: "private", // Default to private for safety
        selfDeclaredMadeForKids: false,
      },
    };

    const form = new FormData();
    form.append(
      "snippet",
      new Blob([JSON.stringify(metadata)], { type: "application/json" })
    );
    form.append("video", file);

    const res = await fetch(
      "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("YouTube Upload Error:", data);
      return {
        status: "error",
        error: data.error?.message || "Erro desconhecido no upload para o YouTube."
      };
    }

    return {
      status: "success",
      url: `https://youtube.com/shorts/${data.id}`
    };

  } catch (error) {
    console.error("Upload Exception:", error);
    return { status: "error", error: error.message };
  }
}



/**
 * Upload real para TikTok usando TikTok API
 * @param {Object} params - { file, title, token }
 * @returns {Promise<{status: string, url?: string, error?: string}>}
 *
 * Passos:
 * 1. Obtenha o access_token OAuth2 do usuário (veja instruções acima).
 * 2. Inicie upload: POST https://open-api.tiktok.com/video/upload/
 *    Headers: Authorization: Bearer <token>
 *    Body: FormData com o arquivo de vídeo
 * 3. Publique o vídeo: POST https://open-api.tiktok.com/video/publish/
 *    Inclua o video_id retornado e os metadados (title, etc)
 * 4. Trate a resposta e retorne a URL do vídeo.
 */
export async function uploadToTikTok({ file, title, token }) {
  // Exemplo de estrutura (não funcional sem token real):
  // const form = new FormData();
  // form.append('video', file);
  // const res = await fetch('https://open-api.tiktok.com/video/upload/', {
  //   method: 'POST',
  //   headers: { Authorization: `Bearer ${token}` },
  //   body: form,
  // });
  // const data = await res.json();
  // if (data.video_id) {
  //   // Agora publique o vídeo
  //   const publishRes = await fetch('https://open-api.tiktok.com/video/publish/', {
  //     method: 'POST',
  //     headers: { Authorization: `Bearer ${token}` },
  //     body: JSON.stringify({ video_id: data.video_id, title }),
  //   });
  //   const publishData = await publishRes.json();
  //   if (publishData.share_url) return { status: 'success', url: publishData.share_url };
  //   else return { status: 'error', error: publishData.error?.message || 'Erro ao publicar' };
  // } else {
  //   return { status: 'error', error: data.error?.message || 'Erro no upload' };
  // }
  return { status: "error", error: "Função real não implementada. Veja instruções detalhadas no código." };
}
