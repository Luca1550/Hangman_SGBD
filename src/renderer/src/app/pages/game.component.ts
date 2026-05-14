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
    <!-- Bouton de retour en haut à gauche -->
    <button (click)="goHome()" style="position: absolute; top: 20px; left: 20px; padding: 10px 15px; font-weight: bold; cursor: pointer; background: #ddd; border: 1px solid #aaa; border-radius: 5px;">
      ⬅ Retour
    </button>

    <!-- On dit bonjour au joueur actuel -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 40px;">
      <h2>Zone de Jeu</h2>
      <span style="background: #e0e0e0; padding: 5px 10px; border-radius: 5px;">
        Joueur : <strong>{{ dbService.currentUser()?.pseudo }}</strong>
      </span>
    </div>

    <div style="margin-bottom: 20px; display: flex; gap: 10px;">
      <button (click)="onStartGame()" style="padding: 10px 20px; font-size: 16px; cursor: pointer;">
        {{ dbService.gameStatus() === 'ATTENTE' ? 'Démarrer une partie' : 'Nouveau Mot' }}
      </button>
      <button (click)="goHistory()" style="padding: 10px 20px; font-size: 16px; cursor: pointer; background-color: #e3f2fd; border: 1px solid #90caf9; border-radius: 5px;">
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

        <!-- Affichage des nouveaux succès débloqués ! -->
        @if (dbService.newAchievements().length > 0) {
          <div style="margin-top: 20px; padding: 15px; border: 2px solid gold; border-radius: 8px; background-color: #fff9c4;">
            <h3 style="color: #f57f17; text-align: center; margin-top: 0;">🏆 Nouveaux succès débloqués ! 🏆</h3>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              @for (ach of dbService.newAchievements(); track ach.id) {
                <div style="display: flex; align-items: center; background: white; padding: 10px; border-radius: 5px;">
                  <span style="font-size: 30px; margin-right: 15px;">{{ ach.icon_name }}</span>
                  <div>
                    <strong style="display: block;">{{ ach.name }}</strong>
                    <span style="font-size: 12px; color: gray;">{{ ach.description }}</span>
                  </div>
                </div>
              }
            </div>
          </div>
        }

      </div>
    }
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
    this.dbService.newAchievements.set([]);
    this.router.navigate(['/']);
  }

  goHistory() {
    this.router.navigate(['/history']);
  }
}
