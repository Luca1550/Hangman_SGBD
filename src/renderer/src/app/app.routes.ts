import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { GamePageComponent } from './pages/game.component';

export const routes: Routes = [
    { path: '', component: HomeComponent }, // Page par défaut
    { path: 'game', component: GamePageComponent }, // Page du jeu
    { path: '**', redirectTo: '' } // Si URL inconnue, on retourne à l'accueil
];
