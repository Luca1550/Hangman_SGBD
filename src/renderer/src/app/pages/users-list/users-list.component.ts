import { Component, OnInit, signal, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../models/user';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [RouterLink], // Exigence PDF : RouterLink
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  
  users = signal<User[]>([]);

  async ngOnInit() {
    const data = await this.authService.getAllUsers();
    this.users.set(data);
  }

  viewAchievements(userId: number) {
    this.router.navigate(['/users', userId, 'achievements']);
  }
}
