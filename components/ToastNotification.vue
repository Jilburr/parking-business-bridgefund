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

<style scoped>
.toast-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  max-width: 350px;
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slide-in 0.3s ease-out;
}

.toast-notification--success {
  background-color: #f0f9eb;
  border-left: 4px solid #67c23a;
}

.toast-notification--error {
  background-color: #fef0f0;
  border-left: 4px solid #f56c6c;
}

.toast-notification--info {
  background-color: #f4f4f5;
  border-left: 4px solid #909399;
}

.toast-notification__content {
  display: flex;
  align-items: flex-start;
}

.toast-notification__icon {
  margin-right: 12px;
  display: flex;
  align-items: center;
}

.toast-notification__message {
  flex: 1;
}

.toast-notification__close {
  position: absolute;
  top: 8px;
  right: 8px;
  background: transparent;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #909399;
}

@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style> 