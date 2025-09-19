<script setup>
import { useGameStore } from "@/stores/game";

const gameStore = useGameStore();

const formatHeight = (height) => {
  return `${(height / 10).toFixed(1)}m`;
};

const formatWeight = (weight) => {
  return `${(weight / 10).toFixed(1)}kg`;
};
</script>

<template>
  <div v-if="gameStore.currentPokemon" class="encounter-stats">
    <h3 class="encounter-stats__title font-primary">
      {{ gameStore.currentPokemon.name }}
    </h3>

    <div class="encounter-stats__types-row">
      <span class="encounter-stats__label">Type</span>
      <span class="encounter-stats__value encounter-stats__value--types">
        <span
          v-for="type in gameStore.currentPokemon.types"
          :key="type"
          class="encounter-stats__type"
          :class="type"
        >
          {{ type }}
        </span>
      </span>
    </div>

    <div class="encounter-stats__grid">
      <div class="encounter-stats__row">
        <span class="encounter-stats__label">Height</span>
        <span class="encounter-stats__value">{{
          formatHeight(gameStore.currentPokemon.height)
        }}</span>
      </div>

      <div class="encounter-stats__row">
        <span class="encounter-stats__label">Weight</span>
        <span class="encounter-stats__value">{{
          formatWeight(gameStore.currentPokemon.weight)
        }}</span>
      </div>

      <div v-if="gameStore.currentPokemon.stats" class="encounter-stats__row">
        <span class="encounter-stats__label">HP</span>
        <span class="encounter-stats__value">{{
          gameStore.currentPokemon.stats.hp
        }}</span>
      </div>

      <div v-if="gameStore.currentPokemon.stats" class="encounter-stats__row">
        <span class="encounter-stats__label">Speed</span>
        <span class="encounter-stats__value">{{
          gameStore.currentPokemon.stats.speed
        }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.encounter-stats {
  &__title {
    color: var(--color-secondary);
    margin: 0 0 1rem 0;
    text-transform: capitalize;
    font-size: 1.3rem;
    text-align: center;

    @media (max-width: 768px) {
      font-size: 1.1rem;
      margin-bottom: 0.75rem;
    }
  }

  &__types-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1.25rem;
    align-items: center;
    padding: 0.75rem;
    background: #f8f9fa;
    border: 1px solid #e9ecef;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
      padding: 0.5rem;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;

    @media (max-width: 768px) {
      gap: 0.75rem;
    }
  }

  &__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: #f8f9fa;
    border: 1px solid #e9ecef;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
      padding: 0.5rem;
    }
  }

  &__label {
    color: var(--color-secondary);
    font-weight: 600;
    font-size: 0.9rem;

    @media (max-width: 768px) {
      font-size: 0.8rem;
      font-weight: 600;
    }
  }

  &__value {
    color: var(--color-primary);
    font-weight: 700;
    font-size: 1rem;

    @media (max-width: 768px) {
      font-size: 0.85rem;
      font-weight: 700;
    }

    &--types {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      justify-content: center;

      @media (max-width: 768px) {
        gap: 0.25rem;
      }
    }
  }

  &__type {
    padding: 0.2rem 0.6rem;
    color: white;
    font-size: 0.85rem;
    text-transform: capitalize;

    @media (max-width: 768px) {
      padding: 0.15rem 0.4rem;
      font-size: 0.75rem;
    }
  }
}
</style>
