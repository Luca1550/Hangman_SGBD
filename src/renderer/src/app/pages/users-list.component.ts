import { Component, OnInit, signal, inject } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-list',
  standalone: true,
  template: `
    <button (click)="goBack()" style="position: absolute; top: 20px; left: 20px; padding: 10px 15px; font-weight: bold; cursor: pointer; background: #ddd; border: 1px solid #aaa; border-radius: 5px;">
      ⬅ Retour
    </button>

    <div style="padding: 20px; text-align: center; margin-top: 40px;">
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
