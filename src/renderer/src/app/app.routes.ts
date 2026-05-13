import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { GamePageComponent } from './pages/game.component';
import { HistoryComponent } from './pages/history.component';
import { UsersListComponent } from './pages/users-list.component';

export const routes: Routes = [
    { path: '', component: HomeComponent }, // Page par défaut
    { path: 'game', component: GamePageComponent }, // Page du jeu
    { path: 'history', component: HistoryComponent }, // Page d'historique
    { path: 'users', component: UsersListComponent }, // Page liste des utilisateurs
    { path: '**', redirectTo: '' } // Si URL inconnue, on retourne à l'accueil
];
