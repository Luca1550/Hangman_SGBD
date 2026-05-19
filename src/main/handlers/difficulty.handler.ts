import { ipcMain } from 'electron';
import { prisma } from '../main';

export function registerDifficultyHandlers() {
    ipcMain.handle('db:get-difficulties', async () => {
        try {
            return await prisma.difficulty.findMany();
        } catch (e) {
            return [];
        }
    });
}
