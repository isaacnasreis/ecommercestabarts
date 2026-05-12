<template>
  <div class="cadastro-page">
    <div class="cadastro-card">
      <div class="cadastro-card__icon">✦</div>
      <h1 class="cadastro-card__titulo">Criar Conta</h1>
      <p class="cadastro-card__subtitulo">Cadastre-se para começar a comprar.</p>
      
      <form @submit.prevent="handleRegister" class="cadastro-form">
        <div class="form-group">
          <label for="nome">Nome completo</label>
          <input 
            type="text" 
            id="nome"
            v-model="nome" 
            placeholder="Seu nome" 
            required
            minlength="2"
          >
        </div>

        <div class="form-group">
          <label for="email">E-mail</label>
          <input 
            type="email" 
            id="email"
            v-model="email" 
            placeholder="seu@email.com" 
            required
            autocomplete="username"
          >
        </div>
        
        <div class="form-group">
          <label for="senha">Senha</label>
          <input 
            type="password" 
            id="senha"
            v-model="senha" 
            placeholder="Mínimo 3 caracteres" 
            required
            minlength="3"
            autocomplete="new-password"
          >
        </div>

        <div class="form-group">
          <label for="confirmarSenha">Confirmar Senha</label>
          <input 
            type="password" 
            id="confirmarSenha"
            v-model="confirmarSenha" 
            placeholder="Repita a senha" 
            required
            autocomplete="new-password"
            :class="{ 'input-error': senhasDiferentes }"
          >
          <p v-if="senhasDiferentes" class="field-error">As senhas não conferem</p>
        </div>

        <Transition name="error-msg">
          <p v-if="errorMsg" class="error-message">{{ errorMsg }}</p>
        </Transition>
        
        <button type="submit" class="cadastro-btn" :disabled="isLoading || senhasDiferentes">
          <span v-if="isLoading" class="spinner"></span>
          <span v-else>Cadastrar</span>
        </button>
      </form>
      
      <p class="cadastro-card__login">
        Já tem uma conta? <NuxtLink to="/login">Faça login</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useNotificationStore } from '~/stores/notification'

useHead({ title: 'Cadastro | StabArts' })

const authStore = useAuthStore()
const notify = useNotificationStore()
const router = useRouter()

const nome = ref('')
const email = ref('')
const senha = ref('')
const confirmarSenha = ref('')
const errorMsg = ref('')
const isLoading = ref(false)

const senhasDiferentes = computed(() => {
  return confirmarSenha.value.length > 0 && senha.value !== confirmarSenha.value
})

const handleRegister = async () => {
  if (senhasDiferentes.value) return
  
  errorMsg.value = ''
  isLoading.value = true

  try {
    await authStore.register(nome.value, email.value, senha.value)
    notify.success('Conta criada com sucesso! Faça login.')
    router.push('/login')
  } catch (err: any) {
    errorMsg.value = err.data?.message || 'Erro ao criar conta. Tente novamente.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.cadastro-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: 40px 20px;
  animation: fadeInUp 0.4s ease;
}

.cadastro-card {
  width: 100%;
  max-width: 440px;
  padding: 40px;
  border: 1px solid var(--cor-cinza);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  text-align: center;
  background: var(--cor-branco);
}

.cadastro-card__icon {
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: var(--cor-principal);
}

.cadastro-card__titulo {
  font-family: var(--fonte-secundaria);
  font-size: 1.8rem;
  color: var(--cor-principal);
  margin-bottom: 8px;
}

.cadastro-card__subtitulo {
  color: var(--cor-cinza-escuro);
  margin-bottom: 30px;
  font-size: 0.95rem;
}

.cadastro-form {
  text-align: left;
}

.form-group {
  margin-bottom: 18px;

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

.field-error {
  color: var(--cor-erro);
  font-size: 0.82rem;
  margin-top: 4px;
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

.error-msg-enter-active, .error-msg-leave-active { transition: all 0.3s ease; }
.error-msg-enter-from, .error-msg-leave-to { opacity: 0; transform: translateY(-5px); }

.cadastro-btn {
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

.cadastro-card__login {
  margin-top: 25px;
  font-size: 0.95rem;
  color: var(--cor-cinza-escuro);

  a {
    color: var(--cor-principal);
    font-weight: bold;
    &:hover { text-decoration: underline; }
  }
}
</style>
