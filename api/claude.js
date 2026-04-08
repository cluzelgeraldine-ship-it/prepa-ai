export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Interdit' }), { status: 405 });
  }

  try {
    const { message, context } = await req.json();
    const apiKey = process.env.ANTHROPIC_API_KEY;

    // 1. Vérifie si la clé est présente
    if (!apiKey) {
      return new Response(JSON.stringify({ reply: "⚠️ Erreur : La clé ANTHROPIC_API_KEY est introuvable dans Vercel." }), { status: 200 });
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
        messages: [{ role: "user", content: `Contexte: ${context}\n\nQuestion: ${message}` }],
      }),
    });

    const data = await response.json();

    // 2. Vérifie si Anthropic renvoie une erreur (ex: pas de crédits)
    if (data.error) {
      return new Response(JSON.stringify({ reply: "Anthropic dit : " + data.error.message }), { status: 200 });
    }

    // 3. Succès
    return new Response(JSON.stringify({ reply: data.content[0].text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    // 4. Capture toute autre erreur technique
    return new Response(JSON.stringify({ reply: "Erreur technique : " + err.message }), { status: 200 });
  }
}
