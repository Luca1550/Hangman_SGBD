import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-keyboard',
  standalone: true,
  template: `
    <div>
      @for (letter of alphabet; track letter) {
        <button 
          (click)="onKeyClick(letter)"
          [disabled]="disabledLetters().includes(letter)"
          style="margin: 5px; padding: 10px 15px; font-size: 18px; cursor: pointer;">
          {{ letter }}
        </button>
      }
    </div>
  `
})
export class KeyboardComponent {
  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  // Exigence PDF : input()
  // Reçoit la liste des lettres déjà jouées depuis le parent
  disabledLetters = input.required<string[]>();
  
  // Exigence PDF : output()
  // Émet un événement vers le parent quand une lettre est cliquée
  letterPlayed = output<string>();

  onKeyClick(letter: string) {
    this.letterPlayed.emit(letter);
  }
}
