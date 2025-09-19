<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useGameStore } from "@/stores/game";

const router = useRouter();
const gameStore = useGameStore();

const trainerName = ref("");
const isAnimating = ref(false);

onMounted(() => {
  const loadSave = gameStore.loadFromLocalStorage();
  if (loadSave) {
    trainerName.value = gameStore.trainer.name;
  }
});

const isExistingTrainer = computed(() => {
  if (!trainerName.value.trim()) return false;
  const saveKey = `pokemonGameSave_${trainerName.value.trim().toLowerCase()}`;
  const saveData = localStorage.getItem(saveKey);
  if (!saveData) return false;
  try {
    const parsed = JSON.parse(saveData);
    return parsed.trainer?.name?.toLowerCase() === trainerName.value.trim().toLowerCase();
  } catch {
    return false;
  }
});

const startGame = () => {
  if (!trainerName.value.trim()) {
    alert("Please enter your trainer name!");
    return;
  }

  gameStore.setTrainerName(trainerName.value.trim());

  isAnimating.value = true;

  setTimeout(() => {
    router.push("/capture");
  }, 200);
};
</script>

<template>
  <main class="home-page" :class="{ 'home-page--animating': isAnimating }">
    <div class="home-page__content">
      <h1 class="home-page__title font-primary">Capture Pocket Monsters!</h1>
      <h6 class="home-page__author font-primary">by Hashim</h6>

      <form
        id="trainer-form"
        class="home-page__form"
        :class="{ 'home-page__form--continue': isExistingTrainer }"
        @submit.prevent="startGame"
      >
        <label
          for="trainer-name"
          class="home-page__label font-primary"
          :class="{ 'home-page__label--continue': isExistingTrainer }"
          >Trainer Name</label
        >
        <input
          type="text"
          name="trainer-name"
          id="trainer-name"
          class="home-page__input"
          :class="{ 'home-page__input--continue': isExistingTrainer }"
          v-model="trainerName"
          placeholder="Enter your name"
          autocomplete="off"
          required
        />

        <button
          type="submit"
          :class="isExistingTrainer ? 'btn-accent' : 'btn-primary'"
          style="width: 100%"
        >
          {{ isExistingTrainer ? "Continue" : "Start" }}
        </button>
      </form>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.home-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  padding: 0.5rem;
  box-sizing: border-box;

  &__content {
    text-align: center;
    transition: all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  &--animating &__content {
    transform: translateY(-55vh) scale(0.3);
    opacity: 0.6;
  }

  &__title {
    font-size: 2rem;
    color: white;
    margin-bottom: 1rem;
    transition: all 0.6s ease;
    text-shadow: var(--text-shadow-heavy);
    line-height: 0;

    @media (max-width: 768px) {
      font-size: 1.5rem;
      line-height: 1.8;
      margin-bottom: 0;
    }
  }

  &__author {
    margin-bottom: 2rem;
    color: var(--color-accent);
    font-weight: 600;
    font-size: 1.1rem;
    text-shadow: var(--text-shadow-light);

    @media (max-width: 768px) {
      margin-top: 0.75rem;
    }
  }

  &__form {
    background: white;
    padding: 2rem;
    box-shadow: var(--shadow-heavy);
    max-width: 320px;
    margin: 0 auto;
    border: 3px solid var(--color-primary);
    // backdrop-filter: blur(10px);
    transition: border-color 0.2s ease;

    &--continue {
      border-color: var(--color-accent);
    }
  }

  &__label {
    display: block;
    margin-bottom: 1.5rem;
    color: var(--color-primary);
    font-weight: 600;
    text-align: center;
    font-size: 0.7rem;
    transition: color 0.2s ease;

    &--continue {
      color: var(--color-accent);
    }
  }

  &__input {
    width: 100%;
    padding: 0.875rem 1rem;
    border: 2px solid var(--color-primary);
    margin-bottom: 1.5rem;
    font-size: 1rem;
    transition: all 0.2s ease;
    background: white;
    box-sizing: border-box;
    text-align: center;

    &--continue {
      border-color: var(--color-accent);

      &:focus {
        border-color: var(--color-accent);
        outline: none;
        box-shadow: none;
      }

      &::placeholder {
        color: var(--color-accent-dark);
      }
    }

    &:focus {
      outline: none;
      box-shadow: none;
    }

    &::placeholder {
      color: var(--color-primary);
      text-align: center;
    }
  }
}
</style>
