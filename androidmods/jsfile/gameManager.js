/**
 * Game Manager Tool
 * Standalone tool for managing and exporting game data
 * This ONLY affects the Game Manager page, not the Android Mods page
 */

// Game manager class
class GameManager {
    constructor() {
        this.gameData = { games: [] };
        this.storageKey = 'gameManagerData'; // Separate storage key from the public site
        this.jsonUrl = './jsfile/games.json';
        this.exportFileName = 'updatemods.json'; // Changed to match your requested filename
    }

    // Initialize by loading data from localStorage or JSON file
    async initialize() {
        // First try to load from localStorage
        const localData = this.loadFromLocalStorage();
        
        if (localData && localData.games && localData.games.length > 0) {
            console.log("Game data loaded from localStorage");
            this.gameData = localData;
            return this;
        }
        
        // If localStorage empty, try to load from existing JSON
        try {
            const response = await fetch(this.jsonUrl);
            if (response.ok) {
                this.gameData = await response.json();
                console.log("Game data loaded from games.json");
                this.saveToLocalStorage();
                return this;
            }
        } catch (error) {
            console.error("Error loading game data:", error);
        }
        
        console.log("No game data found, starting with empty list");
        this.gameData = { games: [] };
        return this;
    }

    // Save data to localStorage (only for the Game Manager tool)
    saveToLocalStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.gameData));
            return true;
        } catch (error) {
            console.error("Error saving to localStorage:", error);
            return false;
        }
    }

    // Load data from localStorage
    loadFromLocalStorage() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error("Error loading from localStorage:", error);
            return null;
        }
    }

    // Reset to default data from games.json
    async resetToDefault() {
        try {
            const response = await fetch(this.jsonUrl);
            if (response.ok) {
                this.gameData = await response.json();
                console.log("Game data reset to defaults from games.json");
                this.saveToLocalStorage();
                return true;
            } else {
                throw new Error("Could not load default game data");
            }
        } catch (error) {
            console.error("Error resetting game data:", error);
            return false;
        }
    }

    // Get all games
    getAllGames() {
        return this.gameData.games || [];
    }

    // Get a game by ID
    getGameById(id) {
        return this.gameData.games.find(game => game.id === id);
    }

    // Get a game by package name
    getGameByPackageName(packageName) {
        return this.gameData.games.find(game => game.packageName === packageName);
    }

    // Add or update a game
    addOrUpdateGame(game) {
        // Ensure game has an ID
        if (!game.id) {
            game.id = this.getNextId();
        }
        
        // Find existing game index
        const index = this.gameData.games.findIndex(g => g.id === game.id);
        
        // Update or add the game
        if (index !== -1) {
            this.gameData.games[index] = game;
        } else {
            this.gameData.games.push(game);
        }
        
        // Sort games by ID
        this.gameData.games.sort((a, b) => a.id - b.id);
        
        // Save changes to localStorage (only for Game Manager)
        this.saveToLocalStorage();
        
        console.log(`Game saved: ${game.title}`);
        
        return game;
    }

    // Delete a game by ID
    deleteGame(id) {
        const initialLength = this.gameData.games.length;
        this.gameData.games = this.gameData.games.filter(game => game.id !== id);
        
        if (initialLength !== this.gameData.games.length) {
            // Save changes to localStorage (only for Game Manager)
            this.saveToLocalStorage();
            console.log(`Game with ID ${id} deleted`);
            return true;
        }
        
        return false;
    }

    // Get the next available ID
    getNextId() {
        if (this.gameData.games.length === 0) {
            return 1;
        }
        const maxId = Math.max(...this.gameData.games.map(game => game.id));
        return maxId + 1;
    }

    // Export data to JSON file (for uploading to GitHub)
    exportToJSON() {
        const jsonString = JSON.stringify(this.gameData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // Create a download link
        const a = document.createElement('a');
        a.href = url;
        a.download = this.exportFileName;
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
        
        alert(`Successfully exported to ${this.exportFileName}. Upload this file to your GitHub repository's jsfile folder.`);
    }

    // Import data from JSON file
    importFromJSON(jsonFile) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    if (data && data.games && Array.isArray(data.games)) {
                        this.gameData = data;
                        this.saveToLocalStorage();
                        resolve(this.gameData);
                    } else {
                        reject(new Error("Invalid game data format"));
                    }
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => {
                reject(new Error("Error reading file"));
            };
            
            reader.readAsText(jsonFile);
        });
    }

    // Search games by title or package name
    searchGames(query) {
        if (!query) {
            return this.getAllGames();
        }
        
        query = query.toLowerCase().trim();
        return this.gameData.games.filter(game => {
            return game.title.toLowerCase().includes(query) || 
                  (game.packageName && game.packageName.toLowerCase().includes(query));
        });
    }
}

// Create and export a singleton instance
const gameManager = new GameManager();