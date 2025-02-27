import { ref, markRaw, h, render } from 'vue';
import ToastNotification from '~/components/ToastNotification.vue';

export type ToastType = 'success' | 'error' | 'info';

interface ToastOptions {
  message: string;
  type: ToastType;
  duration?: number;
}

// Create a reactive array to store active toasts
const toasts = ref<{ id: number; vnode: any }[]>([]);
let nextId = 0;

/**
 * Creates and shows a toast notification
 */
function showToast(options: ToastOptions): number {
  const id = nextId++;
  
  // Create a div to mount the toast
  const container = document.createElement('div');
  
  // Create the toast vnode
  const vnode = h(ToastNotification, {
    ...options,
    onClose: () => {
      removeToast(id);
    }
  });
  
  // Render the toast
  render(vnode, container);
  document.body.appendChild(container);
  
  // Add to active toasts
  toasts.value.push({ id, vnode: markRaw(vnode) });
  
  return id;
}

/**
 * Removes a toast by ID
 */
function removeToast(id: number): void {
  const index = toasts.value.findIndex(toast => toast.id === id);
  if (index !== -1) {
    const container = toasts.value[index].vnode.el.parentNode;
    render(null, container);
    document.body.removeChild(container);
    toasts.value.splice(index, 1);
  }
}

/**
 * Shows a success toast
 */
function success(message: string, duration = 5000): number {
  return showToast({ message, type: 'success', duration });
}

/**
 * Shows an error toast
 */
function error(message: string, duration = 8000): number {
  return showToast({ message, type: 'error', duration });
}

/**
 * Shows an info toast
 */
function info(message: string, duration = 5000): number {
  return showToast({ message, type: 'info', duration });
}

export const toastService = {
  showToast,
  removeToast,
  success,
  error,
  info
}; 