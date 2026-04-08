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

    // Si la clé est absente, on le dit gentiment dans le chat au lieu de planter
    if (!apiKey) {
      return new Response(JSON.stringify({ reply: "⚠️ La clé ANTHROPIC_API_KEY n'est pas détectée dans vos paramètres Vercel." }), { status: 200 });
    }

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 512,
        messages: [{ role: "user", content: `Parcours: ${context}\n\nRéponse: ${message}` }],
      }),
    });

    const data = await response.json();

    if (data.error) {
      return new Response(JSON.stringify({ reply: "Anthropic dit : " + data.error.message }), { status: 200 });
    }

    return new Response(JSON.stringify({ reply: data.content[0].text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    // On renvoie l'erreur sous forme de message pour comprendre le blocage
    return new Response(JSON.stringify({ reply: "Erreur technique : " + err.message }), { status: 200 });
  }
}
