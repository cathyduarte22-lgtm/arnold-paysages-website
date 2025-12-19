# Arnold Paysages - Configuration Netlify

## Structure du projet

```
/maintenance/           → Page de maintenance (publique)
  └── index.html
/site/                  → Site complet (en développement)
  ├── index.html
  ├── realisations.html
  ├── a-propos.html
  ├── avis.html
  ├── contact.html
  └── css/
      └── style.css
netlify.toml           → Configuration Netlify
```

## Configuration actuelle

- **Branche main** : affiche la page de maintenance sur le domaine principal
- **Branches dev/production** : affichent le site complet en preview

## Instructions de configuration Netlify

### 1. Activer les Branch Deploys

1. Dans le dashboard Netlify, allez dans **Site configuration** > **Build & deploy** > **Branches and deploy contexts**
2. Sous **Branch deploys**, sélectionnez **All** ou ajoutez les branches `dev` et `production`

### 2. Accéder aux previews du site complet

Créez une branche de développement :

```bash
git checkout -b dev
git push origin dev
```

Le site complet sera accessible à :
- `https://dev--arnold-paysages.netlify.app`

### 3. Activer le site final (fin de maintenance)

**Option A : Modifier netlify.toml**

Dans `netlify.toml`, changez :
```toml
[build]
  publish = "site"
```

**Option B : Utiliser le Split Testing Netlify**

1. Allez dans **Site configuration** > **Build & deploy** > **Split Testing**
2. Activez le split testing entre la branche `main` et `production`
3. Dirigez 100% du trafic vers la branche `production`

### 4. Workflow recommandé

1. **Pendant le développement** :
   - Le domaine principal (`arnold-paysages.netlify.app`) affiche la page de maintenance
   - Travaillez sur la branche `dev` ou `production`
   - Prévisualisez à `https://dev--arnold-paysages.netlify.app`

2. **Pour la mise en production** :
   - Modifiez `publish = "site"` dans `netlify.toml`
   - Committez et poussez sur `main`
   - Le site complet sera maintenant visible publiquement

## Couleurs du site

- Vert principal : `#294a23`
- Beige clair : `#f3f4f1`
- Marron accent : `#55381d`
- Vert secondaire : `#165c2a`
