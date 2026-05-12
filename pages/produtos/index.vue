<template>
  <div class="produtos-page container">
    <div class="produtos-page__header">
      <h1 class="produtos-page__titulo">
        {{ pageTitle }}
      </h1>
      <p class="produtos-page__count" v-if="!pending">
        {{ filteredCount }} produto{{ filteredCount !== 1 ? 's' : '' }} encontrado{{ filteredCount !== 1 ? 's' : '' }}
      </p>
    </div>

    <!-- Filtros -->
    <div class="filtros">
      <button 
        v-for="dep in departamentos" 
        :key="dep.value"
        :class="['filtro-chip', { 'filtro-chip--ativo': activeDepartamento === dep.value }]"
        @click="setDepartamento(dep.value)"
      >
        {{ dep.label }}
      </button>
    </div>

    <!-- Busca ativa -->
    <div v-if="searchQuery" class="busca-ativa">
      <p>Resultados para: <strong>"{{ searchQuery }}"</strong></p>
      <button @click="clearSearch" class="busca-ativa__limpar">Limpar busca</button>
    </div>
    
    <!-- Loading -->
    <div v-if="pending" class="produtos-grid">
      <div v-for="i in 8" :key="i" class="skeleton-card">
        <div class="skeleton skeleton-img"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-price"></div>
      </div>
    </div>

    <!-- Produtos -->
    <div v-else-if="produtos && produtos.length > 0" class="produtos-grid">
      <ProductCard 
        v-for="produto in produtos" 
        :key="produto.id" 
        :produto="produto" 
      />
    </div>

    <!-- Empty state -->
    <div v-else class="empty-state">
      <span class="empty-state__icon">🔍</span>
      <h2>Nenhum produto encontrado</h2>
      <p>Tente outro termo de busca ou explore nossas categorias.</p>
      <button @click="clearAll" class="btn-primary">Ver todos os produtos</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import type { Produto } from '~/types'

useHead({ title: 'Produtos | StabArts' })

const route = useRoute()
const router = useRouter()

const searchQuery = computed(() => (route.query.q as string) || '')
const activeDepartamento = computed(() => (route.query.departamento as string) || '')

const departamentos = [
  { label: 'Todos', value: '' },
  { label: 'Quadros', value: 'Quadros' },
  { label: 'Materiais', value: 'Materias' },
  { label: 'Molduras', value: 'Molduras' },
  { label: 'Esculturas', value: 'Esculturas' }
]

const queryParams = computed(() => {
  const params: Record<string, string> = {}
  if (searchQuery.value) params.q = searchQuery.value
  if (activeDepartamento.value) params.departamento = activeDepartamento.value
  return params
})

const { data: produtos, pending, refresh } = await useFetch<Produto[]>('/api/produtos', {
  query: queryParams
})

const filteredCount = computed(() => produtos.value?.length ?? 0)

const pageTitle = computed(() => {
  if (searchQuery.value) return `Busca: "${searchQuery.value}"`
  if (activeDepartamento.value) {
    const dep = departamentos.find(d => d.value === activeDepartamento.value)
    return dep?.label || 'Produtos'
  }
  return 'Todos os Produtos'
})

const setDepartamento = (value: string) => {
  const query: Record<string, string> = {}
  if (value) query.departamento = value
  if (searchQuery.value) query.q = searchQuery.value
  router.push({ path: '/produtos', query })
}

const clearSearch = () => {
  const query: Record<string, string> = {}
  if (activeDepartamento.value) query.departamento = activeDepartamento.value
  router.push({ path: '/produtos', query })
}

const clearAll = () => {
  router.push('/produtos')
}

watch(() => route.query, () => {
  refresh()
}, { deep: true })
</script>

<style lang="scss" scoped>
.produtos-page {
  padding: 40px 20px 60px;
}

.produtos-page__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 20px;
  border-bottom: 2px solid var(--cor-cinza);
  padding-bottom: 15px;
  flex-wrap: wrap;
  gap: 10px;
}

.produtos-page__titulo {
  font-family: var(--fonte-secundaria);
  font-size: 2rem;
}

.produtos-page__count {
  color: var(--cor-cinza-escuro);
  font-size: 0.95rem;
}

/* ═══ Filtros ═══ */
.filtros {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.filtro-chip {
  padding: 8px 20px;
  border: 1px solid #ddd;
  border-radius: var(--radius-pill);
  font-size: 0.9rem;
  transition: var(--transition);
  background: var(--cor-branco);

  &:hover {
    border-color: var(--cor-principal);
    color: var(--cor-principal);
  }

  &--ativo {
    background: var(--cor-principal);
    color: var(--cor-branco);
    border-color: var(--cor-principal);

    &:hover {
      background: var(--cor-principal-hover);
      color: var(--cor-branco);
    }
  }
}

/* ═══ Busca ativa ═══ */
.busca-ativa {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
  padding: 12px 18px;
  background: var(--cor-cinza);
  border-radius: var(--radius-md);
  flex-wrap: wrap;

  p { font-size: 0.95rem; }
}

.busca-ativa__limpar {
  color: var(--cor-principal);
  font-weight: bold;
  font-size: 0.9rem;
  
  &:hover { text-decoration: underline; }
}

/* ═══ Grid ═══ */
.produtos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 30px;
}

/* ═══ Skeleton ═══ */
.skeleton-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-img {
  width: 100%;
  aspect-ratio: 1;
}

.skeleton-text {
  height: 20px;
  width: 70%;
}

.skeleton-price {
  height: 24px;
  width: 40%;
}

/* ═══ Empty ═══ */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  animation: fadeInUp 0.5s ease;

  &__icon {
    font-size: 3rem;
    display: block;
    margin-bottom: 15px;
  }

  h2 {
    font-family: var(--fonte-secundaria);
    font-size: 1.5rem;
    margin-bottom: 10px;
  }

  p {
    color: var(--cor-cinza-escuro);
    margin-bottom: 25px;
  }
}

.btn-primary {
  background: var(--cor-principal);
  color: var(--cor-branco);
  padding: 12px 28px;
  font-weight: bold;
  border-radius: var(--radius-sm);
  transition: var(--transition);

  &:hover { background: var(--cor-preto); }
}
</style>
