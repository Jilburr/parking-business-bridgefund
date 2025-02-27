<template>
  <Teleport to="body">
    <div 
      v-if="isVisible" 
      class="toast-notification" 
      :class="[`toast-notification--${type}`]"
      role="alert"
      aria-live="assertive"
      :aria-atomic="true"
    >
      <div class="toast-notification__content">
        <button 
          class="toast-notification__close" 
          @click="close" 
          aria-label="Close notification"
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <div class="toast-notification__icon" aria-hidden="true">
          <svg-icon-check v-if="type === 'success'" />
          <svg-icon-alert v-else-if="type === 'error'" />
          <svg-icon-info v-else />
        </div>
        <div class="toast-notification__message">
          <p>{{ message }}</p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps<{
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  onClose?: () => void;
}>();

const isVisible = ref(false);
let timer: number | null = null;

const close = () => {
  isVisible.value = false;
  if (props.onClose) {
    props.onClose();
  }
};

onMounted(() => {
  isVisible.value = true;
  
  // Auto-close after duration
  if (props.duration !== 0) {
    timer = window.setTimeout(() => {
      close();
    }, props.duration || 5000);
  }
});

onBeforeUnmount(() => {
  if (timer) {
    clearTimeout(timer);
  }
});
</script>