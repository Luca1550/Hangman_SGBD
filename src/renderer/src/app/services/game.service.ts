import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Word, Achievement } from '../models/types';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  authService = inject(AuthService); // Communication inter-services !

  currentWord = signal<Word | null>(null);
  guessedLetters = signal<string[]>([]);
  newAchievements = signal<Achievement[]>([]);

  errorCount = computed(() => {
    const word = this.currentWord();
    const guesses = this.guessedLetters();
    if (!word) return 0;
    
    return guesses.filter(letter => !word.text.includes(letter)).length;
  });

  gameStatus = computed(() => {
    const word = this.currentWord();
    if (!word) return 'ATTENTE';

    const errors = this.errorCount();
    if (errors >= word.difficulty!.max_errors) return 'PERDU'; 

    const guesses = this.guessedLetters();
    const isWon = word.text.split('').every((letter: string) => guesses.includes(letter));
    
    if (isWon) return 'GAGNE';
    return 'EN_COURS';
  });

  constructor() {
    effect(() => {
      const status = this.gameStatus();
      if (status === 'GAGNE' || status === 'PERDU') {
        this.saveCurrentGame(status);
      }
    });
  }

  async saveCurrentGame(status: string) {
    const user = this.authService.currentUser();
    const word = this.currentWord();
    if (!user || !word) return;

    const baseScore = status === 'GAGNE' ? 100 - (this.errorCount() * 10) : 0;
    const finalScore = Math.round(baseScore * word.difficulty!.score_multiplier);

    const result = await window.electronAPI.saveGame({
      userId: user.id,
      wordId: word.id,
      difficultyId: word.difficultyId,
      errors_count: this.errorCount(),
      status: status,
      score: finalScore
    });

    if (result && result.newAchievements && result.newAchievements.length > 0) {
      this.newAchievements.set(result.newAchievements);
    }
  }

  async startNewGame() {
    try {
      const word = await window.electronAPI.getRandomWord();
      this.currentWord.set(word);
      this.guessedLetters.set([]); 
      this.newAchievements.set([]); 
    } catch (error) {
      console.error("Erreur tirage mot :", error);
    }
  }

  playLetter(letter: string) {
    if (this.guessedLetters().includes(letter)) return;
    this.guessedLetters.update(letters => [...letters, letter]);
  }

  resetSession() {
    this.currentWord.set(null);
    this.guessedLetters.set([]);
    this.newAchievements.set([]);
  }
}
