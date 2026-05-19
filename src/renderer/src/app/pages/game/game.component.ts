import { Component, inject, HostListener } from '@angular/core';
import { GameService } from '../../services/game.service';
import { AuthService } from '../../services/auth.service';
import { GameBoardComponent } from '../../components/game-board/game-board.component';
import { KeyboardComponent } from '../../components/keyboard/keyboard.component';
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

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // 1. On vérifie que la partie est en cours
    if (this.gameService.gameStatus() !== 'EN_COURS') return;

    // 2. On récupère la touche pressée et on la met en majuscule
    const key = event.key.toUpperCase();

    // 3. On vérifie que c'est bien UNE SEULE lettre de l'alphabet (A-Z) sans accents
    if (/^[A-Z]$/.test(key)) {
      // 4. On joue la lettre !
      this.gameService.playLetter(key);
    }
  }

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
