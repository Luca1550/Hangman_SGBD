import { Component, OnInit, signal, inject } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../models/types';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [RouterLink], // Exigence PDF : RouterLink
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent implements OnInit {
  dbService = inject(DatabaseService);
  router = inject(Router);
  
  users = signal<User[]>([]);

  async ngOnInit() {
    const data = await this.dbService.getAllUsers();
    this.users.set(data);
  }

  viewAchievements(userId: number) {
    this.router.navigate(['/users', userId, 'achievements']);
  }
}
