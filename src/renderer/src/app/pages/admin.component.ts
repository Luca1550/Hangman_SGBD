import { Component, OnInit, signal, inject } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  template: `
    <div style="padding: 20px; text-align: center; max-width: 600px; margin: 0 auto;">
      <h2 style="color: darkred;">Administration des Joueurs</h2>
      
      <div style="margin: 20px auto;">
        <ul style="list-style-type: none; padding: 0;">
          @for (user of users(); track user.id) {
            <li style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid #ccc; font-size: 18px;">
              <strong>{{ user.pseudo }}</strong>
              <button 
                (click)="onDelete(user.id)" 
                style="background: transparent; border: none; font-size: 24px; cursor: pointer; color: red;"
                title="Supprimer l'utilisateur et son historique">
                🗑️
              </button>
            </li>
          } @empty {
            <li style="padding: 15px;">Aucun utilisateur trouvé.</li>
          }
        </ul>
      </div>

      <button (click)="goBack()" style="padding: 10px 20px; cursor: pointer; margin-top: 20px;">
        Retour à l'accueil
      </button>
    </div>
  `
})
export class AdminComponent implements OnInit {
  dbService = inject(DatabaseService);
  router = inject(Router);
  
  users = signal<any[]>([]);

  ngOnInit() {
    this.refreshUsers();
  }

  async refreshUsers() {
    const data = await this.dbService.getAllUsers();
    this.users.set(data);
  }

  async onDelete(userId: number) {
    if (confirm("Voulez-vous vraiment supprimer ce joueur ? Tout son historique sera perdu (Cascade Delete).")) {
      const success = await this.dbService.deleteUser(userId);
      if (success) {
        this.refreshUsers(); // Rafraîchit la liste si la suppression a fonctionné
      }
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
