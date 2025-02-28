<template>
    <div class="session-list" role="region" aria-label="Parking sessions list view">
        <div v-if="sessions.length === 0" class="session-list__empty" aria-live="polite">
            <p>No sessions found matching your filters</p>
        </div>
        <details 
            v-for="session in sessions" 
            :key="session.parkingSessionId"
            class="session-list__item"
        >
            <summary class="session-list__summary">
                <span 
                    v-if="session.isSessionEnded" 
                    class="session-list__status"
                    aria-label="Session ended"
                >
                    <SvgIconCheck aria-hidden="true" />
                </span>
                <span 
                    v-else 
                    class="session-list__status"
                    aria-label="Session in progress"
                >
                    <SvgIconSpinner aria-hidden="true" />
                </span>
                <h3 class="session-list__title">{{ session.vehicleLicensePlate }}</h3>
                <p class="session-list__info">{{ session.vehicleType }}</p>
                <p class="session-list__info">
                    <span class="session-list__label">Started:</span> 
                    {{ formatDate(session.sessionStartedAt) }}
                </p>
                <p class="session-list__info">
                    <span class="session-list__label">Ended:</span> 
                    {{ session.sessionEndedAt ? formatDate(session.sessionEndedAt) : 'Ongoing' }}
                </p>
                <SvgIconChevron :size="'16'" aria-hidden="true" />
            </summary>
            <div class="session-list__details">
                <div class="session-list__detail-item">
                    <label class="session-list__detail-label">Parking session ID</label>
                    <p class="session-list__detail-value">{{ session.parkingSessionId }}</p>
                </div>
                <div class="session-list__detail-item">
                    <label class="session-list__detail-label">Parking Location</label>
                    <p class="session-list__detail-value">{{ getParkingSpaceName(session.parkingSpaceId) }}</p>
                </div>
                <div class="session-list__detail-item">
                    <label class="session-list__detail-label">Parking Duration</label>
                    <p class="session-list__detail-value">
                        <template v-if="session.isSessionEnded">
                            {{ formatDuration(session.sessionLengthInHoursMinutes) }}
                        </template>
                        <template v-else>
                            Ongoing
                        </template>
                    </p>
                </div>
                <div class="session-list__detail-item">
                    <label class="session-list__detail-label">Parking Rate</label>
                    <p class="session-list__detail-value">€{{ session.rate }},-</p>
                </div>
                <div class="session-list__detail-item">
                    <label class="session-list__detail-label">Total Price</label>
                    <p class="session-list__detail-value">
                        <template v-if="session.isSessionEnded">
                            €{{ calculateTotalPrice(session) }},-
                        </template>
                        <template v-else>
                            Ongoing
                        </template>
                    </p>
                </div>
                <div v-if="!session.isSessionEnded" class="session-list__actions">
                    <SessionEnd 
                        :parkingSessionId="session.parkingSessionId" 
                        @success="$emit('refresh')" 
                    />
                </div>
            </div>
        </details>
    </div>
</template>

<script setup lang="ts">
import type { SessionFilters } from './SessionFilters.vue';
import { PARKING_SPACE_NAMES } from '~/utils/constants';

// Define types for the session data
interface ParkingSession {
    parkingSessionId: string;
    vehicleType: string;
    vehicleLicensePlate: string;
    sessionStartedAt: Date;
    sessionEndedAt: Date | null;
    isSessionEnded: boolean;
    parkingSpaceId: number;
    rate: number;
    sessionLengthInHoursMinutes: number;
}

// Define props with proper types
const props = defineProps<{
    sessions: ParkingSession[];
    filters: SessionFilters;
}>();

// Define emits
const emit = defineEmits(['refresh']);

// Format date for display
const formatDate = (date: Date): string => {
    return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Format duration for display
const formatDuration = (minutes: number): string => {
    const hours = minutes / 60;
    return `${hours.toFixed(2)} hr`;
};

// Calculate total price
const calculateTotalPrice = (session: ParkingSession): string => {
    return (session.rate * (session.sessionLengthInHoursMinutes / 60)).toFixed(2);
};

// Get parking space name
const getParkingSpaceName = (parkingSpaceId: number): string => {
    return PARKING_SPACE_NAMES[parkingSpaceId as keyof typeof PARKING_SPACE_NAMES] || 'Unknown';
};
</script>

<style scoped>

</style>