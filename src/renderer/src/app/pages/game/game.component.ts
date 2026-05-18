import { Component, inject } from '@angular/core';
import { GameService } from '../../services/game.service';
import { AuthService } from '../../services/auth.service';
import { GameBoardComponent } from '../../components/game-board.component';
import { KeyboardComponent } from '../../components/keyboard.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [GameBoardComponent, KeyboardComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GamePageComponent {
  gameService = inject(GameService);
  authService = inject(AuthService);
  router = inject(Router);

  onStartGame() {
    this.gameService.startNewGame();
  }

  onPlayLetter(letter: string) {
    this.gameService.playLetter(letter);
  }

  goHome() {
    // La logique de nettoyage est déléguée au service !
    this.gameService.resetSession();
    this.authService.logout();
    this.router.navigate(['/']);
  }

  goHistory() {
    this.router.navigate(['/history']);
  }
}
