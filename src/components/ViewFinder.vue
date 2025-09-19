<script setup>
import { useGameStore } from "@/stores/game";
import EncounterStats from "./EncounterStats.vue";

const gameStore = useGameStore();
</script>

<template>
  <div class="viewfinder">
    <div v-if="!gameStore.currentPokemon" class="viewfinder__empty">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg"
        alt="Pokeball"
        class="viewfinder__image"
      />
      <div class="viewfinder__text-container">
        <h3 class="viewfinder__empty-title font-primary">
          Ready to catch 'em all?
        </h3>
      </div>
    </div>

    <div v-else class="viewfinder__encounter">
      <div class="viewfinder__display">
        <img
          :src="gameStore.currentPokemon.sprite"
          :alt="gameStore.currentPokemon.name"
          class="viewfinder__sprite"
          :class="{ 'viewfinder__sprite--running-away': gameStore.gameState.isRunningAway }"
        />
      </div>
      <EncounterStats />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.viewfinder {
  background: white;
  border: 3px solid var(--color-primary);
  height: 400px;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-light);
  overflow: hidden;

  @media (max-width: 768px) {
    height: 450px;
  }

  &__empty {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    height: 100%;
  }

  &__text-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  &__empty-title {
    color: var(--color-secondary);
    font-size: 1rem;
    margin: 0;
    text-shadow: var(--text-shadow-light);

    @media (max-width: 768px) {
      font-size: 0.8rem;
    }
  }

  &__empty-subtitle {
    color: var(--color-primary);
    font-size: 0.9rem;
    font-weight: 500;
    margin: 0;
    opacity: 0.9;

    @media (max-width: 768px) {
      font-size: 0.8rem;
    }
  }

  &__image {
    width: 150px;
    height: 150px;
  }

  &__encounter {
    width: 100%;
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 2rem;
    align-items: center;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      text-align: center;
    }
  }

  &__display {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__sprite {
    width: 200px;
    height: 200px;
    transition: all 0.3s ease-out;

    &--running-away {
      animation: runAwayAnimation 1s ease-out forwards;
    }
  }
}

@keyframes runAwayAnimation {
  0% {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
  20% {
    transform: translateX(-20px) scale(1.1);
    opacity: 1;
  }
  40% {
    transform: translateX(10px) scale(0.95);
    opacity: 0.9;
  }
  60% {
    transform: translateX(-30px) scale(1.05);
    opacity: 0.7;
  }
  80% {
    transform: translateX(-100px) scale(0.8);
    opacity: 0.4;
  }
  100% {
    transform: translateX(-250px) scale(0.3);
    opacity: 0;
  }
}
</style>
