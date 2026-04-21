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
- **Polices** : **Fraunces** (display serif, titres, italiques), **Crimson Pro** (serif texte long éventuel), **Caveat** (script, petits accents seulement) servies par **Google Fonts** ; **Inter** (sans) auto-hébergée en `.woff2` dans `assets/fonts/`. Google Fonts casse légèrement la promesse « sans cookies ni traceurs » côté réseau (requêtes cross-origin) — à assumer ou à réinternaliser plus tard si besoin.
- **Pas de cookies, pas de trackers, pas d'analytics** côté app. C'est une promesse affichée dans le pied de page, ne pas la rompre.
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
│   ├── fonts/            Inter-*.woff2 self-hosted
│   └── img/              logos PNG (logo-rose, logo-blue, logo-wordmark, logo-combo-pink)
├── favicon.svg
├── robots.txt
├── sitemap.xml
├── site.webmanifest
└── serve.ps1             petit serveur local PowerShell pour dev
```

**Règle hreflang** : chaque page FR a son équivalent EN, reliés par `<link rel="alternate" hreflang>`. Tout changement de nom/url doit se répercuter des deux côtés + dans `sitemap.xml`.

---

## Design system (DA validée, version Mix)

### Palette (tokens CSS en `:root`)

| Token | Valeur | Usage |
|---|---|---|
| `--c-navy` | `#1B2A5E` | bleu nuit signature — hero, sections sombres, theme-color |
| `--c-navy-deep` | `#14204A` | bleu plus profond, bandeaux « practical » |
| `--c-navy-soft` | `#2A3C7A` | variantes liens/hover |
| `--c-ink` | `#1B2350` | texte principal sur fond clair |
| `--c-ink-soft` | `#4B5478` | texte secondaire |
| `--c-pink` | `#F5A8C8` | rose de marque (hero-mark, accents clairs) |
| `--c-pink-deep` | `#EE7AA8` | rose plus dense (accents texte, filets menu-card) |
| `--c-pink-soft` | `#F8C5D7` | pastels |
| `--c-cream` | `#EEE7DA` | fond principal crème |
| `--c-cream-deep` | `#E6DECB` | sous-fonds |
| `--c-paper` | `#F2ECE0` | papier (footer-card) |
| `--c-white` | `#FFFCF6` | blanc cassé |

Alias de compat (`--c-blue` = `--c-ink`, `--c-rose` = `--c-pink`, etc.) conservés pour éviter de tout casser ; privilégier les nouveaux tokens pour toute nouvelle règle.

`theme-color` meta = `#1B2A5E`.

### Typographies

- **Display** : **Fraunces** (300 / 400 / 500, italic inclus, opsz fluide). Titres h1-h4, `em`, event-title, eyebrow serif.
- **Serif texte** : **Crimson Pro** (400 / 500, italic). Utilisé pour de la copie « lettre » si besoin.
- **Script** : **Caveat** (400 / 600). **Petits accents seulement** — signatures, micro-notes en pied, jamais de titres ni de paragraphes complets.
- **Sans** : **Inter** (400 / 500 / 600). Corps, nav, labels, boutons.
- Échelle fluide via `clamp()` dans `--fs-xs` → `--fs-2xl`.
- Feature settings `"ss01", "cv11"` activés sur `body`.

### Règles d'italique
- Fraunces italic est réservée aux **mots-clés de ligne** (ex : *mémoire*, *à la table de Rose*, *courte*). Un ou deux mots par titre, pas plus.
- L'italique est teintée en rose (`--c-pink`) dans la CSS : ne pas surcharger.

### Accents colorés dans le texte

Dans les menus et descriptions d'événements, on colore des **mots-clés de produits** via `<span class="accent-blue">...</span>` ou `<span class="accent-rose">...</span>` (alternance rose/bleu). On ne colore **pas des phrases entières**, juste le nom du produit (poisson, légume, fromage…).

### Composants signature

- **`.btn--primary`** : **pill rose** plein (`border-radius: 999px`), hover assombrit.
- **`.btn--ghost`** : outline beige sur fond clair, même pill rayon.
- **`.btn--dark`** : pill navy, CTA « Réserver » du header.
- **`.hero-mark`** : `<div aria-hidden>` en bas à droite du hero, masque PNG (`logo-rose.png`) rempli par un dégradé rose nacré. **Pas** de `<img>`, l'effet dépend du `mask`.
- **`.section--navy-deep`** : bandeaux sombres (practical home, réservation menu), opacité grain léger.
- **Cards / encarts** : `border-radius: 18px` (`--radius-lg`), ombre portée douce, pas de gradients hors hero.
- **Champs de form** : `border-radius: 12px` (`--radius-md`).
- **`.footer-card`** : fiche « papier » crème, `transform: rotate(-0.4deg)`, ombre double discrète — signature de fin de page.
- **`.ghost-letter`** : énorme `R` Fraunces italique (`clamp(14rem, 32vw, 26rem)`), opacity 0.08, positionné en absolu dans les sections sombres.
- **`.reveal`** : opacity 0 → 1 + translateY, déclenché par IntersectionObserver. `data-delay="1|2|3"` pour stagger.
- **`.event-menu-label`** + **`.event-menu-card`** : carte menu d'événement avec filet supérieur rose (`border-top: 2px solid var(--c-pink-deep)`).

### Interdits DA
- Pas de gradient hors `.hero` / `.hero-mark`.
- Pas d'emoji dans le site (ni copy ni UI).
- Pas de `border-left` coloré comme accent de carte.
- Pas de hover « underline avec couleur saturée ».
- Pas de Caveat dans les titres ou paragraphes — micro-accents uniquement.

---

## Voix éditoriale

Règles validées avec le client :

1. **« On » plutôt que « nous ».** Parole de salle, pas de brochure.
2. **Concret plutôt que poétique.** Exemples tangibles (« un anniversaire », « une allergie », « un vigneron à faire goûter ») au lieu d'abstractions.
3. **Promesse directe.** « promis », « on vous garde une place », « on s'arrange ».
4. **Courts.** Si un paragraphe a plus de deux phrases, c'est suspect. Viser la ligne, pas le bloc.
5. **Jamais de « craftsmanship »-speak.** Pas d'adjectifs empilés, pas de « bistronomie artisanale », pas de « avec soin » (sauf footer legal).
6. **Pas de nom de chef.** On parle « en mémoire de Rose », « une cuisine guidée par la saison » — jamais « le chef Untel ». ROSE est un prénom choisi, une façon de cuisiner.

**Banni** : « parenthèse », « moment suspendu », « avec soin » (sauf footer), « living », adjectifs doublés.

Quand tu récris, d'abord simplifier, ensuite humaniser.

---

## Pages & éléments clés

### Accueil (`index.html` / `en/index.html`)
- Hero plein navy : eyebrow + H1 (« Une cuisine simple, *mémoire* de Rose. » / « Simple cooking, *in memory* of Rose. ») + lead court + 2 CTA (primary + ghost).
- Section **signature** : 2-col, texte gauche (« Un prénom, une façon de cuisiner. ») + card droite avec 3 items (carte courte / cave vivante / table qu'on revient).
- **Info-band** 4-col : Le chef (générique, pas de nom) · Adresse · Table (Mardi→Samedi) · Instagram.
- Section **events** : 3 événements en 3-col (date / contenu / menu-card).
- Section **practical** navy-deep avec ghost-letter R.

### Menu (`menu.html` / `en/menu.html`)
- Hero court navy + carte en 4 sections (Entrées / Plats / Desserts / Cave).
- Chaque plat : `.menu-item-head` flex (name + dots + prix) + `.menu-item-desc` en dessous.
- Note de bas de carte sur allergies.
- Section réservation finale `.section--navy-deep` avec `btn--primary`.

### Événements (`evenements.html` / `en/events.html`)
- Hero court navy + liste verticale de 3 événements.
- Chaque event : 3-col `160px 1.2fr 1fr` → bloc date (day / month / time) · bloc contenu (title / sub / desc / location / CTA) · `event-menu-card`.
- Section practical 3-col en pied (réserver / privatisation / contact).

### Contact (`contact.html` / `en/contact.html`)
- Hero court navy.
- Grid 2-col : formulaire gauche (nom/email/sujet/message + consent) + aside droite (adresse / horaires / email / OpenTable + map iframe OSM). **Pas de téléphone.**
- Form submit simulé (no backend).

### Footer (toutes pages)
- `.footer-card` papier crème, `rotate(-0.4deg)`, wordmark en haut, tag « Bistronomie marseillaise » / « Marseille bistronomy », 3-col (Venir / Écrire / Suivre), ligne legal + micro-accent Caveat.

---

## Horaires officiels (alignés DA)

- **Mardi → Vendredi** : 12h–14h · 19h30–22h
- **Samedi soir** : 19h30–22h30
- **Fermé dimanche et lundi**

Répercutés dans : `index.html`/`en/index.html` JSON-LD Restaurant + info-band, `contact.html`/`en/contact.html` aside. Toute modif doit passer par les 4 endroits.

---

## JSON-LD

Attention à maintenir cohérent avec le HTML visible :

- **Restaurant** (home) : email, prix, hours (Tue-Sat), coordonnées geo. **Pas de `telephone`.**
- **Menu** (menu page) : chaque section avec prix en EUR.
- **Event** graph (events page) : chaque événement avec startDate ISO, location, offers quand applicable.
- **BreadcrumbList** sur pages intérieures.

Si tu changes un prix ou un horaire dans le HTML, **répercute dans le JSON-LD** de la même page.

---

## Déploiement

- **GitHub** : remote `https://github.com/1313nrv/rose-marseille.git`, branche `main`.
- **Hébergement** : Cloudflare Pages / Workers, auto-deploy sur push `main`.
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
- **Lang switch dans `.header-cta`.** Ordre header-cta : `lang-switch` · `ig-link` · `btn--dark Réserver`. Ne pas fusionner avec la nav primaire.
- **Pas de téléphone.** Tant que pas de numéro officiel, aucune référence (header, footer, JSON-LD, main.js CONFIG).
- **Pas de nom de chef.** Le chef reste anonyme dans la copie — « mémoire de Rose », « cuisine guidée par la saison ».

---

## Points de vigilance courants

- **Les HTML ont des guillemets typographiques** (`'`, `'`, `«`, `»`, `—`, etc.). Quand tu édites via Edit, attention à copier l'exact caractère — les apostrophes ASCII `'` vs `'` cassent les `Edit` exact-match.
- **EOL warnings** : Git convertit LF ↔ CRLF au push (Windows). Les warnings sont OK, pas besoin de les corriger.
- **Pages ont des chemins relatifs différents** selon leur profondeur : racine utilise `assets/...`, `en/*.html` utilise `../assets/...`. Ne pas mélanger.
- **`aria-current="page"`** sur le lien nav actif de chaque page (et `aria-current="true"` sur la langue active dans le switch).
- **Liens langue croisés** : FR pointe vers `en/xxx.html`, EN pointe vers `/xxx.html` ou `../xxx.html`.

---

## Quand on change de ton

Si le client demande « trop poétique » / « trop robot » / « too much » → appliquer les 6 règles de la section **Voix éditoriale** ci-dessus. Si tu dois arbitrer, préférer **plus court** à **plus riche**.

---

## Licence / crédits

Site propriété du restaurant ROSE. Design & dev : travail itératif avec Claude. Pas de mention « Generated with Claude » dans le site (ni commentaires, ni footer).

---

*Dernière mise à jour : 2026-04-21 — déploiement DA (palette navy/pink/cream, Fraunces/Crimson Pro/Caveat, cards radius 18, pill buttons).*
