export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Méthode non autorisée" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await req.json();
    const { messages, subject, context, mode } = body;

    // Validation
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Le champ 'messages' est requis." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ reply: "⚠️ Erreur : Clé API manquante dans les paramètres Vercel." }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const subjectLine = subject ? `\nSUJET DE L'EXPOSÉ : "${subject}"` : "";
    const shouldScore = messages.filter(m => m.role === "user").length % 3 === 0;

    const systemInstruction = `
Tu es un jury de Grand Oral du Baccalauréat français, composé de deux examinateurs bienveillants mais exigeants.
Tu simules un entretien oral de 20 minutes.
CONTEXTE : ${context || "Étudiant préparant le Grand Oral du Baccalauréat"}.
MODE : ${mode || "GRAND ORAL"}.${subjectLine}

INSTRUCTIONS :
- Sois académique, rigoureux, mais accessible.
- Pose UNE SEULE question à la fois, courte et précise.
- Challenge l'étudiant avec des contre-arguments ou demandes d'approfondissement.
- Évalue la clarté, la rigueur intellectuelle, la culture générale, et la capacité à défendre ses idées.
- Réponds en français uniquement.
- Ne mentionne JAMAIS ton modèle technique (Claude, LLM, IA, etc.).
- Ne donne jamais la réponse à la place de l'étudiant.
${shouldScore ? `
IMPORTANT : À la fin de ta réponse, ajoute impérativement ce bloc JSON (sans backticks) :
{"scores": {"argumentation": X, "clarté": X, "culture": X, "aisance": X}}
(X entre 0 et 20, basé sur les échanges précédents)
` : ""}
    `.trim();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        system: systemInstruction,
        messages: messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Anthropic error:", data);
      return new Response(
        JSON.stringify({ reply: "Le jury est momentanément indisponible (Erreur API).", details: data }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const reply = data.content?.[0]?.text || "Aucune réponse générée par le jury.";

    return new Response(
      JSON.stringify({ reply }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ reply: "Erreur de connexion au serveur." }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }
}
