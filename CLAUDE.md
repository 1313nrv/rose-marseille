# CLAUDE.md — ROSE · Marseille

Brief contextuel pour Claude Code. À lire avant toute modification.

---

## Identité du projet

**ROSE** — bistronomie marseillaise, 8 rue Louis Maurel, 13006 (place Castellane, 6ᵉ arrondissement). Site vitrine statique, bilingue FR/EN. Réservations déléguées à OpenTable (`https://www.opentable.fr/r/rose-marseille`). Instagram : `@rose.castellane`. Contact : `bonjour@rose-marseille.fr` (pas de téléphone publié pour l'instant).

Produit : site statique pur, zéro dépendance, zéro build step. On édite des `.html` / `.css` / `.js` à la main et on push.

---

## Stack et contraintes

- **HTML5 sémantique**, une page par vue, pas de SPA.
- **CSS vanilla** dans `assets/css/style.css` (design tokens en `:root`, responsive mobile-first, nav inline sur toutes tailles — **pas de drawer / hamburger**).
- **JS vanilla** dans `assets/js/main.js` : year injection, URL OpenTable centralisée, shadow header au scroll, reveal via IntersectionObserver, back-to-top, validation forms. Pas de framework, pas de dépendance npm.
- **Polices self-hosted** en `.woff2` dans `assets/fonts/` : **Cormorant** (serif display) + **Inter** (sans). Préchargées dans le `<head>`.
- **Pas de cookies, pas de trackers, pas d'analytics.** C'est une promesse affichée dans le pied de page, ne pas la rompre.
- **SEO** : JSON-LD Restaurant + Menu + Event + BreadcrumbList + WebSite, OG, Twitter card, hreflang croisés.

---

## Structure des fichiers

```
/                         (racine = version FR)
├── index.html            accueil FR
├── menu.html             carte FR
├── evenements.html       événements FR
├── contact.html          contact FR
├── en/
│   ├── index.html        accueil EN
│   ├── menu.html         carte EN
│   ├── events.html       événements EN (note : events, pas evenements)
│   └── contact.html      contact EN
├── assets/
│   ├── css/style.css
│   ├── js/main.js
│   ├── fonts/            *.woff2 self-hosted
│   └── img/              logos PNG (logo-blue, logo-rose, logo-wordmark)
├── favicon.svg
├── robots.txt
├── sitemap.xml
├── site.webmanifest
└── serve.ps1             petit serveur local PowerShell pour dev
```

**Règle hreflang** : chaque page FR a son équivalent EN, reliés par `<link rel="alternate" hreflang>`. Tout changement de nom/url doit se répercuter des deux côtés + dans `sitemap.xml`.

---

## Design system

### Palette (tokens CSS en `:root`)

| Token | Valeur | Usage |
|---|---|---|
| `--c-blue-ink` | `#0E1A4E` | nuit profonde, fond des sections blues |
| `--c-blue` | `#1E3AAE` | **accent signature** (liens, boutons, accents-blue) |
| `--c-blue-2` | `#243AA0` | |
| `--c-blue-dark` | `#0A123A` | |
| `--c-rose` | `#EDA7C4` | rose de marque, sélection, accent |
| `--c-rose-soft` | `#F6D5E2` | |
| `--c-rose-deep` | `#C97FA3` | accent-rose dans le texte, hovers IG |
| `--c-ivory` | `#F5F1EA` | fond principal |
| `--c-ivory-2` | `#FBF8F2` | variante plus claire |
| `--c-sand` | `#EFE7DB` | `section--sand` (bandeau événements home + pages) |
| `--c-graphite` | `#131325` | texte principal |
| `--c-graphite-2` | `#2A2A3D` | |
| `--c-line` | `#E2D9CC` | filets |
| `--c-muted` | `#6C6C7A` | texte secondaire |

`theme-color` meta = `#1E3AAE`.

### Typographies

- **Serif display** : Cormorant (400 / 400 italic / 500 / 600). Titres h1-h4, em, event-title, brand-text.
- **Sans** : Inter (400 / 500 / 600). Corps, nav, labels, boutons.
- Échelle fluide via `clamp()` dans `--fs-xs` → `--fs-2xl`.
- Feature settings `"ss01", "cv11"` activés sur `body`.

### Accents colorés dans le texte

Dans les menus et descriptions d'événements, on colore des **mots-clés de produits** via `<span class="accent-blue">...</span>` ou `<span class="accent-rose">...</span>` (alternance rose/bleu). On ne colore **pas des phrases entières**, juste le nom du produit (poisson, légume, fromage…).

### Logo du hero (hero-mark)

- `<div class="hero-mark" aria-hidden="true"></div>` (et **non** `<img>`) en position absolute, en bas à droite des hero.
- Utilise `mask: url("../img/logo-blue.png")` pour découper un dégradé multi-couches **nacré** (rose / ivoire / sable / bleu + sheen blanc diagonal + touche lavande).
- Si tu veux modifier les reflets, joue uniquement sur les `rgba()` des radial-gradient dans la règle `.hero-mark` — pas sur le PNG.

### Composants signature

- **`.btn--ghost`** : outline beige, flèche `→` qui s'étire au hover (via `::after`).
- **`.btn--primary`** : rose vif plein, usage formulaires.
- **`.btn--dark`** : CTA « Réserver » du header, dégradé nuit.
- **`.section--blue`** : sections sombres avec radial-gradients rose/bleu + grain SVG inline (variable `--grain`).
- **`.section--sand`** : bandeaux événements.
- **`.reveal`** : opacity 0 → 1 + translateY, déclenché par IntersectionObserver. `data-delay="1|2|3"` pour stagger.
- **`.event-menu-label`** : petit titre « Menu » en caps bleu au-dessus des listes de plats d'événement.

---

## Voix éditoriale

Règles validées avec le client :

1. **« On » plutôt que « nous ».** Parole de salle, pas de brochure.
2. **Concret plutôt que poétique.** Exemples tangibles (« un anniversaire », « une allergie », « un vigneron à faire goûter ») au lieu d'abstractions (« parenthèses », « quatre mains », « service attentif »).
3. **Promesse directe.** « promis », « on vous garde une place », « on s'arrange » — pas de tournures passives ou légalistes.
4. **Courts.** Si un paragraphe a plus de deux phrases, c'est suspect. Viser la ligne, pas le bloc.
5. **Jamais de « craftsmanship »-speak.** Pas d'adjectifs empilés (« sincère et contemporaine »), pas de « bistronomie artisanale », pas de « avec soin ». On dit ce qu'on fait, on ne se décrit pas.

**Mot interdit** : « chichi » est **autorisé** (déjà validé dans H1 accueil). **Banni** : « parenthèse », « moment suspendu », « avec soin » (sauf footer legal), « living », adjectifs doublés.

Quand tu récris, d'abord simplifier, ensuite humaniser.

---

## Pages & éléments clés

### Accueil (`index.html` / `en/index.html`)
- Hero plein : eyebrow identité + H1 + lead court + deux boutons CTA ghost.
- Bandeau événements sable (repris aussi sur `evenements.html`).
- Bandeau pratique 3-colonnes (adresse / horaires / réservation).
- Section newsletter bleu nuit avec form email.

### Menu (`menu.html` / `en/menu.html`)
- Hero court + carte en 4 sections (Entrées, Plats, Desserts, Cave).
- Chaque plat : titre stylé + points de conduite `.menu-item-dots` + prix à droite.
- Note de bas de carte sur allergies.
- Section réservation finale sur fond bleu.

### Événements (`evenements.html` / `en/events.html`)
- Hero court + liste verticale de 3 événements.
- Chaque event : date (jour + mois), titre, description, parfois menu détaillé, tag.
- Bandeau pratique 3-colonnes en pied (réserver / privatisation / contact).

### Contact (`contact.html` / `en/contact.html`)
- Hero court.
- Form 2 colonnes : formulaire gauche (nom/email/sujet/message + consent) + aside droite (adresse/horaires/tel/email/OpenTable + map iframe OSM).
- Form submit est simulé (no backend) — `setTimeout` + message OK.

---

## JSON-LD

Attention à maintenir cohérent avec le HTML visible :

- **Restaurant** (home) : tél, email, prix, hours, coordonnées geo.
- **Menu** (menu page) : chaque section avec prix en EUR.
- **Event** graph (events page) : chaque événement avec startDate ISO, location, offers quand applicable.
- **BreadcrumbList** sur pages intérieures.

Si tu changes un prix ou un horaire dans le HTML, **répercute dans le JSON-LD** de la même page.

---

## Déploiement

- **GitHub** : remote `https://github.com/1313nrv/rose-marseille.git`, branche `main`.
- **Hébergement** : Cloudflare Pages / Workers, auto-deploy sur push `main` (domaine live actuel : `rose-marseille.hello-sujib.workers.dev`).
- **Ancien hébergement Netlify** : abandonné (credits épuisés). Ne pas réintroduire `netlify.toml` ni `netlify/`.
- **DNS final prévu** : `rose-marseille.fr` (présent dans canonical + JSON-LD).

Workflow standard : edit → `git add -A` → `git commit -m "…"` → `git push origin main`. Cloudflare redéploie en ~30-60s.

### Identité git locale

Si un commit échoue avec `unable to auto-detect email address`, réappliquer :
```bash
git config user.email "1313nrv@users.noreply.github.com"
git config user.name "1313nrv"
```
(**local**, pas `--global`.)

---

## Décisions structurelles à ne pas casser

- **Pas de drawer mobile.** La nav est inline sur toutes tailles via `flex-wrap` + réduction des tailles de police en media queries. Le `.nav-toggle` et `.no-scroll` ont été supprimés exprès, ne pas les ré-introduire.
- **Pas de framework CSS** (pas de Tailwind, Bootstrap, etc.). Tout passe par les tokens + classes BEM-lite existantes.
- **Pas d'analytics / trackers.** Engagement client.
- **Deux langues synchronisées.** Toute modif de copie / prix / horaire doit être faite dans les deux langues.
- **Logo hero = mask CSS, pas `<img>`.** L'effet nacré dépend de ça.
- **Lang switch header : FR · EN · IG.** L'ordre et la présence du lien Instagram dans le switch sont validés.

---

## Points de vigilance courants

- **Les HTML ont des guillemets typographiques** (`'`, `'`, `«`, `»`, `—`, etc.). Quand tu édites via sed/Edit, attention à copier l'exact caractère — les apostrophes ASCII `'` vs `'` cassent les `Edit` exact-match.
- **EOL warnings** : Git convertit LF ↔ CRLF au push (Windows). Les warnings sont OK, pas besoin de les corriger.
- **Pages ont des chemins relatifs différents** selon leur profondeur : racine utilise `assets/...`, `en/*.html` utilise `../assets/...`. Ne pas mélanger.
- **`aria-current="page"`** sur le lien nav actif de chaque page (et `aria-current="true"` sur la langue active dans le switch).
- **Liens langue croisés** : FR pointe vers `en/xxx.html`, EN pointe vers `../xxx.html` ou `/xxx.html`.

---

## Quand on change de ton

Si le client demande « trop poétique » / « trop robot » / « too much » → appliquer les 5 règles de la section **Voix éditoriale** ci-dessus. L'historique des réécritures :
- Hero accueil est passé de *« Une table marseillaise, sincère et contemporaine »* → *« Marseille à table, sans chichi »*.
- Les leads de 3 lignes ont été systématiquement réduits à 1 phrase.
- Les « privatisation, presse, proposition de vigneron·ne » remplacés par « anniversaire, allergie, vigneron à faire goûter ».

Si tu dois arbitrer, préférer **plus court** à **plus riche**.

---

## Licence / crédits

Site propriété du restaurant ROSE. Design & dev : travail itératif avec Claude. Pas de mention « Generated with Claude » dans le site (ni commentaires, ni footer).

---

*Dernière mise à jour : 2026-04-20.*
