<template>
  <section class="parking-building">
    <div class="container container--margin">
      <h2 class="section__heading">Dashboard<span class="badge badge--danger" aria-label="Live status">Live</span>
      </h2>
      <details open>
        <summary class="parking-building__summary">
          <h3>Amsteldijk 216 <span class="parking-building__active-sessions" aria-live="polite">{{
            activeSessions }} Active sessions</span></h3>
          <SvgIconChevron aria-hidden="true" />
        </summary>
        <ParkingSpace :parkingSpaces="parkingSpaces" />
      </details>

      <!-- Loading state -->
      <div v-if="isLoading" class="parking-building__loading" aria-live="polite">
        <SvgIconSpinner aria-hidden="true" />
        <p>Loading parking spaces...</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { parkingService } from '~/services/parkingService';
const isLoading = ref(false);
const parkingSpaces = ref([]);

// Computed property for active sessions
const activeSessions = computed(() => {
  let count = 0;
  for (const parkingSpace of parkingSpaces.value) {
    count += Math.abs(parkingSpace.occupancy);
  }
  return count;
});

onMounted(async () => {
  try {
    isLoading.value = true;
    const spaces = await parkingService.getSpaces();
    parkingSpaces.value = spaces;
  } finally {
    isLoading.value = false;
  }
});
</script>