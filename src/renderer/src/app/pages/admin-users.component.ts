import { Component, OnInit, signal, inject } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';
import { User } from '../models/types';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  template: `
    <button (click)="goBack()" style="position: absolute; top: 20px; left: 20px; padding: 10px 15px; font-weight: bold; cursor: pointer; background: #ddd; border: 1px solid #aaa; border-radius: 5px;">
      ⬅ Retour
    </button>

    <div style="padding: 20px; text-align: center; max-width: 600px; margin: 40px auto 0;">
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
    </div>
  `
})
export class AdminUsersComponent implements OnInit {
  dbService = inject(DatabaseService);
  router = inject(Router);
  
  users = signal<User[]>([]);

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
    this.router.navigate(['/admin']);
  }
}
