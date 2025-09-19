<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useGameStore } from "@/stores/game";

const router = useRouter();
const gameStore = useGameStore();

const sortBy = ref("name");
const selectedTypes = ref([]);
const showScrollToTop = ref(false);

const handleScroll = () => {
  showScrollToTop.value = window.scrollY > 400;
};

const scrollToTop = () => {
  showScrollToTop.value = false;

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

onMounted(() => {
  if (!gameStore.trainer.name) {
    router.push("/");
  }
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

const sortOptions = [
  { value: "name", label: "Name" },
  { value: "id", label: "ID" },
  { value: "height", label: "Height" },
  { value: "speed", label: "Speed" },
];

const uniquePokemonList = computed(() => {
  const uniquePokemon = [];

  gameStore.capturedPokemon.forEach((pokemon) => {
    const existing = uniquePokemon.find((p) => p.id === pokemon.id);
    if (existing) {
      existing.count++;
    } else {
      uniquePokemon.push({ ...pokemon, count: 1 });
    }
  });

  return uniquePokemon;
});

const filteredAndSortedPokemon = computed(() => {
  let filtered = uniquePokemonList.value;

  // Filter by selected types
  if (selectedTypes.value.length > 0) {
    filtered = filtered.filter((pokemon) =>
      pokemon.types.some((type) => selectedTypes.value.includes(type)),
    );
  }

  // Sort by selected value
  return filtered.sort((a, b) => {
    const aValue = a[sortBy.value];
    const bValue = b[sortBy.value];

    if (typeof aValue === "string") {
      return aValue.localeCompare(bValue);
    }

    if (sortBy.value === "height" || sortBy.value === "speed") {
      return bValue - aValue;
    }

    return aValue - bValue;
  });
});

const availableTypes = computed(() => {
  const types = new Set();
  gameStore.capturedPokemon.forEach((pokemon) => {
    pokemon.types.forEach((type) => types.add(type));
  });
  return Array.from(types).sort();
});

const filteredStats = computed(() => {
  const totalUnique = filteredAndSortedPokemon.value.length;
  const totalCaptured = filteredAndSortedPokemon.value.reduce(
    (sum, pokemon) => sum + pokemon.count,
    0,
  );
  return { totalUnique, totalCaptured };
});

const formatHeight = (height) => `${(height / 10).toFixed(1)}m`;
const formatWeight = (weight) => `${(weight / 10).toFixed(1)}kg`;

const backToGame = () => {
  router.push("/capture");
};
</script>

<template>
  <div>
    <main class="collection-page">
      <header class="collection-page__header">
        <h1 class="collection-page__title font-primary">
          {{ gameStore.trainer.name }}'s Pokédex
        </h1>
        <button
          class="collection-page__back-btn btn-primary"
          @click="backToGame"
        >
          Back to Game
        </button>
      </header>

      <div
        v-if="gameStore.uniquePokemonCount === 0"
        class="collection-page__empty"
      >
        <p class="collection-page__empty-text font-primary">
          No Pokémon caught yet!
        </p>
        <button
          class="collection-page__empty-btn btn-accent"
          @click="backToGame"
        >
          Start Catching
        </button>
      </div>

      <div v-else class="collection-page__content">
        <!-- Controls -->
        <section class="collection-page__controls">
          <div class="collection-page__sort">
            <label class="collection-page__sort-label font-primary"
              >Sort by:</label
            >
            <div class="collection-page__sort-options">
              <label
                v-for="option in sortOptions"
                :key="option.value"
                class="collection-page__sort-option"
              >
                <input
                  type="radio"
                  :value="option.value"
                  v-model="sortBy"
                  class="collection-page__sort-radio"
                />
                <span class="collection-page__sort-text">{{
                  option.label
                }}</span>
              </label>
            </div>
          </div>

          <div v-if="availableTypes.length > 0" class="collection-page__filter">
            <label class="collection-page__filter-label font-primary"
              >Filter by type:</label
            >
            <div class="collection-page__filter-options">
              <label
                v-for="type in availableTypes"
                :key="type"
                class="collection-page__filter-option"
              >
                <input
                  type="checkbox"
                  :value="type"
                  v-model="selectedTypes"
                  class="collection-page__filter-checkbox"
                />
                <span class="collection-page__filter-text">{{ type }}</span>
              </label>
            </div>
          </div>
        </section>

        <!-- Summary -->
        <section class="collection-page__summary">
          <div class="collection-page__summary-item font-primary">
            Total Unique Pokemon: {{ filteredStats.totalUnique }}
          </div>
          <div class="collection-page__summary-item font-primary">
            Total Captured Pokemon: {{ filteredStats.totalCaptured }}
          </div>
        </section>

        <!-- Pokemon Grid -->
        <section class="collection-page__grid">
          <div
            v-for="pokemon in filteredAndSortedPokemon"
            :key="pokemon.id"
            class="pokemon-card"
          >
            <img
              :src="pokemon.sprite"
              :alt="pokemon.name"
              class="pokemon-card__image"
            />
            <h3 class="pokemon-card__name font-primary">
              #{{ pokemon.id }} {{ pokemon.name }}
            </h3>

            <div class="pokemon-card__types">
              <span
                v-for="type in pokemon.types"
                :key="type"
                class="pokemon-card__type"
                :class="type"
              >
                {{ type }}
              </span>
            </div>

            <div class="pokemon-card__stats">
              <div class="pokemon-card__stat">
                Height: {{ formatHeight(pokemon.height) }}
              </div>
              <div class="pokemon-card__stat">
                Weight: {{ formatWeight(pokemon.weight) }}
              </div>
              <div class="pokemon-card__stat">HP: {{ pokemon.stats.hp }}</div>
              <div class="pokemon-card__stat">
                Speed: {{ pokemon.stats.speed }}
              </div>
              <div class="pokemon-card__stat pokemon-card__stat--count">
                Caught {{ pokemon.count }}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- scroll to top -->
    <Transition name="slide">
      <button
        v-if="showScrollToTop"
        @click="scrollToTop"
        class="scroll-to-top btn-secondary"
      >
        ↑
      </button>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.collection-page {
  min-height: 100vh;
  background: var(--color-accent);
  padding: 1rem;

  &__header {
    text-align: center;
    margin-bottom: 2rem;
  }

  &__title {
    color: var(--color-secondary);
    margin-bottom: 1rem;
    text-shadow: var(--text-shadow-heavy);
    font-size: 1.5rem;
  }

  &__back-btn {
    margin-top: 1rem;
  }

  &__empty {
    text-align: center;
    padding: 3rem;

    &-text {
      font-size: 1.2rem;
      color: white;
      margin-bottom: 2rem;
      text-shadow: var(--text-shadow-light);
    }

    &-btn {
      padding: 0.75rem 2rem;
    }
  }

  &__content {
    max-width: 1200px;
    margin: 0 auto;
  }

  &__controls {
    background: white;
    padding: 1.5rem;
    margin-bottom: 1rem;
    box-shadow: var(--shadow-light);
  }

  &__sort {
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: #f8f9fa;
    border: 2px solid var(--color-secondary);

    &-label {
      display: block;
      margin-bottom: 1rem;
      font-weight: 600;
      color: var(--color-secondary);
      font-size: 0.6rem;
    }

    &-options {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 0.75rem;
    }

    &-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      padding: 0.5rem;
      background: white;
      border: 1px solid #e9ecef;
      transition: all 0.2s;

      &:hover {
        background: #e9ecef;
      }

      &:has(input:checked) {
        background: var(--color-secondary);
        border-color: var(--color-secondary-dark);
        color: white;
      }
    }

    &-radio {
      display: none;
    }

    &-text {
      font-size: 0.85rem;
      font-weight: 500;
    }
  }

  &__filter {
    padding: 1rem;
    background: #f8f9fa;
    border: 2px solid var(--color-primary);

    &-label {
      display: block;
      margin-bottom: 1rem;
      font-weight: 600;
      color: var(--color-primary);
      font-size: 0.6rem;
    }

    &-options {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 0.75rem;
    }

    &-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      padding: 0.5rem;
      background: white;
      border: 1px solid #e9ecef;
      transition: all 0.2s;

      &:hover {
        background: #e9ecef;
      }

      &:has(input:checked) {
        background: var(--color-primary);
        border-color: var(--color-primary-dark);
        color: white;
      }
    }

    &-checkbox {
      display: none;
    }

    &-text {
      text-transform: capitalize;
      font-size: 0.85rem;
      font-weight: 500;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;

    @media (max-width: 768px) {
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 0.75rem;
    }
  }

  &__summary {
    background: white;
    padding: 1rem;
    margin-bottom: 1rem;
    text-align: center;
    box-shadow: var(--shadow-light);
    display: flex;
    justify-content: center;
    gap: 3rem;
    font-weight: 500;

    &-item {
      color: var(--color-secondary);
      font-size: 0.6rem;
    }
  }
}

.pokemon-card {
  background: white;
  padding: 1rem;
  text-align: center;
  box-shadow: var(--shadow-light);
  transition: transform 0.2s;
  border: 2px solid var(--color-accent);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  height: 280px;
  min-width: 200px;

  @media (max-width: 768px) {
    height: 320px;
    min-width: 140px;
  }

  &:hover {
    transform: translateY(-4px);
  }

  &__image {
    width: 80px;
    height: 80px;
    margin: 0 auto;
  }

  &__name {
    font-size: 0.7rem;
    margin: 0;
    color: var(--color-secondary);
    line-height: 1.2;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__types {
    display: flex;
    justify-content: center;
    gap: 0.25rem;
    flex-wrap: wrap;
    min-height: 1.5rem;
    align-items: center;
  }

  &__type {
    padding: 0.15rem 0.4rem;
    color: white;
    font-size: 0.65rem;
    text-transform: capitalize;
  }

  &__stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    font-size: 0.75rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 0.25rem;
    }
  }

  &__stat {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    padding: 0.4rem;
    color: var(--color-secondary);
    font-weight: 500;
    font-size: 0.7rem;

    &--count {
      grid-column: 1 / 3;
      font-weight: 600;
      color: var(--color-accent-dark);
      background: var(--color-accent);
      border-color: var(--color-accent-dark);
      color: #333;

      @media (max-width: 768px) {
        grid-column: 1;
      }
    }
  }
}

.scroll-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3rem;
  height: 3rem;
  font-size: 1.2rem;
  // font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-right: 1.2rem;
  z-index: 1000;
  box-shadow: var(--shadow-heavy);
  transition: transform 0.3s ease;
  font-family: "Press Start 2P";

  &:hover {
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    bottom: 1rem;
    right: 1rem;
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1rem;
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(100px);
}
</style>
