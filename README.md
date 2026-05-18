
# Jeu du Pendu SGBD - Projet Évaluation

Ce projet est une application de bureau complète (Jeu du Pendu)

## 🛠️ Stack Technique
*   **Framework Principal :** Electron (Desktop App)
*   **Base de données :** SQLite (Fichier local `dev.db`)
*   **ORM :** Prisma v7 (avec l'adaptateur `better-sqlite3` pour Electron 30)
*   **Frontend :** Angular 18 (Standalone Components, Signals, Control Flow, Folder by Feature)
*   **Langage :** TypeScript (Typage strict de bout en bout)

## 🚀 Instructions d'Installation et de Lancement

### Prérequis
Assurez-vous d'avoir installé **Node.js** (LTS) et **npm** sur votre machine.

### 1. Installation des dépendances
Ouvrez un terminal à la racine du projet et installez les dépendances du Backend :
```bash
npm install
```

Ensuite, installez les dépendances du Frontend Angular :
```bash
cd src/renderer
npm install
cd ../..
```

### 2. Recompilation du module Natif
Le projet utilise `better-sqlite3` (code C++). Pour qu'il fonctionne dans Electron, il doit être recompilé spécifiquement pour la version de Node embarquée dans Electron :
```bash
npx @electron/rebuild -f -w better-sqlite3
```
*Attendez la fin de la compilation du module.*

### 3. Initialisation de la Base de Données (Prisma)
Générez le client TypeScript et créez la base de données locale avec ses tables :
```bash
npx prisma generate
npx prisma migrate dev
```
**Note :** Cette commande va également lancer automatiquement le script de **Seed** (`prisma/seed.ts`) pour remplir le dictionnaire de mots et la liste des succès.

### 4. Démarrage de l'Application
Il faut lancer deux processus en parallèle dans deux terminaux différents.

**Terminal 1 (Le serveur de développement Angular) :**
```bash
cd src/renderer
npm start
```
*Attendez le message "Application bundle generation complete."*

**Terminal 2 (L'application Electron) :**
Ouvrez un second terminal à la racine du projet et lancez Electron :
```bash
npm start
```

---

## 💾 Architecture de la Base de Données (Schéma Relationnel)

Le cœur de ce projet repose sur une modélisation relationnelle robuste composée de **7 modèles distincts** :

### Les Entités Principales
1.  **User (Utilisateur)** : Profil du joueur (pseudo, email unique technique).
2.  **Word (Mot)** : Le dictionnaire du jeu (texte + indice optionnel).
3.  **Category (Catégorie)** : Regroupe les mots par thèmes.
4.  **Difficulty (Difficulté)** : Définit les règles (`max_errors`) et les récompenses (`score_multiplier`).
5.  **Game (Partie)** : Historique qui "photographie" l'état final d'un jeu (score, statut, erreurs).
6.  **Achievement (Succès)** : Le catalogue des médailles déblocables.
7.  **UserAchievement** : Table de jonction N:M explicite entre Users et Achievements.

### Points Clés de Conception
*   **Intégrité Historique** : La table `Game` stocke les clés étrangères de `Word` et de `Difficulty`. Cette dénormalisation est volontaire pour figer la difficulté dans le temps (si l'admin change la difficulté d'un mot plus tard, l'historique des anciennes parties reste juste).
*   **Relation N:M Explicite** : Utilisation d'une table pivot `UserAchievement` avec clé primaire composée `@@id([userId, achievementId])` pour garantir l'unicité des succès par joueur.
*   **Contraintes SQL** : Gestion du **ON DELETE CASCADE** (sur User) et du **ON DELETE RESTRICT** (sur Category) pour prouver la maîtrise des règles d'intégrité référentielle.

---

## 🌊 Flux de Données (Clean Architecture)
L'application respecte une séparation stricte des responsabilités :
*   **Frontend** : Découpé en composants "Dumb" (Vue) et Services "Smart" (Logique métier).
*   **Services** : Divisés par domaine (`AuthService`, `DictionaryService`, `GameService`).
*   **Pont (Preload)** : Tunnel IPC sécurisé via `contextBridge`.
*   **Backend** : Seul processus autorisé à manipuler Prisma et SQLite.