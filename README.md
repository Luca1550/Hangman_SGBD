# Jeu du Pendu SGBD - Projet Évaluation

Ce projet est une application de bureau complète (Jeu du Pendu)

## 🛠️ Stack Technique
*   **Framework Principal :** Electron (Desktop App)
*   **Base de données :** SQLite (Fichier local)
*   **ORM :** Prisma v7 (avec l'adaptateur `@libsql/client` pour la compatibilité native)
*   **Frontend :** Angular 18 (Standalone Components, Signals, Control Flow)
*   **Langage :** TypeScript (Typage strict de bout en bout)

## 🚀 Instructions d'Installation et de Lancement

### Prérequis
Assurez-vous d'avoir installé **Node.js** (LTS) et **npm** sur votre machine.

### 1. Installation des dépendances
Ouvrez un terminal à la racine du projet et exécutez la commande suivante pour installer toutes les librairies requises (Electron, Prisma, etc.) :
```bash
npm install
```

Ensuite, placez-vous dans le sous-dossier `src/renderer` pour installer les dépendances spécifiques à Angular :
```bash
cd src/renderer
npm install
cd ../..
```

### 2. Initialisation de la Base de Données (Prisma)
Le projet utilise SQLite. Pour créer le fichier de base de données `dev.db` et y injecter les données de départ (les mots, les catégories, les difficultés et la liste des succès), restez à la racine du projet et lancez le script de "Seed" :
```bash
npx prisma db seed
```
*(Si le fichier `dev.db` n'existe pas, vous pouvez utiliser la commande `npx prisma migrate dev` pour le générer avant de faire le seed).*

### 3. Démarrage de l'Application
L'architecture sépare le Frontend (Angular) du Backend (Electron). Il faut donc lancer deux processus en parallèle.

**Terminal 1 (Le serveur de développement Angular) :**
Ouvrez un terminal dans le dossier Angular et lancez le serveur :
```bash
cd src/renderer
npm start
```
*Attendez que le terminal affiche "Application bundle generation complete."*

**Terminal 2 (L'application Electron) :**
Ouvrez un second terminal à la racine du projet (là où se trouve ce README) et lancez Electron :
```bash
npm start
```
La fenêtre du jeu va s'ouvrir automatiquement !
