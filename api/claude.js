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
        model: "claude-2.1",
        max_tokens: 1024,
        messages: [{ role: "user", content: `Parcours candidat : ${context}\n\nQuestion : ${message}` }]
      }),
    });

    const data = await response.json();

    if (data.content && data.content[0]) {
      return new Response(JSON.stringify({ reply: data.content[0].text }), { status: 200 });
    }

    return new Response(JSON.stringify({ reply: "Note du serveur : " + (data.error ? data.error.message : "Vérification en cours") }), { status: 200 });
    
  } catch (err) {
    return new Response(JSON.stringify({ reply: "Erreur technique : " + err.message }), { status: 200 });
  }
}
