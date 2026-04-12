export const config = { runtime: "edge" };

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Méthode non autorisée" }), {
      status: 405, headers: { "Content-Type": "application/json" }
    });
  }

  const { email, password } = await req.json();
  if (!email || !password) {
    return new Response(JSON.stringify({ error: "Email et mot de passe requis." }), {
      status: 400, headers: { "Content-Type": "application/json" }
    });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_KEY;

  // Hash du mot de passe (simple, côté edge)
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const passwordHash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

  // Insertion dans Supabase
  const res = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Prefer": "return=representation"
    },
    body: JSON.stringify({ email, password_hash: passwordHash })
  });

  const result = await res.json();

  if (!res.ok) {
    const msg = result[0]?.message || "Erreur lors de l'inscription.";
    return new Response(JSON.stringify({ error: msg.includes("unique") ? "Cet email est déjà utilisé." : msg }), {
      status: 400, headers: { "Content-Type": "application/json" }
    });
  }

  return new Response(JSON.stringify({ success: true, user: { id: result[0].id, email: result[0].email, is_premium: false } }), {
    status: 200, headers: { "Content-Type": "application/json" }
  });
}
