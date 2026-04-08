export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Méthode non autorisée' }), { status: 405 });
  }

  try {
    const { message, context } = await req.json();
    
    // Vérification de la clé API
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ reply: "Erreur : La clé API ANTHROPIC_API_KEY est manquante dans Vercel." }), { status: 200 });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 512,
        messages: [
          { role: "user", content: `Voici mon parcours : ${context}\n\nMa réponse : ${message}` }
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      return new Response(JSON.stringify({ reply: "L'IA dit : " + data.error.message }), { status: 200 });
    }

    return new Response(JSON.stringify({ reply: data.content[0].text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ reply: "Erreur technique : " + error.message }), { status: 200 });
  }
}
