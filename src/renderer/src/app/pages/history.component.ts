import { Component, OnInit, signal, inject } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Requis pour le pipe 'date'

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h2>Historique de {{ playerData()?.pseudo }}</h2>
        <button (click)="goBack()" style="padding: 5px 10px; cursor: pointer;">Retour au jeu</button>
      </div>

      @if (playerData()) {
        <h3>Parties jouées : {{ playerData().games.length }}</h3>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background-color: #ddd;">
              <th style="padding: 10px; border: 1px solid #ccc;">Date</th>
              <th style="padding: 10px; border: 1px solid #ccc;">Mot</th>
              <th style="padding: 10px; border: 1px solid #ccc;">Résultat</th>
              <th style="padding: 10px; border: 1px solid #ccc;">Erreurs</th>
              <th style="padding: 10px; border: 1px solid #ccc;">Score</th>
            </tr>
          </thead>
          <tbody>
            @for (game of playerData().games; track game.id) {
              <tr>
                <td style="padding: 10px; border: 1px solid #ccc;">{{ game.playedAt | date:'short' }}</td>
                <td style="padding: 10px; border: 1px solid #ccc;">{{ game.word.text }}</td>
                <td style="padding: 10px; border: 1px solid #ccc; font-weight: bold;" 
                    [style.color]="game.status === 'GAGNE' ? 'green' : (game.status === 'PERDU' ? 'red' : 'gray')">
                  {{ game.status }}
                </td>
                <td style="padding: 10px; border: 1px solid #ccc; text-align: center;">{{ game.errors_count }}</td>
                <td style="padding: 10px; border: 1px solid #ccc; text-align: center;">{{ game.score }} pts</td>
              </tr>
            } @empty {
              <tr>
                <td colspan="5" style="padding: 10px; text-align: center; border: 1px solid #ccc;">
                  Aucune partie jouée pour le moment.
                </td>
              </tr>
            }
          </tbody>
        </table>
      } @else {
        <p>Chargement de l'historique...</p>
      }
    </div>
  `
})
export class HistoryComponent implements OnInit {
  dbService = inject(DatabaseService);
  router = inject(Router);
  
  playerData = signal<any | null>(null);

  async ngOnInit() {
    const user = this.dbService.currentUser();
    if (!user) {
      this.router.navigate(['/']); // Sécurité : si aucun utilisateur n'est connecté
      return;
    }

    const history = await this.dbService.getHistory(user.id);
    this.playerData.set(history);
  }

  goBack() {
    this.router.navigate(['/game']);
  }
}
