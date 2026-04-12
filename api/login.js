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

  // Hash du mot de passe
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const passwordHash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

  // Recherche utilisateur
  const res = await fetch(`${SUPABASE_URL}/rest/v1/users?email=eq.${encodeURIComponent(email)}&select=*`, {
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`
    }
  });

  const users = await res.json();

  if (!users || users.length === 0) {
    return new Response(JSON.stringify({ error: "Email ou mot de passe incorrect." }), {
      status: 401, headers: { "Content-Type": "application/json" }
    });
  }

  const user = users[0];
  if (user.password_hash !== passwordHash) {
    return new Response(JSON.stringify({ error: "Email ou mot de passe incorrect." }), {
      status: 401, headers: { "Content-Type": "application/json" }
    });
  }

  // Compter les simulations du jour
  const today = new Date().toISOString().split("T")[0];
  const simRes = await fetch(
    `${SUPABASE_URL}/rest/v1/simulations?user_id=eq.${user.id}&created_at=gte.${today}T00:00:00&select=id`,
    {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`
      }
    }
  );
  const sims = await simRes.json();
  const simsToday = sims?.length || 0;

  return new Response(JSON.stringify({
    success: true,
    user: { id: user.id, email: user.email, is_premium: user.is_premium, simsToday }
  }), {
    status: 200, headers: { "Content-Type": "application/json" }
  });
}
