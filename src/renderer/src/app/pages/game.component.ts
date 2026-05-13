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

    <div style="margin-bottom: 20px; display: flex; gap: 10px;">
      <button (click)="onStartGame()" style="padding: 10px 20px; font-size: 16px; cursor: pointer;">
        {{ dbService.gameStatus() === 'ATTENTE' ? 'Démarrer une partie' : 'Nouveau Mot' }}
      </button>
      <button (click)="goHistory()" style="padding: 10px 20px; font-size: 16px; cursor: pointer;">
        Mon Historique
      </button>
    </div>

    @if (dbService.currentWord()) {
      <div style="margin-top: 20px; padding: 20px; background-color: #f0f0f0; border-radius: 8px;">
        
        <h3 style="color: darkred;">Erreurs : {{ dbService.errorCount() }} / 7</h3>

        <app-game-board 
          [word]="dbService.currentWord()" 
          [guessedLetters]="dbService.guessedLetters()">
        </app-game-board>

        <hr style="margin: 20px 0;">

        @if (dbService.gameStatus() === 'EN_COURS') {
          <app-keyboard 
            [disabledLetters]="dbService.guessedLetters()"
            (letterPlayed)="onPlayLetter($event)">
          </app-keyboard>
        } @else if (dbService.gameStatus() === 'GAGNE') {
          <div style="text-align: center; color: green;">
            <h2>🎉 FÉLICITATIONS ! 🎉</h2>
            <p>Vous avez deviné le mot !</p>
          </div>
        } @else if (dbService.gameStatus() === 'PERDU') {
          <div style="text-align: center; color: red;">
            <h2>💀 PERDU ! 💀</h2>
            <p>Le mot était : <strong>{{ dbService.currentWord()?.text }}</strong></p>
          </div>
        }

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
    // On nettoie la session de jeu avant de partir
    this.dbService.currentWord.set(null);
    this.dbService.guessedLetters.set([]);
    this.dbService.currentUser.set(null);
    this.router.navigate(['/']);
  }

  goHistory() {
    this.router.navigate(['/history']);
  }
}
