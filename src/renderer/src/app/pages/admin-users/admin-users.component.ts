import { Component, OnInit, signal, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);

  users = signal<User[]>([]);

  ngOnInit() {
    this.refreshUsers();
  }

  async refreshUsers() {
    const data = await this.authService.getAllUsers();
    this.users.set(data);
  }

  async onDelete(userId: number) {
    if (confirm("Voulez-vous vraiment supprimer ce joueur ? Tout son historique sera perdu (Cascade Delete).")) {
      const success = await this.authService.deleteUser(userId);
      if (success) {
        this.refreshUsers(); // Rafraîchit la liste si la suppression a fonctionné
      }
    }
  }

  goBack() {
    this.router.navigate(['/admin']);
  }
}