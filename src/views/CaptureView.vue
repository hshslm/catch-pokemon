<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useGameStore } from "@/stores/game";
import ViewFinder from "@/components/ViewFinder.vue";
import GameControls from "@/components/GameControls.vue";
import EventLog from "@/components/EventLog.vue";

const router = useRouter();
const gameStore = useGameStore();

onMounted(() => {
  // Redirect if no userf ound (for refreshes)
  if (!gameStore.trainer.name) {
    router.push("/");
  }
});
</script>

<template>
  <main class="capture-page">
    <header class="capture-page__header">
      <h1 class="capture-page__title font-primary">
        {{ gameStore.trainer.name }}'s Adventure
      </h1>
    </header>

    <div class="capture-page__layout">
      <section class="capture-page__game-area">
        <ViewFinder />
      </section>

      <aside class="capture-page__sidebar">
        <EventLog />
      </aside>
    </div>

    <div class="capture-page__controls">
      <GameControls />
    </div>
  </main>
</template>

<style lang="scss" scoped>
.capture-page {
  height: 100vh;
  background: var(--color-accent);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: 768px) {
    height: auto;
    min-height: 100vh;
    overflow: visible;
    justify-content: flex-start;
  }

  &__header {
    text-align: center;
    margin-bottom: 2rem;
    flex-shrink: 0;

    @media (max-width: 768px) {
      margin-bottom: 1rem;
    }
  }

  &__title {
    color: var(--color-secondary);
    font-size: 1.5rem;
    text-shadow: var(--text-shadow-heavy);
  }

  &__layout {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1rem;
    flex-shrink: 1;
    min-height: 0;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 1rem;
      flex-shrink: 0;
      padding: 0;
    }
  }

  &__game-area {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  &__sidebar {
    @media (max-width: 768px) {
      order: -1;
    }
  }

  &__controls {
    width: 100%;
    max-width: 1200px;
    margin: 2rem auto 0;
    flex-shrink: 0;

    @media (max-width: 768px) {
      margin: 1rem auto 0;
    }
  }
}
</style>
