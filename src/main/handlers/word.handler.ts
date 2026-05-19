import { ipcMain } from 'electron';
import { prisma } from '../main';

export function registerWordHandlers() {
    ipcMain.handle('db:get-random-word', async () => {
        try {
            const count = await prisma.word.count();
            if (count === 0) return null;

            const randomIndex = Math.floor(Math.random() * count);

            const randomWord = await prisma.word.findFirst({
                skip: randomIndex,
                include: { category: true, difficulty: true }
            });

            return randomWord;
        } catch (error) {
            console.error("Erreur récupération mot: ", error);
            return null;
        }
    });

    ipcMain.handle('db:get-words', async () => {
        try {
            return await prisma.word.findMany({
                include: { category: true, difficulty: true },
                orderBy: { text: 'asc' }
            });
        } catch (e) {
            return [];
        }
    });

    ipcMain.handle('db:add-word', async (event, data) => {
        try {
            return await prisma.word.create({ data });
        } catch (e) {
            console.error(e);
            return null;
        }
    });

    ipcMain.handle('db:update-word', async (event, data) => {
        try {
            const { id, ...updateData } = data;
            return await prisma.word.update({
                where: { id },
                data: updateData
            });
        } catch (e) {
            console.error(e);
            return null;
        }
    });

    ipcMain.handle('db:delete-word', async (event, id: number) => {
        try {
            await prisma.word.delete({ where: { id } });
            return true;
        } catch (e) {
            return false;
        }
    });
}
