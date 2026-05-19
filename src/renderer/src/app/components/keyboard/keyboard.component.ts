import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-keyboard',
  standalone: true,
  templateUrl: './keyboard.component.html'
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
