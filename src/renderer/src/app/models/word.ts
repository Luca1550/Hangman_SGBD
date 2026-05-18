import { Category } from './category';
import { Difficulty } from './difficulty';

export interface Word {
  id: number;
  text: string;
  hint: string | null;
  categoryId: number;
  difficultyId: number;
  category?: Category;
  difficulty?: Difficulty;
}
