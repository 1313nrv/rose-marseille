# ROSE — Marseille

Site statique bilingue (FR/EN) du restaurant **ROSE**, bistronomie marseillaise.
8 rue Louis Maurel, 13006 Marseille.

HTML / CSS / JS vanilla · aucune dépendance · aucun build.

---

## Structure

```
rose-marseille/
├── index.html           FR · Accueil
├── menu.html            FR · Menu
├── contact.html         FR · Contact
├── en/
│   ├── index.html       EN · Home
│   ├── menu.html        EN · Menu
│   └── contact.html     EN · Contact
├── assets/
│   ├── css/style.css    Design system complet
│   ├── js/main.js       Drawer, reveal, formulaires, back-to-top
│   ├── img/             Logos SVG
│   └── fonts/           ← Déposez ici les .woff2 (voir plus bas)
├── favicon.svg
├── robots.txt
├── sitemap.xml
└── site.webmanifest
```

## Design tokens

| Rôle      | Valeur      |
|-----------|-------------|
| Bleu      | `#1E3AAE`   |
| Rose      | `#EDA7C4`   |
| Ivoire    | `#F5F1EA`   |
| Sable     | `#EFE7DB`   |
| Graphite  | `#1A1A2E`   |
| Filet     | `#E2D9CC`   |

Typo : **Cormorant** (display) + **Inter** (sans), self-hostées en `.woff2`.

## Lancer en local

Aucun build. Un simple serveur statique suffit :

```bash
# Python
python -m http.server 8080

# Node
npx serve .
```

Puis ouvrir <http://localhost:8080/>.

## Polices — à déposer avant mise en ligne

Téléchargez les `.woff2` (Google Fonts → fontsource ou google-webfonts-helper) et placez-les dans `assets/fonts/` aux noms attendus :

```
Cormorant-Regular.woff2
Cormorant-Medium.woff2
Cormorant-SemiBold.woff2
Inter-Regular.woff2
Inter-Medium.woff2
Inter-SemiBold.woff2
```

En attendant, le CSS utilise des fallbacks système (Georgia / system-ui) — le site reste lisible.

## Logos

Les SVG dans `assets/img/` (`logo-rose.svg`, `logo-blue.svg`, `logo-wordmark.svg`) sont des vectoriels **inspirés** des PNG officiels fournis. Pour utiliser les fichiers officiels, déposez-les :

```
assets/img/logo-rose.png      → remplace logo-rose.svg (ou modifier la référence)
assets/img/logo-blue.png
assets/img/logo-wordmark.png
```

Puis remplacez les `src="assets/img/logo-rose.svg"` par `logo-rose.png` dans les pages.

## Formulaires

Le formulaire de contact et la newsletter **simulent** l’envoi (timeout + message de succès). Pour activer un vrai envoi, remplacez le bloc `setTimeout` dans `assets/js/main.js` par un `fetch()` vers votre endpoint (Formspree, Netlify Forms, backend custom).

## Centralisation de l’URL OpenTable

Tous les boutons « Réserver » utilisent `data-opentable`. L’URL est définie une seule fois dans `assets/js/main.js` :

```js
const CONFIG = {
  opentable: "https://www.opentable.fr/r/rose-marseille",
  ...
};
```

## Accessibilité

- Skip-link, focus-visible, 44 px tap targets
- `prefers-reduced-motion` respecté (reveal + scroll)
- `aria-live`, `aria-current`, `aria-expanded` sur l’interactif
- Contrastes AA sur l’ensemble de la palette

## SEO

- JSON-LD : `Restaurant`, `Menu`/`MenuSection`/`MenuItem`, `BreadcrumbList`, `WebSite`
- `hreflang` FR / EN / x-default croisé
- Canonical, OpenGraph, Twitter Card sur chaque page
- `sitemap.xml` (6 URL avec alternates) + `robots.txt`

## Pas de…

- Framework (zéro build)
- Dépendance npm
- Bannière cookies (aucun traceur)
- Analytics
- CMS

## Licence

Code : MIT. Identité visuelle, logos, textes et menus : propriété de ROSE.
