export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Méthode non autorisée' }), { status: 405 });
  }

  try {
    const { message, context, mode } = await req.json();
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ reply: "⚠️ Erreur : Clé API manquante dans les paramètres Vercel." }), { status: 200 });
    }

    const systemInstruction = `
      Tu es "Jury PrepAI", un expert en coaching de haute performance. 
      Ton rôle est de simuler un jury d'examen rigoureux.
      
      CONTEXTE : ${context || "Étudiant préparant un concours"}.
      MODE : ${mode || "CONCOURS"}.
      
      INSTRUCTIONS :
      - Sois académique et exigeant.
      - Pose UNE SEULE question à la fois.
      - Ne mentionne JAMAIS ton modèle technique (Claude).
    `;

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
        system: systemInstruction,
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await response.json();

    // SI L'API RENVOIE UNE ERREUR (Clé invalide, pas de crédit, etc.)
    if (data.error) {
       console.error("Erreur Anthropic:", data.error);
       return new Response(JSON.stringify({ reply: "Le jury est momentanément indisponible (Erreur API)." }), { status: 200 });
    }

    // SI TOUT VA BIEN
    return new Response(JSON.stringify({ reply: data.content[0].text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ reply: "Erreur de connexion au serveur." }), { status: 200 });
  }
}
