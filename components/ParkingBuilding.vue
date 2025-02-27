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
        </div>
    </section>
</template>

<script setup>
const config = useRuntimeConfig();
const token = getBearer();
const parkingSpaces = ref([]);
// Computed property for active sessions
const activeSessions = computed(() => {
    let count = 0;
    for (const parkingSpace of parkingSpaces.value) {
        count += Math.abs(parkingSpace.occupancy);
    }
    return count;
});
try {
    const { data, status } = await useFetch(`${config.public.apiBase}/parking/spaces/list`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    })

    if (status.value === 'success' && data.value?.data?.parkingSpaces) {
        parkingSpaces.value = data.value?.data?.parkingSpaces;
    }
} catch (error) {
    console.error('Error fetching parking spaces:', error);
}
</script>