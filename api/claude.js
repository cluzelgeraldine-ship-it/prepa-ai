export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Méthode non autorisée' }), { status: 405 });
  }

  try {
    const { message } = await req.json();
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ reply: "⚠️ Configuration : La clé API est manquante dans Vercel." }), { status: 200 });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 1024,
        messages: [
          { 
            role: "user", 
            content: "Tu es un jury d'examen bienveillant mais exigeant pour le Grand Oral du CRFPA. Analyse la réponse suivante et pose une question pertinente pour tester le candidat : " + message 
          }
        ],
      }),
    });

    const data = await response.json();

    // Gestion des erreurs d'Anthropic (ex: crédit en attente)
    if (data.error) {
      return new Response(JSON.stringify({ reply: "Note du jury : " + data.error.message }), { status: 200 });
    }

    // Réponse réussie
    return new Response(JSON.stringify({ reply: data.content[0].text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ reply: "Erreur technique : " + error.message }), { status: 200 });
  }
}
