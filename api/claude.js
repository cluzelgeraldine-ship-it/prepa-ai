export const config = { runtime: 'edge' };

export default async function handler(req) {
  try {
    const { message, context } = await req.json();
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307", // Le nom est correct, mais tentons la version sans date si besoin
        max_tokens: 1024,
        messages: [{ role: "user", content: `Parcours : ${context}\n\nRéponse : ${message}` }]
      }),
    });

    const data = await response.json();

    if (data.content && data.content[0]) {
      return new Response(JSON.stringify({ reply: data.content[0].text }), { status: 200 });
    }

    return new Response(JSON.stringify({ reply: "Erreur Anthropic : " + (data.error ? data.error.message : JSON.stringify(data)) }), { status: 200 });
    
  } catch (err) {
    return new Response(JSON.stringify({ reply: "Erreur technique : " + err.message }), { status: 200 });
  }
}
