import { Component, input, signal, effect } from '@angular/core';
import { Word } from '../models/types';

@Component({
  selector: 'app-game-board',
  standalone: true,
  template: `
    <div style="display: flex; justify-content: space-between; align-items: baseline;">
      <h3>Mot à deviner :</h3>
      <span style="background-color: #ffe0b2; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 14px; color: #0d47a1;">
        Catégorie : {{ word().category?.name || 'Inconnue' }}
      </span>
    </div>

    <p style="font-size: 32px; letter-spacing: 5px; font-family: monospace;">
      <!-- Affichage du mot avec les tirets ou les lettres -->
      @for (letter of word().text.split(''); track $index) {
        @if (guessedLetters().includes(letter)) {
          {{ letter }}
        } @else {
          _
        }
      }
    </p>
    
    <div style="margin-top: 15px;">
      @if (word().hint) {
        @if (isHintRevealed()) {
          <p style="color: gray; font-size: 14px; font-style: italic;">💡 Indice : {{ word().hint }}</p>
        } @else {
          <button (click)="isHintRevealed.set(true)" style="padding: 5px 10px; font-size: 12px; cursor: pointer; border-radius: 4px; border: 1px solid #ccc; background-color: #fff;">
            ❓ Révéler l'indice
          </button>
        }
      }
    </div>
  `
})
export class GameBoardComponent {
  // Exigences PDF : input()
  // Le composant a besoin du mot et des lettres jouées pour s'afficher
  word = input.required<any>();
  guessedLetters = input.required<string[]>();

  isHintRevealed = signal(false);

  constructor() {
    // Dès que le mot (input) change, on remet le signal isHintRevealed à false
    effect(() => {
      this.word(); // On observe le mot
      this.isHintRevealed.set(false);
    }, { allowSignalWrites: true });
  }
}
