import { ipcMain } from 'electron';
import { prisma } from '../main';

export function registerCategoryHandlers() {
    ipcMain.handle('db:get-categories', async () => {
        try {
            const categories = await prisma.category.findMany()
            return categories 
        } catch (error) {
            console.error("erreur DB: ", error)
            return []
        }
    });

    ipcMain.handle('db:add-category', async (event, name: string) => {
        try {
            return await prisma.category.create({ data: { name } });
        } catch (e) {
            console.error(e);
            return null;
        }
    });

    ipcMain.handle('db:delete-category', async (event, id: number) => {
        try {
            await prisma.category.delete({ where: { id } });
            return { success: true };
        } catch (error: any) {
            if (error.code === 'P2003') {
                return { success: false, message: "Impossible de supprimer cette catégorie car elle contient encore des mots." };
            }
            return { success: false, message: "Erreur lors de la suppression de la catégorie." };
        }
    });
}
