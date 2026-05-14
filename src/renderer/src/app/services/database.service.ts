import { Injectable, signal, computed, effect } from '@angular/core';
import { Category, Word, User, Difficulty, UserHistory, UserAchievement, Achievement } from '../models/types';

// 1. On explique à TypeScript que notre Preload a ajouté "electronAPI" à l'objet window
declare global {
  interface Window {
    electronAPI: {
      getCategories: () => Promise<Category[]>;
      getRandomWord: () => Promise<Word>;
      loginUser: (pseudo: string) => Promise<User>;
      saveGame: (data: any) => Promise<any>;
      getPlayerHistory: (userId: number) => Promise<UserHistory>;
      getUsers: () => Promise<User[]>;
      getUserAchievements: (userId: number) => Promise<UserAchievement[]>;
      deleteUser: (userId: number) => Promise<boolean>;
      getWords: () => Promise<Word[]>;
      addWord: (data: any) => Promise<Word>;
      updateWord: (data: any) => Promise<Word>;
      deleteWord: (id: number) => Promise<boolean>;
      getDifficulties: () => Promise<Difficulty[]>;
      addCategory: (name: string) => Promise<Category>;
      deleteCategory: (id: number) => Promise<{success: boolean, message?: string}>;
    }
  }
}

// 2. On crée le Service Angular
@Injectable({
  providedIn: 'root' // (Singleton injecté à la racine)
})
export class DatabaseService {
  
  // 3. On utilise des Signals pour stocker nos données typées
  categories = signal<Category[]>([]);
  currentWord = signal<Word | null>(null); // Pour stocker le mot de la partie en cours
  guessedLetters = signal<string[]>([]); // Mémoire des lettres jouées
  currentUser = signal<User | null>(null); // Pour savoir qui joue
  newAchievements = signal<Achievement[]>([]); // Pour afficher les notifications de succès

  // 4. EXIGENCE PDF : computed()
  // Recalcule le nombre d'erreurs automatiquement si le mot ou les lettres jouées changent
  errorCount = computed(() => {
    const word = this.currentWord();
    const guesses = this.guessedLetters();
    if (!word) return 0;
    
    // Compte le nombre de lettres devinées qui ne sont pas dans le mot
    return guesses.filter(letter => !word.text.includes(letter)).length;
  });

  // Nouveau statut calculé dynamiquement !
  gameStatus = computed(() => {
    const word = this.currentWord();
    if (!word) return 'ATTENTE';

    const errors = this.errorCount();
    if (errors >= 7) return 'PERDU'; // 7 erreurs maximum

    const guesses = this.guessedLetters();
    // Le jeu est gagné si toutes les lettres du mot ont été cliquées
    const isWon = word.text.split('').every((letter: string) => guesses.includes(letter));
    
    if (isWon) return 'GAGNE';
    return 'EN_COURS';
  });

  constructor() {
    // EXIGENCE PDF BONUS : effect()
    // Ce code s'exécute silencieusement en arrière-plan à chaque fois que le Signal "gameStatus" change
    effect(() => {
      const status = this.gameStatus();
      if (status === 'GAGNE' || status === 'PERDU') {
        this.saveCurrentGame(status);
      }
    });
  }

  async saveCurrentGame(status: string) {
    const user = this.currentUser();
    const word = this.currentWord();
    if (!user || !word) return;

    // Calcul du score simple : 100 points - 10 points par erreur si gagné.
    const score = status === 'GAGNE' ? 100 - (this.errorCount() * 10) : 0;

    const result = await window.electronAPI.saveGame({
      userId: user.id,
      wordId: word.id,
      difficultyId: word.difficultyId,
      errors_count: this.errorCount(),
      status: status,
      score: score
    });

    if (result && result.newAchievements && result.newAchievements.length > 0) {
      this.newAchievements.set(result.newAchievements);
    }
    
    console.log("Partie sauvegardée dans la DB ! Status:", status);
  }

  // 5. Les fonctions qui appellent le backend
  async login(pseudo: string) {
    try {
      const user = await window.electronAPI.loginUser(pseudo);
      this.currentUser.set(user);
      return user; // On renvoie l'utilisateur pour que la page sache que c'est bon
    } catch (error) {
      console.error("Erreur login :", error);
      return null;
    }
  }

  async getHistory(userId: number) {
    try {
      return await window.electronAPI.getPlayerHistory(userId);
    } catch (error) {
      console.error("Erreur historique :", error);
      return null;
    }
  }

  async getAllUsers() {
    try {
      return await window.electronAPI.getUsers();
    } catch (error) {
      console.error("Erreur récupération utilisateurs :", error);
      return [];
    }
  }

  async getUserAchievements(userId: number) {
    try {
      return await window.electronAPI.getUserAchievements(userId);
    } catch (error) {
      console.error("Erreur récupération succès :", error);
      return [];
    }
  }

  async deleteUser(userId: number) {
    try {
      return await window.electronAPI.deleteUser(userId);
    } catch (error) {
      console.error("Erreur suppression :", error);
      return false;
    }
  }

  // --- CRUD Mots ---
  async getWords() {
    return await window.electronAPI.getWords();
  }
  async addWord(data: any) {
    return await window.electronAPI.addWord(data);
  }
  async updateWord(data: any) {
    return await window.electronAPI.updateWord(data);
  }
  async deleteWord(id: number) {
    return await window.electronAPI.deleteWord(id);
  }
  async getDifficulties() {
    return await window.electronAPI.getDifficulties();
  }

  async addCategory(name: string) {
    try {
      return await window.electronAPI.addCategory(name);
    } catch (error) {
      console.error("Erreur création catégorie :", error);
      return null;
    }
  }

  async deleteCategory(id: number) {
    return await window.electronAPI.deleteCategory(id);
  }

  async loadCategories() {
    try {
      // vers le preload
      const data = await window.electronAPI.getCategories();
      //MAJ de ce qui est reçu
      this.categories.set(data);
    } catch (error) {
      console.error("Erreur catégories :", error);
    }
  }

  async startNewGame() {
    try {
      const word = await window.electronAPI.getRandomWord();
      this.currentWord.set(word);
      this.guessedLetters.set([]); // Réinitialiser les lettres pour la nouvelle partie
      this.newAchievements.set([]); // Réinitialiser les nouveaux succès
      console.log("Nouveau mot tiré au sort :", word);
    } catch (error) {
      console.error("Erreur tirage mot :", error);
    }
  }

  // 6. Action de jeu
  playLetter(letter: string) {
    if (this.guessedLetters().includes(letter)) return;
    this.guessedLetters.update(letters => [...letters, letter]);
  }
}
