<template>
  <Teleport to="body">
    <div class="toast-container" aria-live="polite">
      <TransitionGroup name="toast">
        <div 
          v-for="notification in store.notifications" 
          :key="notification.id"
          :class="['toast', `toast--${notification.type}`]"
          role="alert"
        >
          <span class="toast__icon">
            {{ notification.type === 'success' ? '✓' : notification.type === 'error' ? '✕' : 'ℹ' }}
          </span>
          <p class="toast__message">{{ notification.message }}</p>
          <button @click="store.remove(notification.id)" class="toast__close" aria-label="Fechar">&times;</button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useNotificationStore } from '~/stores/notification'
const store = useNotificationStore()
</script>

<style lang="scss" scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 380px;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  background: var(--cor-branco);
  border-left: 4px solid;
  animation: toastIn 0.35s ease-out;

  &--success {
    border-left-color: var(--cor-sucesso);
    .toast__icon { color: var(--cor-sucesso); }
  }

  &--error {
    border-left-color: var(--cor-erro);
    .toast__icon { color: var(--cor-erro); }
  }

  &--info {
    border-left-color: var(--cor-info);
    .toast__icon { color: var(--cor-info); }
  }
}

.toast__icon {
  font-size: 1.2rem;
  font-weight: bold;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.toast__message {
  flex: 1;
  font-size: 0.95rem;
  color: var(--cor-preto);
  line-height: 1.4;
}

.toast__close {
  font-size: 1.3rem;
  color: #999;
  flex-shrink: 0;
  
  &:hover {
    color: var(--cor-preto);
  }
}

/* Transitions */
.toast-enter-active {
  animation: toastIn 0.35s ease-out;
}

.toast-leave-active {
  animation: toastOut 0.3s ease-in forwards;
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
