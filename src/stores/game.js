import { defineStore } from "pinia";

const capitalize = (s) => s && String(s[0]).toUpperCase() + String(s).slice(1);

export const useGameStore = defineStore("game", {
  state: () => ({
    trainer: {
      name: "",
      isLoggedIn: false,
    },
    currentPokemon: null,
    capturedPokemon: [],
    eventLog: [],
    gameState: {
      isInGame: false,
      consecutiveFailures: 0,
      canFind: true,
      canIgnore: false,
      canThrow: false,
      isRunningAway: false,
    },
  }),
  getters: {
    uniquePokemonCount: (state) => {
      const uniqueIds = new Set(state.capturedPokemon.map((p) => p.id));
      return uniqueIds.size;
    },

    totalCapturedCount: (state) => state.capturedPokemon.length,
  },

  actions: {
    setTrainerName(name) {
      this.clearEventLog();
      this.trainer.name = name;
      this.trainer.isLoggedIn = true;

      if (this.loadFromLocalStorage(name)) {
        return;
      }

      this.addEventLog(`Welcome, ${name}! Get to catching!`);
      this.saveToLocalStorage();
    },

    addEventLog(message) {
      this.eventLog.push({
        id: Date.now(),
        message,
        timestamp: new Date().toLocaleTimeString(),
        dateTime: new Date().toISOString(),
      });
    },

    async findPokemon() {
      try {
        // Generate random ID between 1 and 151 for Gen1
        const randomId = Math.floor(Math.random() * 151) + 1;
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${randomId}`,
        );

        if (!response.ok) throw new Error("failed to fetch");

        const pokemonData = await response.json();
        console.log(pokemonData);
        this.currentPokemon = {
          id: pokemonData.id,
          name: pokemonData.name,
          sprite: pokemonData.sprites.front_default,
          types: pokemonData.types.map((t) => t.type.name),
          height: pokemonData.height,
          weight: pokemonData.weight,
          stats: pokemonData.stats.reduce((acc, stat) => {
            acc[stat.stat.name] = stat.base_stat;
            return acc;
          }, {}),
        };

        this.gameState.isInGame = true;
        this.gameState.consecutiveFailures = 0;
        this.gameState.canFind = false;
        this.gameState.canIgnore = true;
        this.gameState.canThrow = true;

        this.addEventLog(
          `A ${capitalize(this.currentPokemon.name)} has appeared!`,
        );
      } catch (error) {
        this.addEventLog("Failed to find a Pokemon. Try again!");
        console.error(error);
      }
    },

    ignorePokemon() {
      this.addEventLog(
        `You ignored ${capitalize(this.currentPokemon.name)} :(`,
      );
      this.clearEncounter();
    },

    throwPokemon() {
      if (!this.gameState.canThrow) return;

      const pokemonName = capitalize(this.currentPokemon.name);
      this.addEventLog(`${this.trainer.name} throws a ball at ${pokemonName}!`);

      // 1/3 change of failure
      const isSuccess = Math.random() > 0.333;

      if (isSuccess) {
        this.capturedPokemon.push({ ...this.currentPokemon });
        this.addEventLog(`${pokemonName} was caught!`);
        this.clearEncounter();
        this.saveToLocalStorage();
      } else {
        this.gameState.consecutiveFailures++;

        if (this.gameState.consecutiveFailures >= 2) {
          this.gameState.isRunningAway = true;
          this.addEventLog(`${pokemonName} ran away!`);
          // Delay for run away animation
          setTimeout(() => {
            this.clearEncounter();
          }, 1000);
        } else {
          // Disable ignore one first fail
          this.addEventLog(`${pokemonName} broke free!`);
          this.gameState.canIgnore = false;
        }
      }
    },

    clearEncounter() {
      this.currentPokemon = null;
      this.gameState.isInGame = false;
      this.gameState.consecutiveFailures = 0;
      this.gameState.canFind = true;
      this.gameState.canIgnore = false;
      this.gameState.canThrow = false;
      this.gameState.isRunningAway = false;
    },

    quitGame() {
      this.saveToLocalStorage();
    },

    saveToLocalStorage() {
      const saveKey = `pokemonGameSave_${this.trainer.name}`;
      const saveData = {
        trainer: this.trainer,
        capturedPokemon: this.capturedPokemon,
        eventLog: this.eventLog,
      };
      localStorage.setItem(saveKey, JSON.stringify(saveData));
    },

    loadFromLocalStorage(username = null) {
      let saveKey;
      // if (!user)
      if (username) {
        saveKey = `pokemonGameSave_${username}`;
      }

      const saveData = localStorage.getItem(saveKey);
      if (saveData) {
        try {
          const parsed = JSON.parse(saveData);
          this.trainer = parsed.trainer;
          this.capturedPokemon = parsed.capturedPokemon || [];
          this.eventLog = parsed.eventLog || [];

          if (this.trainer.name) {
            this.addEventLog(`Welcome back, ${this.trainer.name}!`);
            return true;
          }
        } catch (error) {
          console.error("Error on load saave", error);
        }
      }
      return false;
    },

    clearEventLog() {
      this.eventLog = [];
    },
  },
});
