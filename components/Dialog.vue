<template>
    <div class="dialog" role="dialog" aria-labelledby="dialog-title">
        <div class="dialog__content">
            <h2 id="dialog-title">{{ title }}</h2>
            <p>{{ message }}</p>
            <div class="dialog__actions">
                <button 
                    class="btn btn--secondary" 
                    @click="emit('cancel')"
                    :disabled="isLoading"
                    aria-label="Cancel ending session"
                >
                    Cancel
                </button>
                <button 
                    class="btn btn--abort" 
                    @click="emit('confirm')"
                    :disabled="isLoading"
                    aria-label="Confirm ending session"
                >
                    <template v-if="isLoading" aria-hidden="true">
                        <SvgIconSpinner />
                    </template>
                    <template v-else>{{ buttonLabel }}</template>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const isLoading = ref(false);

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    buttonLabel: {
        type: String,
        required: true
    }
});

const emit = defineEmits(['cancel', 'confirm']);
</script>