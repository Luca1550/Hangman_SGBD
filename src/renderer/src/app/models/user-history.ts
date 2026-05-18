import { User } from './user';
import { Game } from './game';

export interface UserHistory extends User {
  games: Game[];
}
