<template>
    <section class="session-table" role="region" aria-label="Parking sessions table view">
        <table aria-label="Parking Sessions">
            <caption class="visually-hidden">List of parking sessions with details</caption>
            <thead>
                <tr>
                    <th scope="col">Status</th>
                    <th scope="col">Parking Session ID</th>
                    <th scope="col">Vehicle Type</th>
                    <th scope="col">Vehicle Number</th>
                    <th scope="col">Entry Time</th>
                    <th scope="col">Exit Time</th>
                    <th scope="col">Parking Space</th>
                    <th scope="col">Rate</th>
                    <th scope="col">Session Length</th>
                    <th scope="col">Total Price</th>
                    <th scope="col"><span class="visually-hidden">Actions</span></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="session in sessions" :key="session.parkingSessionId">
                    <td>
                        <span 
                            v-if="session.isSessionEnded" 
                            class="session-table__status"
                            aria-label="Session ended"
                        >
                            <SvgIconCheck aria-hidden="true" />
                        </span>
                        <span 
                            v-else 
                            class="session-table__status"
                            aria-label="Session in progress"
                        >
                            <SvgIconSpinner aria-hidden="true" />
                        </span>
                    </td>
                    <td>{{ session.parkingSessionId }}</td>
                    <td>{{ session.vehicleType }}</td>
                    <td>{{ session.vehicleLicensePlate }}</td>
                    <td>{{ formatDate(session.sessionStartedAt) }}</td>
                    <td>{{ session.sessionEndedAt ? formatDate(session.sessionEndedAt) : 'Ongoing' }}</td>
                    <td>{{ getParkingSpaceName(session.parkingSpaceId) }}</td>
                    <td>€{{ session.rate }},-</td>
                    <td>{{ formatDuration(session.sessionLengthInHoursMinutes) }}</td>
                    <td>€{{ calculateTotalPrice(session) }},-</td>
                    <td>
                        <SessionEnd 
                            v-if="!session.isSessionEnded" 
                            :parkingSessionId="session.parkingSessionId" 
                            @success="handleRefresh" 
                        />
                    </td>
                </tr>
                <tr v-if="sessions.length === 0">
                    <td colspan="11" class="text-center" aria-live="polite">No sessions found matching your filters</td>
                </tr>
            </tbody>
        </table>
    </section>
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
    isFiltersVisible: boolean;
}>();

// Define emits
const emit = defineEmits(['refresh', 'toggle-filters']);

// Handle refresh event from child components
const handleRefresh = () => {
    emit('refresh');
};

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