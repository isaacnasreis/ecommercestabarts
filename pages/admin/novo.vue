<template>
  <div class="admin-form-page container">
    <NuxtLink to="/admin" class="voltar-link">← Voltar ao painel</NuxtLink>

    <h1 class="form-title">Adicionar Produto</h1>

    <form @submit.prevent="handleSubmit" class="produto-form">
      <!-- Preview da imagem -->
      <div class="form-preview">
        <div class="preview-box">
          <img v-if="form.imagem" :src="form.imagem" alt="Preview" class="preview-img" @error="imgError = true">
          <div v-else class="preview-placeholder">
            <span>🖼</span>
            <p>Preview da imagem</p>
          </div>
        </div>
      </div>

      <div class="form-fields">
        <div class="form-group">
          <label for="imagem">URL da Imagem</label>
          <input type="url" id="imagem" v-model="form.imagem" placeholder="https://exemplo.com/imagem.jpg" required>
        </div>

        <div class="form-group">
          <label for="nome">Nome do Produto</label>
          <input type="text" id="nome" v-model="form.nome" placeholder="Ex: Pincéis Premium" required>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="preco">Preço</label>
            <input type="text" id="preco" v-model="form.preco" placeholder="49,99" required>
          </div>
          <div class="form-group">
            <label for="precoAntigo">Preço Antigo</label>
            <input type="text" id="precoAntigo" v-model="form.precoAntigo" placeholder="99,99">
          </div>
        </div>

        <div class="form-group">
          <label for="departamento">Departamento</label>
          <select id="departamento" v-model="form.departamento" required>
            <option value="">Selecione...</option>
            <option value="Quadros">Quadros</option>
            <option value="Materias">Materiais</option>
            <option value="Molduras">Molduras</option>
            <option value="Esculturas">Esculturas</option>
          </select>
        </div>

        <div class="form-group">
          <label for="descricao">Descrição</label>
          <textarea id="descricao" v-model="form.descricao" rows="5" placeholder="Descrição detalhada do produto..." required></textarea>
        </div>

        <button type="submit" class="btn-submit" :disabled="isLoading">
          <span v-if="isLoading" class="spinner"></span>
          <span v-else>Adicionar Produto</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useNotificationStore } from '~/stores/notification'

definePageMeta({ middleware: ['admin'] })
useHead({ title: 'Novo Produto | StabArts' })

const notify = useNotificationStore()
const router = useRouter()
const isLoading = ref(false)
const imgError = ref(false)

const form = reactive({
  imagem: '',
  nome: '',
  preco: '',
  precoAntigo: '',
  departamento: '',
  descricao: ''
})

const handleSubmit = async () => {
  isLoading.value = true

  try {
    await $fetch('/api/produtos', {
      method: 'POST',
      body: form
    })
    notify.success('Produto adicionado com sucesso!')
    router.push('/admin')
  } catch {
    notify.error('Erro ao adicionar produto.')
  } finally {
    isLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.admin-form-page {
  padding: 40px 20px 60px;
  max-width: 900px;
  animation: fadeInUp 0.4s ease;
}

.voltar-link {
  color: var(--cor-principal);
  font-weight: bold;
  font-size: 0.95rem;
  display: inline-block;
  margin-bottom: 20px;

  &:hover { text-decoration: underline; }
}

.form-title {
  font-family: var(--fonte-secundaria);
  font-size: 2rem;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid var(--cor-cinza);
}

.produto-form {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 30px;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.preview-box {
  width: 100%;
  aspect-ratio: 1;
  border: 2px dashed #ddd;
  border-radius: var(--radius-md);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--cor-cinza);
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-placeholder {
  text-align: center;
  color: var(--cor-cinza-escuro);

  span { font-size: 3rem; display: block; margin-bottom: 10px; }
  p { font-size: 0.9rem; }
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  label {
    display: block;
    font-weight: 600;
    margin-bottom: 6px;
    font-size: 0.9rem;
  }

  input, textarea, select {
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
  }

  select {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 36px;
  }
}

.form-row {
  display: flex;
  gap: 15px;

  .form-group { flex: 1; }

  @media (max-width: 500px) {
    flex-direction: column;
    gap: 20px;
  }
}

.btn-submit {
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
</style>
