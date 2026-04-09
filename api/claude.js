export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Méthode non autorisée" }),
      {
        status: 405,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const body = await req.json();
    const { message, context, mode } = body;

    // Validation minimale du message
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Le champ 'message' est requis." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          reply: "⚠️ Erreur : Clé API manquante dans les paramètres Vercel.",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const systemInstruction = `
Tu es "Jury PrepAI", un expert en coaching de haute performance.
Ton rôle est de simuler un jury d'examen rigoureux.

CONTEXTE : ${context || "Étudiant préparant un concours"}.
MODE : ${mode || "CONCOURS"}.

INSTRUCTIONS :
- Sois académique et exigeant.
- Pose UNE SEULE question à la fois.
- Ne mentionne JAMAIS ton modèle technique (Claude, LLM, etc.).
- Réponds en français, de manière claire et structurée.
    `.trim();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20240620", // ou autre modèle disponible
        max_tokens: 1024,
        system: systemInstruction,
        messages: [{ role: "user", content: message.trim() }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Anthropic error:", data);
      return new Response(
        JSON.stringify({
          reply: "Le jury est momentanément indisponible (Erreur API).",
          details: data,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const reply =
      data.content?.[0]?.text ||
      "Aucune réponse générée par le jury.";

    return new Response(
      JSON.stringify({ reply }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ reply: "Erreur de connexion au serveur." }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
