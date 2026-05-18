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
Le projet utilise SQLite. Lors de votre première installation, le fichier de base de données local `dev.db` n'existe pas encore. 

Restez à la racine du projet et lancez cette commande :
```bash
npx prisma migrate dev
```
**Que fait cette commande ?**
1. Elle crée le fichier `dev.db`.
2. Elle construit les 7 tables du schéma relationnel.
3. Elle génère le `PrismaClient` adapté à l'environnement.
4. **Elle exécute automatiquement le script de Seed** (`prisma/seed.ts`) pour peupler la base avec le dictionnaire de mots par défaut et la liste des succès !

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

---

## 💾 Architecture de la Base de Données (Schéma Relationnel)

Le cœur de ce projet repose sur une modélisation relationnelle robuste, implémentée via Prisma. Le schéma est composé de **7 modèles distincts** qui interagissent pour garantir l'intégrité et la pertinence de l'historique de jeu.

### Les Entités Principales
1.  **User (Utilisateur)** : Stocke le profil du joueur (pseudo, email unique généré techniquement pour respecter les contraintes SQL, date d'inscription).
2.  **Word (Mot)** : Le dictionnaire du jeu. Chaque mot possède un texte (ex: "BANANE") et un indice textuel optionnel.
3.  **Category (Catégorie)** : Regroupe les mots par thèmes (ex: "Animaux", "Pays").
4.  **Difficulty (Difficulté)** : Définit les règles du jeu applicables à un mot. Elle contient le nombre d'erreurs maximum autorisées (`max_errors`) et un multiplicateur de score (`score_multiplier`).
5.  **Game (Partie)** : L'historique d'une partie jouée. C'est l'entité centrale qui "photographie" l'état du jeu au moment où il se termine (score final, statut GAGNÉ/PERDU, et nombre d'erreurs commises).
6.  **Achievement (Succès)** : Le catalogue des médailles déblocables (ex: "Sans Faute", "5 victoires"), avec leur nom, description et icône (emoji).
7.  **UserAchievement** : La table pivot (table de jonction).

### Les Relations (1:N et N:M)

#### Relations 1:N (Un-à-Plusieurs)
*   **Catégorie 1:N Mot** : Un mot appartient à une et une seule catégorie.
*   **Difficulté 1:N Mot** : Un mot est lié à une difficulté, ce qui permet au jeu de s'adapter dynamiquement aux règles de ce mot.
*   **Utilisateur 1:N Partie** : Un utilisateur possède un historique de plusieurs parties.
*   **Mot 1:N Partie** : Un même mot peut avoir été joué dans de nombreuses parties différentes.
*   *Note de conception :* La table `Game` stocke les clés étrangères de `Word` et de `Difficulty`. Cette dénormalisation (stocker la difficulté dans la partie alors qu'elle est déjà liée au mot) est volontaire : elle garantit l'immutabilité de l'historique. Si un administrateur change la difficulté d'un mot des mois plus tard, le score et le statut des anciennes parties ne seront pas rétroactivement faussés.

#### Relation N:M (Plusieurs-à-Plusieurs) : Les Succès
Un joueur peut avoir plusieurs succès, et un succès peut être possédé par plusieurs joueurs. 
Au lieu de laisser Prisma gérer cela implicitement de manière opaque, le schéma utilise la table de jonction explicite **`UserAchievement`**. 
Celle-ci possède une clé primaire composée `@@id([userId, achievementId])` garantissant qu'un joueur ne gagne pas deux fois le même succès. Elle embarque également une métadonnée (`earnedAt`) pour horodater le succès.

### Contraintes d'Intégrité (Cascade & Restrict)
*   **ON DELETE CASCADE** : La relation entre un Utilisateur et ses Parties/Succès. Si un profil est supprimé depuis le panel d'administration, SQLite détruira automatiquement tout son historique (`Game` et `UserAchievement`), évitant ainsi la présence de données orphelines.
*   **ON DELETE RESTRICT (Défaut)** : La relation entre une Catégorie et un Mot. Il est techniquement impossible de supprimer une Catégorie si celle-ci contient encore des mots. L'interface d'administration intercepte cette contrainte  pour afficher une alerte claire à l'administrateur.