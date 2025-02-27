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
                    class="session-list__status session-list__status--ended"
                    aria-label="Session ended"
                >
                    <SvgIconCheck aria-hidden="true" />
                </span>
                <span 
                    v-else 
                    class="session-list__status session-list__status--active"
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
                    <p class="session-list__detail-value">{{ formatDuration(session.sessionLengthInHoursMinutes) }}</p>
                </div>
                <div class="session-list__detail-item">
                    <label class="session-list__detail-label">Parking Rate</label>
                    <p class="session-list__detail-value">€{{ session.rate }},-</p>
                </div>
                <div class="session-list__detail-item">
                    <label class="session-list__detail-label">Total Price</label>
                    <p class="session-list__detail-value">€{{ calculateTotalPrice(session) }},-</p>
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
.session-list {
    margin-bottom: 2rem;
}

.session-list__empty {
    padding: 2rem;
    text-align: center;
    background-color: #f9f9f9;
    border-radius: 4px;
}

.session-list__item {
    margin-bottom: 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
}

.session-list__summary {
    display: flex;
    align-items: center;
    padding: 1rem;
    cursor: pointer;
    background-color: #f9f9f9;
    position: relative;
}

.session-list__summary::-webkit-details-marker {
    display: none;
}

.session-list__status {
    margin-right: 1rem;
}

.session-list__status--ended {
    color: #67c23a;
}

.session-list__status--active {
    color: #409eff;
}

.session-list__title {
    margin: 0 1rem 0 0;
    font-size: 1.1rem;
}

.session-list__info {
    margin: 0 1rem 0 0;
    font-size: 0.9rem;
}

.session-list__label {
    font-weight: 500;
}

.session-list__details {
    padding: 1rem;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
    background-color: #fff;
}

.session-list__detail-item {
    margin-bottom: 0.5rem;
}

.session-list__detail-label {
    display: block;
    font-size: 0.8rem;
    color: #666;
    margin-bottom: 0.25rem;
}

.session-list__detail-value {
    margin: 0;
    font-weight: 500;
}

.session-list__actions {
    grid-column: 1 / -1;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e0e0e0;
}
</style>