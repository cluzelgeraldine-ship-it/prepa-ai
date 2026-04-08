export const config = { runtime: 'edge' };

export default async function handler(req) {
  try {
    const { message } = await req.json();
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 1024,
        messages: [{ role: "user", content: message }]
      }),
    });

    const data = await response.json();

    if (data.error) {
      return new Response(JSON.stringify({ reply: "Détail : " + data.error.message }), { status: 200 });
    }

    const text = data.content[0].text;
    return new Response(JSON.stringify({ reply: text }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ reply: "Erreur serveur : " + err.message }), { status: 200 });
  }
}
