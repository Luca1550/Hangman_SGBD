import { Word } from './word';

export interface Game {
  id: number;
  errors_count: number;
  status: string;
  score: number;
  playedAt: Date | string;
  word: Word;
}
