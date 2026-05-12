<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-card__icon">◉</div>
      <h1 class="login-card__titulo">Acessar Conta</h1>
      <p class="login-card__subtitulo">Faça login para gerenciar seus pedidos.</p>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">E-mail</label>
          <input 
            type="email" 
            id="email"
            v-model="email" 
            placeholder="seu@email.com" 
            required
            autocomplete="username"
            :class="{ 'input-error': errorMsg }"
          >
        </div>
        
        <div class="form-group">
          <label for="senha">Senha</label>
          <div class="password-wrapper">
            <input 
              :type="showPassword ? 'text' : 'password'" 
              id="senha"
              v-model="senha" 
              placeholder="••••••••" 
              required
              autocomplete="current-password"
              :class="{ 'input-error': errorMsg }"
            >
            <button type="button" class="toggle-password" @click="showPassword = !showPassword" tabindex="-1">
              {{ showPassword ? '🙈' : '👁' }}
            </button>
          </div>
        </div>

        <Transition name="error-msg">
          <p v-if="errorMsg" class="error-message">{{ errorMsg }}</p>
        </Transition>
        
        <button type="submit" class="login-btn" :disabled="isLoading">
          <span v-if="isLoading" class="spinner"></span>
          <span v-else>Entrar</span>
        </button>
      </form>
      
      <p class="login-card__cadastro">
        Ainda não tem conta? <NuxtLink to="/cadastro">Cadastre-se</NuxtLink>
      </p>

      <div class="login-card__demo">
        <p><strong>Demo:</strong> admin@email.com / 123456</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useNotificationStore } from '~/stores/notification'

useHead({ title: 'Login | StabArts' })

const authStore = useAuthStore()
const notify = useNotificationStore()
const router = useRouter()

const email = ref('')
const senha = ref('')
const errorMsg = ref('')
const isLoading = ref(false)
const showPassword = ref(false)

const handleLogin = async () => {
  errorMsg.value = ''
  isLoading.value = true

  try {
    await authStore.login(email.value, senha.value)
    notify.success(`Bem-vindo, ${authStore.userName}!`)
    router.push('/')
  } catch (err: any) {
    errorMsg.value = err.data?.message || 'Email ou senha inválidos.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: 40px 20px;
  animation: fadeInUp 0.4s ease;
}

.login-card {
  width: 100%;
  max-width: 440px;
  padding: 40px;
  border: 1px solid var(--cor-cinza);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  text-align: center;
  background: var(--cor-branco);
}

.login-card__icon {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.login-card__titulo {
  font-family: var(--fonte-secundaria);
  font-size: 1.8rem;
  color: var(--cor-principal);
  margin-bottom: 8px;
}

.login-card__subtitulo {
  color: var(--cor-cinza-escuro);
  margin-bottom: 30px;
  font-size: 0.95rem;
}

.login-form {
  text-align: left;
}

.form-group {
  margin-bottom: 20px;

  label {
    display: block;
    font-weight: 600;
    margin-bottom: 6px;
    font-size: 0.9rem;
  }
  
  input {
    width: 100%;
    padding: 12px 14px;
    border: 1px solid #ddd;
    border-radius: var(--radius-sm);
    font-size: 1rem;
    transition: border-color 0.3s;
    
    &:focus {
      outline: none;
      border-color: var(--cor-principal);
      box-shadow: 0 0 0 3px rgba(237, 63, 63, 0.1);
    }

    &.input-error {
      border-color: var(--cor-erro);
    }
  }
}

.password-wrapper {
  position: relative;

  input {
    padding-right: 45px;
  }
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.1rem;
  padding: 4px;
}

.error-message {
  color: var(--cor-erro);
  font-size: 0.9rem;
  margin-bottom: 15px;
  padding: 10px 14px;
  background: rgba(198, 40, 40, 0.06);
  border-radius: var(--radius-sm);
  border: 1px solid rgba(198, 40, 40, 0.15);
}

.error-msg-enter-active, .error-msg-leave-active {
  transition: all 0.3s ease;
}
.error-msg-enter-from, .error-msg-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.login-btn {
  width: 100%;
  background: var(--cor-principal);
  color: var(--cor-branco);
  padding: 14px;
  font-weight: bold;
  font-size: 1.1rem;
  border-radius: var(--radius-sm);
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover:not(:disabled) { background: var(--cor-preto); }
  &:disabled { opacity: 0.7; cursor: not-allowed; }
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top-color: var(--cor-branco);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.login-card__cadastro {
  margin-top: 25px;
  font-size: 0.95rem;
  color: var(--cor-cinza-escuro);

  a {
    color: var(--cor-principal);
    font-weight: bold;
    
    &:hover { text-decoration: underline; }
  }
}

.login-card__demo {
  margin-top: 20px;
  padding: 10px 14px;
  background: var(--cor-cinza);
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  color: var(--cor-cinza-escuro);
}
</style>
