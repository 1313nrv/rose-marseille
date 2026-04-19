// ROSE — Basic Auth gate (Netlify Edge Function)
// Pour changer le mot de passe : édite USER et PASS ci-dessous, puis redéploie.
// Pour désactiver le mot de passe plus tard : supprime le bloc [[edge_functions]]
// dans netlify.toml (ou supprime ce fichier).

const USER = "rose";
const PASS = "marseille2026"; // ← à modifier avant déploiement

export default async (request, context) => {
  const url = new URL(request.url);

  // On laisse passer les fichiers statiques nécessaires à la page d'auth
  // (le navigateur ne les charge pas avant l'auth, mais au cas où).
  const expected = "Basic " + btoa(USER + ":" + PASS);
  const got = request.headers.get("authorization");

  if (got === expected) {
    // Auth ok, on laisse passer la requête vers la ressource statique.
    return;
  }

  return new Response("Accès restreint — identifiants requis.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="ROSE — accès privé", charset="UTF-8"',
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
};

export const config = { path: "/*" };
