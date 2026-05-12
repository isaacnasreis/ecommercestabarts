<template>
  <div class="admin-page container">
    <div class="admin-header">
      <div>
        <h1 class="admin-title">Painel Administrativo</h1>
        <p class="admin-subtitle">Gerencie os produtos da loja</p>
      </div>
      <NuxtLink to="/admin/novo" class="btn-novo">
        + Novo Produto
      </NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="admin-loading">
      <div class="spinner-lg"></div>
      <p>Carregando produtos...</p>
    </div>
    
    <!-- Tabela -->
    <div v-else-if="produtos && produtos.length > 0" class="admin-table-wrapper">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Imagem</th>
            <th>Nome</th>
            <th>Departamento</th>
            <th>Preço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <TransitionGroup name="table-row">
            <tr v-for="produto in produtos" :key="produto.id">
              <td>
                <img :src="produto.imagem" :alt="produto.nome" class="table-thumb">
              </td>
              <td class="td-nome">{{ produto.nome }}</td>
              <td>
                <span class="tag-dep">{{ produto.departamento || '—' }}</span>
              </td>
              <td class="td-preco">R$ {{ produto.preco }}</td>
              <td>
                <div class="acoes">
                  <NuxtLink :to="`/admin/editar/${produto.id}`" class="btn-editar" title="Editar">
                    ✏️
                  </NuxtLink>
                  <button @click="confirmDelete(produto)" class="btn-excluir" title="Excluir">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </TransitionGroup>
        </tbody>
      </table>
    </div>

    <!-- Empty -->
    <div v-else class="empty-admin">
      <p>Nenhum produto cadastrado ainda.</p>
      <NuxtLink to="/admin/novo" class="btn-novo">Adicionar primeiro produto</NuxtLink>
    </div>

    <!-- Modal de confirmação -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
          <div class="modal-content">
            <h3>Excluir Produto</h3>
            <p>Tem certeza que deseja excluir <strong>{{ deletingProduct?.nome }}</strong>?</p>
            <div class="modal-actions">
              <button @click="showDeleteModal = false" class="btn-cancelar">Cancelar</button>
              <button @click="deleteProduct" class="btn-confirmar-delete" :disabled="deleting">
                {{ deleting ? 'Excluindo...' : 'Excluir' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Produto } from '~/types'
import { useNotificationStore } from '~/stores/notification'

definePageMeta({ middleware: ['admin'] })
useHead({ title: 'Admin | StabArts' })

const notify = useNotificationStore()

const { data: produtos, pending, refresh } = await useFetch<Produto[]>('/api/produtos')

const showDeleteModal = ref(false)
const deletingProduct = ref<Produto | null>(null)
const deleting = ref(false)

const confirmDelete = (produto: Produto) => {
  deletingProduct.value = produto
  showDeleteModal.value = true
}

const deleteProduct = async () => {
  if (!deletingProduct.value) return
  deleting.value = true

  try {
    await $fetch(`/api/produtos/${deletingProduct.value.id}`, { method: 'DELETE' })
    notify.success(`"${deletingProduct.value.nome}" foi excluído.`)
    showDeleteModal.value = false
    deletingProduct.value = null
    await refresh()
  } catch {
    notify.error('Erro ao excluir produto.')
  } finally {
    deleting.value = false
  }
}
</script>

<style lang="scss" scoped>
.admin-page {
  padding: 40px 20px 60px;
  animation: fadeIn 0.3s ease;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.admin-title {
  font-family: var(--fonte-secundaria);
  font-size: 2rem;
}

.admin-subtitle {
  color: var(--cor-cinza-escuro);
  font-size: 0.95rem;
  margin-top: 4px;
}

.btn-novo {
  background: var(--cor-principal);
  color: var(--cor-branco);
  padding: 12px 24px;
  font-weight: bold;
  border-radius: var(--radius-sm);
  transition: var(--transition);
  font-size: 0.95rem;

  &:hover { background: var(--cor-preto); }
}

/* ═══ Table ═══ */
.admin-table-wrapper {
  overflow-x: auto;
  border: 1px solid var(--cor-cinza);
  border-radius: var(--radius-md);
}

.admin-table {
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 14px 16px;
    text-align: left;
    border-bottom: 1px solid var(--cor-cinza);
  }

  th {
    background: var(--cor-cinza);
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--cor-cinza-escuro);
    font-weight: 700;
  }

  tr {
    transition: background 0.2s;
    &:hover { background: rgba(0,0,0,0.02); }
  }
}

.table-thumb {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: var(--radius-sm);
}

.td-nome {
  font-weight: 600;
}

.td-preco {
  color: var(--cor-principal);
  font-weight: bold;
}

.tag-dep {
  display: inline-block;
  padding: 3px 10px;
  background: var(--cor-cinza);
  border-radius: var(--radius-pill);
  font-size: 0.8rem;
  color: var(--cor-cinza-escuro);
}

.acoes {
  display: flex;
  gap: 8px;
}

.btn-editar, .btn-excluir {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  transition: var(--transition);
  font-size: 1rem;
}

.btn-editar:hover { background: var(--cor-cinza); }
.btn-excluir:hover { background: rgba(198, 40, 40, 0.1); }

/* ═══ Loading ═══ */
.admin-loading {
  text-align: center;
  padding: 60px;
  color: var(--cor-cinza-escuro);
}

.spinner-lg {
  width: 36px;
  height: 36px;
  border: 3px solid var(--cor-cinza);
  border-top-color: var(--cor-principal);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  margin: 0 auto 15px;
}

/* ═══ Empty ═══ */
.empty-admin {
  text-align: center;
  padding: 80px 20px;

  p {
    color: var(--cor-cinza-escuro);
    margin-bottom: 20px;
    font-size: 1.1rem;
  }
}

/* ═══ Modal ═══ */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5000;
  backdrop-filter: blur(3px);
}

.modal-content {
  background: var(--cor-branco);
  padding: 30px;
  border-radius: var(--radius-lg);
  max-width: 420px;
  width: 90%;
  box-shadow: var(--shadow-lg);

  h3 {
    font-family: var(--fonte-secundaria);
    font-size: 1.3rem;
    margin-bottom: 12px;
  }

  p {
    color: var(--cor-cinza-escuro);
    margin-bottom: 25px;
    line-height: 1.5;
  }
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-cancelar {
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: var(--radius-sm);
  transition: var(--transition);

  &:hover { background: var(--cor-cinza); }
}

.btn-confirmar-delete {
  padding: 10px 20px;
  background: var(--cor-erro);
  color: var(--cor-branco);
  border-radius: var(--radius-sm);
  font-weight: bold;
  transition: var(--transition);

  &:hover { background: darken(#c62828, 10%); }
  &:disabled { opacity: 0.7; cursor: not-allowed; }
}

.modal-enter-active, .modal-leave-active { transition: all 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal-content { transform: scale(0.95); }

/* Table row transitions */
.table-row-leave-active { transition: all 0.4s ease; }
.table-row-leave-to { opacity: 0; transform: translateX(-30px); }
</style>
