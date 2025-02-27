<template>
    <section class="session-overview">
        <div class="container">
            <div class="session-overview__header">
                <h2 id="sessions-heading">Sessions Overview</h2>

                <div class="session-overview__actions">
                    <!-- View toggle button group -->
                    <div class="session-overview__view-toggle" role="group" aria-label="View options">
                        <button 
                            :class="{ 'active': view === 'list' }" 
                            type="button" 
                            @click="toggleView('list')"
                            aria-label="List view" 
                            :aria-pressed="view === 'list'"
                            :aria-current="view === 'list' ? 'page' : undefined"
                        >
                            <SvgIconList aria-hidden="true" />
                            <span class="visually-hidden">List view</span>
                        </button>
                        <button 
                            :class="{ 'active': view === 'table' }" 
                            type="button" 
                            @click="toggleView('table')"
                            aria-label="Table view" 
                            :aria-pressed="view === 'table'"
                            :aria-current="view === 'table' ? 'page' : undefined"
                        >
                            <SvgIconTable aria-hidden="true" />
                            <span class="visually-hidden">Table view</span>
                        </button>
                    </div>

                    <!-- Filter toggle button -->
                    <div class="session-overview__filter-toggle">
                        <button 
                            class="btn btn--secondary btn--icon" 
                            @click="toggleFilters" 
                            aria-label="Toggle filters"
                            :aria-expanded="isFiltersVisible"
                            :aria-controls="isFiltersVisible ? 'session-filters' : undefined"
                        >
                            <SvgIconFilter aria-hidden="true" /> 
                            {{ isFiltersVisible ? 'Hide Filters' : 'Show Filters' }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Session filters component -->
            <SessionFilters 
                id="session-filters"
                :vehicle-types="vehicleTypes" 
                :is-visible="isFiltersVisible"
                @filter-change="handleFilterChange" 
            />

            <!-- Loading state -->
            <div v-if="isLoading" class="session-overview__loading" aria-live="polite">
                <SvgIconSpinner aria-hidden="true" />
                <p>Loading sessions...</p>
            </div>

            <!-- Session views -->
            <div v-else aria-labelledby="sessions-heading">
                <SessionTable 
                    v-if="view === 'table'" 
                    :sessions="filteredSessions" 
                    :filters="filters"
                    :is-filters-visible="isFiltersVisible" 
                    @refresh="handleRefresh" 
                    @toggle-filters="toggleFilters" 
                />
                <SessionList 
                    v-else 
                    :sessions="filteredSessions" 
                    :filters="filters" 
                    @refresh="handleRefresh" 
                />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import type { SessionFilters } from './SessionFilters.vue';
import { parkingService } from '~/services/parkingService';
import type { ParkingSession } from '~/services/parkingService';
import { toastService } from '~/services/toastService';
import { API_ERRORS } from '~/utils/constants';

const sessions = ref<ParkingSession[]>([]);
const vehicleTypes = ref<string[]>([]);
const view = ref('table');
const isFiltersVisible = ref(false);
const isLoading = ref(false);

// Initialize filters state
const filters = reactive<SessionFilters>({
    hideEndedSessions: false,
    parkingSpaceType: 'all',
    startDate: '',
    endDate: ''
});

// Computed property for filtered sessions
const filteredSessions = computed(() => {
    return sessions.value.filter(session => {
        // Filter by session status
        if (filters.hideEndedSessions && session.isSessionEnded) {
            return false;
        }
        
        // Filter by vehicle type
        if (filters.parkingSpaceType !== 'all' && 
            session.vehicleType.toLowerCase() !== filters.parkingSpaceType) {
            return false;
        }
        
        // Filter by start date
        if (filters.startDate && 
            session.sessionStartedAt < new Date(filters.startDate)) {
            return false;
        }
        
        // Filter by end date
        if (filters.endDate && session.sessionEndedAt && 
            session.sessionEndedAt > new Date(filters.endDate)) {
            return false;
        }
        
        return true;
    });
});

// Fetch sessions data
const fetchSessions = async () => {
    isLoading.value = true;
    
    try {
        const parkingSessions = await parkingService.getSessions();
        sessions.value = parkingSessions;
        
        // Extract unique vehicle types
        vehicleTypes.value = Array.from(
            new Set(sessions.value.map(session => session.vehicleType.toLowerCase()))
        );
    } catch (error) {
        toastService.error(API_ERRORS.SESSION_FETCH_FAILED);
        console.error('Error fetching sessions:', error);
    } finally {
        isLoading.value = false;
    }
};

// Toggle between list and table views
const toggleView = (newView: string) => {
    view.value = newView;
};

// Toggle filters visibility
const toggleFilters = () => {
    isFiltersVisible.value = !isFiltersVisible.value;
};

// Handle filter changes from SessionFilters component
const handleFilterChange = (newFilters: SessionFilters) => {
    Object.assign(filters, newFilters);
};

// Handle refresh event from child components
const handleRefresh = async () => {
    await fetchSessions();
};

// Fetch data on component mount
onMounted(async () => {
    await fetchSessions();
});
</script>

<style scoped>
.visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

.session-overview__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
}
</style>