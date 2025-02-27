<template>
    <div class="session-filters" :class="{ 'active': isVisible }" :aria-hidden="!isVisible">
        <form @submit.prevent aria-labelledby="filter-heading">
            <h3 id="filter-heading" class="session-filters__heading">Filter Options</h3>
            
            <div class="session-filters__group">
                <div class="session-filters__control">
                    <input 
                        type="checkbox" 
                        id="hideEndedSessions" 
                        v-model="filters.hideEndedSessions" 
                        @change="emitFilterChange"
                        aria-label="Hide Ended Sessions" 
                    />
                    <label for="hideEndedSessions">Hide Ended Sessions</label>
                </div>
                
                <div class="session-filters__control">
                    <label for="parkingSpaceType">Parking Space Type</label>
                    <select 
                        id="parkingSpaceType" 
                        v-model="filters.parkingSpaceType" 
                        @change="emitFilterChange"
                        aria-label="Filter by parking space type"
                    >
                        <option value="all">All</option>
                        <option v-for="type in vehicleTypes" :key="type" :value="type">
                            {{ type.charAt(0).toUpperCase() + type.slice(1) }}
                        </option>
                    </select>
                </div>
                
                <div class="session-filters__control">
                    <label for="startDate">Start Date</label>
                    <input 
                        type="date" 
                        id="startDate" 
                        v-model="filters.startDate" 
                        @change="emitFilterChange"
                        aria-label="Filter by start date" 
                        aria-describedby="startDateHelp"
                    />
                    <small id="startDateHelp" class="session-filters__help">
                        Show sessions starting from this date
                    </small>
                </div>
                
                <div class="session-filters__control">
                    <label for="endDate">End Date</label>
                    <input 
                        type="date" 
                        id="endDate" 
                        v-model="filters.endDate" 
                        @change="emitFilterChange"
                        aria-label="Filter by end date" 
                        aria-describedby="endDateHelp"
                    />
                    <small id="endDateHelp" class="session-filters__help">
                        Show sessions ending before this date
                    </small>
                </div>
            </div>
            
            <div class="session-filters__actions">
                <button 
                    type="button" 
                    class="btn btn--secondary" 
                    @click="resetFilters"
                    aria-label="Reset all filters"
                >
                    Reset Filters
                </button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

// Define filter interface
export interface SessionFilters {
    hideEndedSessions: boolean;
    parkingSpaceType: string;
    startDate: string;
    endDate: string;
}

// Define props
const props = defineProps<{
    vehicleTypes: string[];
    isVisible?: boolean;
    id?: string;
}>();

// Define emits
const emit = defineEmits(['filter-change', 'toggle']);

// Initialize filter state with reactive object
const filters = reactive<SessionFilters>({
    hideEndedSessions: false,
    parkingSpaceType: 'all',
    startDate: '',
    endDate: ''
});

// Emit filter change event
const emitFilterChange = () => {
    emit('filter-change', { ...filters });
};

// Reset filters to default values
const resetFilters = () => {
    filters.hideEndedSessions = false;
    filters.parkingSpaceType = 'all';
    filters.startDate = '';
    filters.endDate = '';
    emitFilterChange();
};
</script>
