export const config = { runtime: "edge" };

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Méthode non autorisée" }), {
      status: 405, headers: { "Content-Type": "application/json" }
    });
  }

  const { user_id } = await req.json();
  if (!user_id) {
    return new Response(JSON.stringify({ error: "user_id requis." }), {
      status: 400, headers: { "Content-Type": "application/json" }
    });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_KEY;

  const res = await fetch(`${SUPABASE_URL}/rest/v1/simulations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Prefer": "return=minimal"
    },
    body: JSON.stringify({ user_id })
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: "Erreur enregistrement simulation." }), {
      status: 500, headers: { "Content-Type": "application/json" }
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200, headers: { "Content-Type": "application/json" }
  });
}
