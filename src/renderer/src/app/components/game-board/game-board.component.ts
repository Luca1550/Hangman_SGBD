import { Component, input, signal, effect } from '@angular/core';

@Component({
  selector: 'app-game-board',
  standalone: true,
  templateUrl: './game-board.component.html'
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
