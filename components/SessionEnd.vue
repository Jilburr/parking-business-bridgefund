<template>
    <div>
        <button 
            class="btn btn--abort" 
            @click="showDialog" 
            :disabled="isLoading"
            aria-label="End parking session"
        >
            <template v-if="isLoading" aria-hidden="true">
                <SvgIconSpinner />
            </template>
            <template v-else>
                End Session
            </template>
        </button>

        <!-- Confirmation Dialog -->
        <Dialog 
            v-if="isDialogVisible" 
            title="Confirm End Session" 
            message="Are you sure you want to end this parking session?" 
            buttonLabel="End Session" 
            @cancel="cancelDialog" 
            @confirm="endSession" 
        />
    </div>
</template>

<script setup lang="ts">
import { parkingService } from '~/services/parkingService';

const emit = defineEmits(['success']);
const props = defineProps({
    parkingSessionId: {
        type: String,
        required: true
    }
});

const isLoading = ref(false);
const isDialogVisible = ref(false);

// Show confirmation dialog
const showDialog = () => {
    isDialogVisible.value = true;
};

// Cancel confirmation
const cancelDialog = () => {
    isDialogVisible.value = false;
};

// End the parking session
const endSession = async () => {
    isLoading.value = true;
    
    try {
        const success = await parkingService.endSession(props.parkingSessionId);
        
        if (success) {
            emit('success');
        }
    } finally {
        isLoading.value = false;
        isDialogVisible.value = false;
    }
};
</script>