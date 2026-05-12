import { Component, input } from '@angular/core';

@Component({
  selector: 'app-game-board',
  standalone: true,
  template: `
    <h3>Mot à deviner :</h3>
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
    <p style="color: gray; font-size: 14px;">Indice : {{ word().hint || 'Aucun indice' }}</p>
  `
})
export class GameBoardComponent {
  // Exigences PDF : input()
  // Le composant a besoin du mot et des lettres jouées pour s'afficher
  word = input.required<any>();
  guessedLetters = input.required<string[]>();
}
