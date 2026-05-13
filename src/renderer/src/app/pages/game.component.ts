import { Component, inject } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { GameBoardComponent } from '../components/game-board.component';
import { KeyboardComponent } from '../components/keyboard.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [GameBoardComponent, KeyboardComponent],
  template: `
    <!-- On dit bonjour au joueur actuel -->
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <h2>Zone de Jeu</h2>
      <span style="background: #e0e0e0; padding: 5px 10px; border-radius: 5px;">
        Joueur : <strong>{{ dbService.currentUser()?.pseudo }}</strong>
      </span>
    </div>

    <button (click)="onStartGame()" style="padding: 10px 20px; font-size: 16px; cursor: pointer;">
      Tirer un mot au hasard
    </button>

    @if (dbService.currentWord()) {
      <div style="margin-top: 20px; padding: 20px; background-color: #f0f0f0; border-radius: 8px;">
        
        <h3 style="color: darkred;">Erreurs : {{ dbService.errorCount() }}</h3>

        <app-game-board 
          [word]="dbService.currentWord()" 
          [guessedLetters]="dbService.guessedLetters()">
        </app-game-board>

        <hr style="margin: 20px 0;">

        <app-keyboard 
          [disabledLetters]="dbService.guessedLetters()"
          (letterPlayed)="onPlayLetter($event)">
        </app-keyboard>

      </div>
    }

    <div style="margin-top: 20px;">
      <button (click)="goHome()" style="padding: 5px 10px; cursor: pointer;">Retour au menu</button>
    </div>
  `
})
export class GamePageComponent {
  dbService = inject(DatabaseService);
  router = inject(Router);

  onStartGame() {
    this.dbService.startNewGame();
  }

  onPlayLetter(letter: string) {
    this.dbService.playLetter(letter);
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
