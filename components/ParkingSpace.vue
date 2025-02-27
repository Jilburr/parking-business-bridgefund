<template>
    <div class="parking-space">
        <div class="parking-space__column" v-for="space in parkingSpaces" :key="space.parkingSpaceId">
            <h4 v-if="space.vehicleType === 'CAR'"><SvgIconCar :size="'24'" />Car Spaces</h4>
            <h4 v-else-if="space.vehicleType === 'MOTOR'"><SvgIconMotor :size="'24'" />Motorcycle Spaces</h4>
            <h4 v-else><SvgIconHouse :size="'24'" />Residential Spaces</h4>
            <div class="parking-space__info">
                <p>Capacity - <span>{{ space.capacity }}</span></p>
                <p>Occupied - <span>{{ Math.abs(space.occupancy) }}</span></p>
                <p>Available - <span>{{ space.capacity - Math.abs(space.occupancy) }}</span></p>
            </div>
            <div class="parking-space__bar">
                <div class="parking-space__bar parking-space__bar-fill" :style="{ width: `${Math.abs(space.occupancy) / space.capacity * 100}%` }"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
    const props = defineProps({
        parkingSpaces: {
            type: Array,
            required: true
        }
    })
</script>
