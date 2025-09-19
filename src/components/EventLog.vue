<script setup>
import { ref, computed } from "vue";
import { useGameStore } from "@/stores/game";

const gameStore = useGameStore();
const logContainer = ref(null);

const sortedEventLog = computed(() => {
  return gameStore.eventLog.slice().sort((a, b) => {
    const dateA = new Date(a.dateTime || a.id);
    const dateB = new Date(b.dateTime || b.id);
    return dateB - dateA;
  });
});
</script>

<template>
  <div class="event-log">
    <h3 class="event-log__title font-primary">Event Log</h3>

    <div ref="logContainer" class="event-log__content">
      <div
        v-for="event in sortedEventLog"
        :key="event.id"
        class="event-log__entry"
      >
        <span class="event-log__timestamp">{{ event.timestamp }}</span>
        <span class="event-log__message">{{ event.message }}</span>
      </div>
    </div>

    <div class="event-log__stats">
      <div class="event-log__stat font-primary">
        Caught: {{ gameStore.totalCapturedCount }}
      </div>
      <div class="event-log__stat font-primary">
        Unique: {{ gameStore.uniquePokemonCount }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.event-log {
  background: white;
  overflow: hidden;
  box-shadow: var(--shadow-light);
  display: flex;
  flex-direction: column;
  height: 470px;
  border: 3px solid var(--color-secondary);
  box-sizing: border-box;

  @media (max-width: 768px) {
    height: 250px;
  }

  &__title {
    padding: 1rem;
    margin: 0;
    background: var(--color-secondary);
    color: white;
    font-size: 0.9rem;
    text-shadow: var(--text-shadow-light);
  }

  &__content {
    flex: 1;
    overflow-y: auto;
    padding: 0 1rem;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--color-accent);

      &:hover {
        background: var(--color-accent-dark);
      }
    }
  }

  &__empty {
    color: var(--color-secondary);
    text-align: center;
    padding: 2rem 0;
    font-weight: 500;
    font-style: italic;
  }

  &__entry {
    padding: 0.5rem;
    border-bottom: 1px solid #eee;

    &:last-child {
      border-bottom: none;
    }
  }

  &__timestamp {
    display: block;
    font-size: 0.75rem;
    color: var(--color-secondary);
    margin-bottom: 0.25rem;
  }

  &__message {
    color: var(--color-primary);
    font-size: 0.9rem;
    font-weight: 500;
  }

  &__stats {
    display: flex;
    justify-content: space-around;
    padding: 0.75rem;
    background: var(--color-accent);
    border-top: 1px solid #eee;
    font-size: 0.6rem;
    font-weight: 600;
  }

  &__stat {
    color: var(--color-secondary);
  }
}
</style>
