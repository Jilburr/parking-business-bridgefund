<template>
    <div>
        <button 
            class="btn btn--abort" 
            @click="showConfirmation" 
            :disabled="isLoading"
            aria-label="End parking session"
        >
            <span v-if="isLoading" aria-hidden="true">
                <SvgIconSpinner />
            </span>
            <span v-else>End Session</span>
        </button>

        <!-- Confirmation Dialog -->
        <div v-if="isConfirmationVisible" class="confirmation-dialog" role="dialog" aria-labelledby="dialog-title">
            <div class="confirmation-dialog__content">
                <h2 id="dialog-title">Confirm End Session</h2>
                <p>Are you sure you want to end this parking session?</p>
                <div class="confirmation-dialog__actions">
                    <button 
                        class="btn btn--secondary" 
                        @click="cancelConfirmation"
                        :disabled="isLoading"
                        aria-label="Cancel ending session"
                    >
                        Cancel
                    </button>
                    <button 
                        class="btn btn--abort" 
                        @click="endSession"
                        :disabled="isLoading"
                        aria-label="Confirm ending session"
                    >
                        <span v-if="isLoading" aria-hidden="true">
                            <SvgIconSpinner />
                        </span>
                        <span v-else>End Session</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { parkingService } from '~/services/parkingService';

const emit = defineEmits(['success']);
const props = defineProps({
    parkingSessionId: {
        type: String,
        required: true
    }
});

const isLoading = ref(false);
const isConfirmationVisible = ref(false);

// Show confirmation dialog
const showConfirmation = () => {
    isConfirmationVisible.value = true;
};

// Cancel confirmation
const cancelConfirmation = () => {
    isConfirmationVisible.value = false;
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
        isConfirmationVisible.value = false;
    }
};
</script>

<style scoped>
.confirmation-dialog {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.confirmation-dialog__content {
    background-color: white;
    padding: 24px;
    border-radius: 4px;
    max-width: 400px;
    width: 100%;
}

.confirmation-dialog__actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
}
</style>