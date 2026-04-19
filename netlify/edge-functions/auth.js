// ROSE — Basic Auth gate (Netlify Edge Function)
// Pour changer le mot de passe : édite USER et PASS ci-dessous, puis redéploie.
// Pour désactiver : supprime le bloc [[edge_functions]] dans netlify.toml (ou supprime ce fichier).

export default async (request, context) => {
  const USER = "rose";
  const PASS = "marseille2026";

  const expected = "Basic " + btoa(USER + ":" + PASS);
  const got = request.headers.get("authorization") || "";

  if (got === expected) {
    return context.next();
  }

  return new Response("Authentification requise.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="ROSE"',
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
};
