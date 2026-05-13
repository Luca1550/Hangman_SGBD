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
    deleteUser: (userId: number) => ipcRenderer.invoke('db:delete-user', userId)
})