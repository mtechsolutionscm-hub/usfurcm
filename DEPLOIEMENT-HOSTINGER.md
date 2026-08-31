# Déploiement USFUR sur Hostinger (frontend seul)

La base de données, l'authentification, le stockage et les fonctions restent **sur Lovable Cloud**.
Seul le frontend React/Vite est hébergé chez Hostinger.

## 1. Récupérer le code

Dans Lovable : GitHub → Connect / Export, puis clonez le dépôt localement.

## 2. Variables d'environnement

Créez un fichier `.env` à la racine (mêmes valeurs que dans Lovable, ce sont des clés publiques) :

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
VITE_SUPABASE_PROJECT_ID=...
```

Ces valeurs sont injectées **au moment du build** : il faut donc rebuilder après tout changement.

## 3. Build

```bash
npm install
npm run build
```

Le dossier `dist/` est généré. Il contient déjà le fichier `.htaccess` (copié depuis `public/`).

## 4. Upload sur Hostinger

hPanel → Gestionnaire de fichiers → `public_html/`

- Videz `public_html/` (sauf éventuels fichiers de vérification de domaine).
- Envoyez **tout le contenu de `dist/`** (pas le dossier `dist` lui-même).
- Vérifiez que `.htaccess` est bien présent (activez « afficher les fichiers cachés »).

Alternative FTP :

```bash
# exemple avec lftp
lftp -u UTILISATEUR,MOTDEPASSE ftp.usfurcm.com \
  -e "mirror -R --delete dist/ public_html/; quit"
```

## 5. Domaine et SSL

- Dans hPanel, pointez `usfurcm.com` et `www.usfurcm.com` vers l'hébergement.
- DNS chez Hostinger : enregistrement A vers l'IP de votre plan (visible dans hPanel).
- Activez le SSL gratuit (Let's Encrypt) dans hPanel → SSL.
- Attendez la propagation DNS (jusqu'à 24 h).

## 6. Configuration du backend Lovable Cloud

Dans les réglages d'authentification du backend, ajoutez les URL du nouveau domaine :

- Site URL : `https://usfurcm.com`
- Redirect URLs : `https://usfurcm.com/**`, `https://www.usfurcm.com/**`

Sans cela, la connexion et les redirections OAuth échoueront.

## 7. Mises à jour futures

À chaque modification faite dans Lovable :

1. `git pull`
2. `npm run build`
3. Ré-uploader `dist/` dans `public_html/`

## Points de vigilance

- Ne jamais mettre la clé `service_role` dans le frontend.
- Les Edge Functions continuent de tourner sur Lovable Cloud : rien à déployer chez Hostinger.
- Si une page renvoie une erreur 404 après rafraîchissement, c'est que `.htaccess` est absent.
