import { Component, OnInit, signal, inject } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-list',
  standalone: true,
  template: `
    <div style="padding: 20px; text-align: center;">
      <h2>Liste des Utilisateurs Inscrits</h2>
      
      <div style="margin: 20px auto; max-width: 400px;">
        <ul style="list-style-type: none; padding: 0;">
          @for (user of users(); track user.id) {
            <li style="padding: 10px; border-bottom: 1px solid #eee; font-size: 18px;">
              <strong>{{ user.pseudo }}</strong>
            </li>
          } @empty {
            <li>Aucun utilisateur trouvé.</li>
          }
        </ul>
      </div>

      <button (click)="goBack()" style="padding: 10px 20px; cursor: pointer; margin-top: 20px;">
        Retour au Login
      </button>
    </div>
  `
})
export class UsersListComponent implements OnInit {
  dbService = inject(DatabaseService);
  router = inject(Router);
  
  users = signal<any[]>([]);

  async ngOnInit() {
    const data = await this.dbService.getAllUsers();
    this.users.set(data);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
