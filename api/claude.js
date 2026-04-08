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
        model: "claude-3-haiku-20240307",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Contexte candidat : ${context}\n\nQuestion posée : ${message}`
              }
            ]
          }
        ],
      }),
    });

    const data = await response.json();

    // Si Anthropic renvoie une erreur
    if (data.error) {
      return new Response(JSON.stringify({ reply: "Détail technique : " + JSON.stringify(data.error.message || data.error) }), { status: 200 });
    }

    // Extraction précise du texte
    const finalReply = data.content[0].text;
    
    return new Response(JSON.stringify({ reply: finalReply }), { status: 200 });
    
  } catch (err) {
    return new Response(JSON.stringify({ reply: "Bug technique : " + err.message }), { status: 200 });
  }
}
