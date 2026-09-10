# Remorquage Ben Arous

Site vitrine Angular 21 pré-rendu en HTML statique pour le remorquage et le dépannage automobile à Ben Arous et dans le Grand Tunis.

## Développement et vérifications

```bash
pnpm install
pnpm start
pnpm test --watch=false
pnpm build
```

Le build de production est créé dans `dist/remorquage-ben-arous/browser`. La page `/` est rendue au moment du build : son contenu, ses métadonnées et son JSON-LD sont donc disponibles sans attendre l'exécution du JavaScript dans le navigateur.

Un build serveur reste possible si une fonctionnalité dynamique est ajoutée plus tard :

```bash
pnpm build:ssr
pnpm serve:ssr:remorquage-ben-arous
```

## Configuration SEO à compléter

Toutes les informations variables sont regroupées dans `seo.config.json` :

- `siteUrl` : origine HTTPS finale, sans chemin ni slash final ;
- `googleSiteVerification` : valeur de la balise HTML fournie par Search Console, sans le code HTML complet ;
- `publicRoutes` : liste des routes publiques à inclure dans le sitemap ;
- `business.address` : adresse postale vérifiée, ou `null` ;
- `business.geo` : latitude et longitude vérifiées, ou `null` ;
- `business.sameAs` : URL officielles des profils sociaux ou de l'établissement.

Le script `scripts/generate-seo.mjs` est lancé automatiquement avant chaque build. Il produit la configuration Angular, `sitemap.xml` et `robots.txt`. Il refuse une URL non HTTPS ou comportant un chemin.

Sur Vercel, ces variables peuvent remplacer les valeurs du fichier :

- `SEO_SITE_URL` : par exemple `https://www.votre-domaine.tn` ;
- `GOOGLE_SITE_VERIFICATION` : jeton de validation HTML Google.

Si `SEO_SITE_URL` est absent, le build Vercel utilise automatiquement `VERCEL_PROJECT_PRODUCTION_URL`. Il est toutefois préférable de définir le domaine personnalisé comme URL canonique avant la mise en production finale.

## Déploiement Vercel

1. Importer le dépôt dans Vercel.
2. Laisser le framework Angular détecté. `vercel.json` configure déjà la commande `pnpm build` et le dossier public.
3. Ajouter `SEO_SITE_URL` dans **Settings > Environment Variables** avec le domaine de production final.
4. Déployer, puis contrôler `/`, `/robots.txt`, `/sitemap.xml` et `/site.webmanifest`.

Pour connecter un domaine, ouvrir **Project > Settings > Domains**, ajouter le domaine et recopier exactement les enregistrements DNS indiqués par Vercel chez le registraire. Définir une seule variante principale (`www` ou domaine nu), rediriger l'autre vers celle-ci, puis mettre cette origine dans `SEO_SITE_URL` et redéployer.

## Google Search Console

1. Ajouter une propriété **Domaine** dans Search Console et valider le TXT DNS demandé ; cette méthode couvre toutes les variantes du domaine.
2. Si la méthode **Préfixe d'URL / balise HTML** est utilisée, placer seulement la valeur du jeton dans `GOOGLE_SITE_VERIFICATION`, puis redéployer.
3. Envoyer `https://votre-domaine/sitemap.xml` dans le rapport **Sitemaps**.
4. Ouvrir **Inspection de l'URL**, tester l'URL publiée, puis cliquer sur **Demander une indexation**.

La soumission n'est pas une garantie de positionnement. Pour le référencement local, compléter aussi une fiche Google Business Profile cohérente avec le site, obtenir des avis réels et conserver le même nom, téléphone et adresse sur les annuaires locaux pertinents.
