import {contextBridge, ipcRenderer} from 'electron'

// On expose une API globale appelée "electronAPI" à notre fenêtre web (Angular)
contextBridge.exposeInMainWorld('electronAPI',{
    // On crée une fonction que Angular pourra appeler : getCategories()
    // Elle envoie un message nommé 'db:get-categories' au processus principal (Main)
    getCategories: () => ipcRenderer.invoke('db:get-categories'),
    getRandomWord: () => ipcRenderer.invoke('db:get-random-word'),
    loginUser: (pseudo: string) => ipcRenderer.invoke('db:login-user', pseudo),
    saveGame: (data: any) => ipcRenderer.invoke('db:save-game', data),
    getPlayerHistory: (userId: number) => ipcRenderer.invoke('db:get-player-history', userId),
    getUsers: () => ipcRenderer.invoke('db:get-users'),
    getUserAchievements: (userId: number) => ipcRenderer.invoke('db:get-user-achievements', userId),
    deleteUser: (userId: number) => ipcRenderer.invoke('db:delete-user', userId),
    
    // CRUD Mots
    getWords: () => ipcRenderer.invoke('db:get-words'),
    addWord: (data: any) => ipcRenderer.invoke('db:add-word', data),
    updateWord: (data: any) => ipcRenderer.invoke('db:update-word', data),
    deleteWord: (id: number) => ipcRenderer.invoke('db:delete-word', id),
    getDifficulties: () => ipcRenderer.invoke('db:get-difficulties'),
    addCategory: (name: string) => ipcRenderer.invoke('db:add-category', name),
    deleteCategory: (id: number) => ipcRenderer.invoke('db:delete-category', id)
})