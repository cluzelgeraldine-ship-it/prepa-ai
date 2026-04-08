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
      return new Response(JSON.stringify({ reply: "⚠️ Erreur : Clé API non configurée sur Vercel." }), { status: 200 });
    }

    // SYSTEM PROMPT : L'intelligence adaptative de votre start-up
    const systemInstruction = `
      Tu es "Jury PrepAI", une intelligence artificielle experte en coaching de haute performance. 
      Ton rôle est de simuler des jurys d'examens ou des recruteurs en entreprise.

      MODES D'ADAPTATION :
      1. SI MODE "CONCOURS" (ex: CRFPA Paris 2) : Sois académique, rigoureux et teste les connaissances théoriques ainsi que la déontologie. [cite: 2026-03-22]
      2. SI MODE "ENTRETIEN EMBAUCHE" : Adopte une posture de recruteur (RH ou Manager). Pose des questions comportementales, teste les compétences techniques et utilise la méthode STAR pour évaluer le candidat.
      
      INSTRUCTIONS DE JEU :
      - Analyse le parcours fourni : ${context || "Non spécifié"}.
      - Pose UNE SEULE question à la fois.
      - Si la réponse du candidat est trop courte, demande des précisions.
      - Sois exigeant mais constructif pour justifier la valeur de l'abonnement Pro.
    `;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20240620", // Le modèle le plus performant pour votre business
        max_tokens: 1024,
        system: systemInstruction,
        messages: [
          { role: "user", content: message }
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      return new Response(JSON.stringify({ reply: "Note du jury : " + data.error.message }), { status: 200 });
    }

    return new Response(JSON.stringify({ reply: data.content[0].text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ reply: "Erreur technique : " + error.message }), { status: 200 });
  }
}
