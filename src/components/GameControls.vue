<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useGameStore } from "@/stores/game";

const router = useRouter();
const gameStore = useGameStore();
const showQuitModal = ref(false);

const handleFind = async () => {
  if (gameStore.gameState.canFind) {
    await gameStore.findPokemon();
  }
};

const handleIgnore = () => {
  if (gameStore.gameState.canIgnore) {
    gameStore.ignorePokemon();
  }
};

const handleThrow = () => {
  if (gameStore.gameState.canThrow) {
    gameStore.throwPokemon();
  }
};

const showCollectionView = () => {
  router.push("/collection");
};

const handleQuit = () => {
  showQuitModal.value = true;
};

const confirmQuit = () => {
  gameStore.quitGame();
  showQuitModal.value = false;
  router.push("/");
};

const cancelQuit = () => {
  showQuitModal.value = false;
};
</script>

<template>
  <div class="game-controls">
    <form id="form-controls" class="game-controls__form">
      <fieldset class="game-controls__fieldset">
        <div class="game-controls__grid">
          <button
            type="button"
            name="btn-find"
            class="game-controls__btn game-controls__btn--find btn-white"
            :disabled="!gameStore.gameState.canFind"
            @click="handleFind"
          >
            Find
          </button>

          <button
            type="button"
            name="btn-ignore"
            class="game-controls__btn game-controls__btn--ignore btn-primary"
            :disabled="!gameStore.gameState.canIgnore"
            @click="handleIgnore"
          >
            Ignore
          </button>

          <button
            type="button"
            name="btn-throw"
            class="game-controls__btn game-controls__btn--throw btn-secondary"
            :disabled="!gameStore.gameState.canThrow"
            @click="handleThrow"
          >
            Throw
          </button>

          <button
            type="button"
            name="btn-collection"
            class="game-controls__btn game-controls__btn--collection btn-alt"
            @click="showCollectionView"
          >
            Pokédex ({{ gameStore.uniquePokemonCount }})
          </button>

          <button
            type="button"
            name="btn-quit"
            class="game-controls__btn game-controls__btn--quit btn-accent"
            @click="handleQuit"
          >
            Quit
          </button>
        </div>
      </fieldset>
    </form>

    <!-- Quit modal -->
    <div
      v-if="showQuitModal"
      class="game-controls__modal-overlay"
      @click="cancelQuit"
    >
      <div class="game-controls__modal" @click.stop>
        <h3 class="game-controls__modal-title font-primary">Quit Game?</h3>
        <p class="game-controls__modal-text">Your progress will be saved</p>
        <div class="game-controls__modal-buttons">
          <button class="btn-accent" @click="confirmQuit">Yes</button>
          <button class="btn-secondary" @click="cancelQuit">No</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.game-controls {
  &__form {
    // background: transparent;
    width: 100%;
  }

  &__fieldset {
    border: none;
    padding: 1.5rem 0;
    margin: 0;

    @media (max-width: 768px) {
      padding: 0;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: auto auto;
    gap: 1rem;
    width: 100%;

    @media (max-width: 768px) {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto auto auto auto;
    }
  }

  &__btn {
    &--find {
      @media (max-width: 768px) {
        grid-column: 1 / 3;
        grid-row: 1;
      }
    }

    &--ignore {
      @media (max-width: 768px) {
        grid-column: 1;
        grid-row: 2;
      }
    }

    &--throw {
      @media (max-width: 768px) {
        grid-column: 2;
        grid-row: 2;
      }
    }

    &--collection {
      grid-column: 1 / 3;
      grid-row: 2;

      @media (max-width: 768px) {
        grid-column: 1 / 3;
        grid-row: 3;
      }
    }

    &--quit {
      grid-column: 3;
      grid-row: 2;

      @media (max-width: 768px) {
        grid-column: 1 / 3;
        grid-row: 4;
      }
    }
  }

  &__btn {
    padding: 0.75rem 1rem;
    border: none;
    font-weight: 500;
    transition: all 0.2s;
    font-size: 0.95rem;

    &:not(:disabled):hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-medium);
    }

    &:focus {
      outline: 2px solid var(--color-accent);
      outline-offset: 2px;
    }
  }

  &__modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  &__modal {
    background: white;
    padding: 2rem;
    max-width: 300px;
    width: 90%;
    text-align: center;
    border: 3px solid var(--color-accent);
    box-shadow: var(--shadow-heavy);

    &-title {
      margin: 0;
      margin-bottom: 1.5rem;
      color: var(--color-secondary);
    }

    &-text {
      color: var(--color-secondary);
      margin-bottom: 1.5rem;
    }

    &-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;

      button {
        padding: 0.75rem 1rem;
        border: none;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        min-width: 80px;
      }
    }
  }
}
</style>
