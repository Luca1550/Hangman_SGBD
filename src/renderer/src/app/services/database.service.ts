import { Injectable, signal, computed } from '@angular/core';

// 1. On explique à TypeScript que notre Preload a ajouté "electronAPI" à l'objet window
declare global {
  interface Window {
    electronAPI: {
      getCategories: () => Promise<any[]>;
      getRandomWord: () => Promise<any>;
      loginUser: (pseudo: string) => Promise<any>;
    }
  }
}

// 2. On crée le Service Angular
@Injectable({
  providedIn: 'root' // (Singleton injecté à la racine)
})
export class DatabaseService {
  
  // 3. On utilise des Signals pour stocker nos données
  categories = signal<any[]>([]);
  currentWord = signal<any | null>(null); // Pour stocker le mot de la partie en cours
  guessedLetters = signal<string[]>([]); // Mémoire des lettres jouées
  currentUser = signal<any | null>(null); // Pour savoir qui joue

  // 4. EXIGENCE PDF : computed()
  // Recalcule le nombre d'erreurs automatiquement si le mot ou les lettres jouées changent
  errorCount = computed(() => {
    const word = this.currentWord();
    const guesses = this.guessedLetters();
    if (!word) return 0;
    
    // Compte le nombre de lettres devinées qui ne sont pas dans le mot
    return guesses.filter(letter => !word.text.includes(letter)).length;
  });

  constructor() { }

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
