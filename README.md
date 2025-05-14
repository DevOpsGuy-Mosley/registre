# Contenu de `README.md`

# Projet Registre

Ce projet est une application Node.js utilisant Express et MongoDB pour gérer les utilisateurs et le personnel.

## Installation

1. Clonez le dépôt :
   ```
   git clone <url-du-dépôt>
   ```
2. Accédez au répertoire du projet :
   ```
   cd registre
   ```
3. Installez les dépendances :
   ```
   npm install
   ```

## Configuration

Créez un fichier `.env` à la racine du projet et ajoutez les variables d'environnement nécessaires, par exemple :
```
MONGODB_URI=<votre-uri-mongodb>
SESSION_SECRET=<votre-secret-de-session>
PORT=3000
```

## Démarrage de l'application

Pour démarrer l'application, utilisez la commande suivante :
```
npm start
```

L'application sera accessible à l'adresse `http://localhost:3000`.

## Structure du projet

- `src/controllers` : Contient la logique métier pour les utilisateurs et le personnel.
- `src/models` : Modèles Mongoose pour les utilisateurs et le personnel.
- `src/routes` : Définit les routes de l'application.
- `src/middleware` : Middlewares personnalisés pour l'authentification et la validation.
- `src/views` : Fichiers de vue EJS pour le rendu des pages.
- `public` : Contient les fichiers statiques (CSS, JS).

## Contribuer

Les contributions sont les bienvenues ! Veuillez soumettre une demande de tirage pour toute amélioration ou correction.