export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Méthode non autorisée' }), { status: 405 });
  }

  try {
    const { message, context } = await req.json();
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ reply: "⚠️ Erreur : La clé API est manquante dans Vercel." }), { status: 200 });
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
            content: `Tu es un jury d'examen. Voici le parcours du candidat : ${context}. Analyse sa réponse et pose une question suivante : ${message}` 
          }
        ],
      }),
    });

    const data = await response.json();

    // Si Anthropic renvoie une erreur (crédits, clé, etc.)
    if (data.error) {
      return new Response(JSON.stringify({ reply: "L'IA dit : " + data.error.message }), { status: 200 });
    }

    // Réponse de Claude
    return new Response(JSON.stringify({ reply: data.content[0].text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ reply: "Erreur technique : " + error.message }), { status: 200 });
  }
}
