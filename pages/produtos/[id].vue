<template>
  <div class="product-detail-page container">
    <NuxtLink to="/produtos" class="back-link">&larr; Voltar para produtos</NuxtLink>

    <div v-if="pending" class="loading-state">
      <div class="spinner-lg"></div>
      <p>Carregando detalhes...</p>
    </div>

    <div v-else-if="!produto" class="not-found">
      <span class="not-found__icon">404</span>
      <h1>Produto não encontrado</h1>
      <p>O produto que você tentou acessar não existe.</p>
      <NuxtLink to="/produtos" class="back-btn">Ver todos os produtos</NuxtLink>
    </div>

    <div v-else class="product-grid">
      <!-- Imagem -->
      <div class="product-image-container">
        <img :src="produto.imagem" :alt="produto.nome" class="product-image">
        <span v-if="desconto > 0" class="product-badge">-{{ desconto }}% OFF</span>
      </div>

      <!-- Informações -->
      <div class="product-info">
        <span class="product-department" v-if="produto.departamento">{{ produto.departamento }}</span>
        <h1 class="product-title">{{ produto.nome }}</h1>
        
        <div class="product-price-block">
          <span v-if="produto.precoAntigo" class="old-price">
            R$ {{ produto.precoAntigo }}
          </span>
          <span class="current-price">
            R$ {{ produto.preco }}
          </span>
        </div>

        <div class="product-description" v-if="produto.descricao">
          <h3>Descrição</h3>
          <p>{{ produto.descricao }}</p>
        </div>

        <div class="add-to-cart-block">
          <div class="quantity-selector">
            <button @click="quantity > 1 ? quantity-- : null" :disabled="quantity <= 1">-</button>
            <input type="number" v-model.number="quantity" min="1" max="99" aria-label="Quantidade">
            <button @click="quantity++">+</button>
          </div>
          
          <button @click="addToCart" class="btn-add">
            Adicionar ao Carrinho
          </button>
        </div>

        <div class="shipping-info">
          <span>🚚 Frete grátis para compras acima de R$ 49,99</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCartStore } from '~/stores/cart'
import { useNotificationStore } from '~/stores/notification'
import type { Produto } from '~/types'

const route = useRoute()
const cartStore = useCartStore()
const notify = useNotificationStore()

const { data: produto, pending } = await useFetch<Produto>('/api/produtos', {
  query: { id: route.params.id }
})

useHead(() => ({
  title: produto.value ? `${produto.value.nome} | StabArts` : 'Produto | StabArts'
}))

const quantity = ref(1)

const desconto = computed(() => {
  if (!produto.value?.precoAntigo) return 0
  const antigo = parseFloat(produto.value.precoAntigo.replace(',', '.'))
  const atual = parseFloat(produto.value.preco.replace(',', '.'))
  if (antigo <= 0) return 0
  return Math.round(((antigo - atual) / antigo) * 100)
})

const addToCart = () => {
  if (produto.value) {
    cartStore.addItem(produto.value, quantity.value)
    notify.success(`${produto.value.nome} adicionado ao carrinho!`)
  }
}
</script>

<style lang="scss" scoped>
.product-detail-page {
  padding: 40px 20px 60px;
  animation: fadeInUp 0.4s ease;
}

.back-link {
  display: inline-block;
  margin-bottom: 30px;
  color: var(--cor-cinza-escuro);
  font-weight: 600;
  transition: color 0.3s;
  
  &:hover { color: var(--cor-principal); }
}

.product-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.product-image-container {
  background: var(--cor-cinza);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1;
  border-radius: var(--radius-md);
  position: relative;
}

.product-badge {
  position: absolute;
  top: 15px;
  left: 15px;
  background: var(--cor-principal);
  color: var(--cor-branco);
  padding: 6px 14px;
  border-radius: var(--radius-sm);
  font-weight: bold;
  font-size: 0.9rem;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  display: flex;
  flex-direction: column;
}

.product-department {
  font-size: 0.85rem;
  color: var(--cor-principal);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 5px;
  font-weight: 700;
}

.product-title {
  font-family: var(--fonte-secundaria);
  font-size: 2.2rem;
  color: var(--cor-preto);
  margin-bottom: 20px;
}

.product-price-block {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--cor-cinza);
  
  .old-price {
    display: block;
    text-decoration: line-through;
    color: var(--cor-cinza-escuro);
    font-size: 1.1rem;
    margin-bottom: 5px;
  }
  
  .current-price {
    display: block;
    font-size: 2.2rem;
    font-weight: bold;
    color: var(--cor-principal);
  }
}

.product-description {
  margin-bottom: 30px;
  
  h3 {
    font-size: 1.1rem;
    margin-bottom: 12px;
    color: var(--cor-preto);
  }
  
  p {
    color: #444;
    line-height: 1.7;
  }
}

.add-to-cart-block {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
}

.quantity-selector {
  display: flex;
  border: 1px solid #ccc;
  border-radius: var(--radius-sm);
  height: 50px;
  overflow: hidden;
  
  button {
    width: 40px;
    background: var(--cor-cinza);
    font-size: 1.2rem;
    transition: background 0.2s;
    
    &:hover:not(:disabled) { background: #e0e0e0; }
    &:disabled { opacity: 0.5; }
  }
  
  input {
    width: 50px;
    text-align: center;
    border: none;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    font-family: var(--fonte-principal);
    font-size: 1.1rem;
    
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
}

.btn-add {
  flex: 1;
  background: var(--cor-principal);
  color: var(--cor-branco);
  font-size: 1.1rem;
  font-weight: bold;
  transition: var(--transition);
  padding: 0 30px;
  border-radius: var(--radius-sm);
  
  &:hover { background: var(--cor-preto); }
}

.shipping-info {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--cor-cinza);
  padding: 15px;
  border: 1px dashed #ccc;
  border-radius: var(--radius-sm);
  color: #555;
  font-size: 0.95rem;
}

.loading-state, .not-found {
  text-align: center;
  padding: 60px;
  
  h1 {
    font-family: var(--fonte-secundaria);
    margin-bottom: 10px;
  }
}

.not-found__icon {
  font-size: 3rem;
  font-weight: bold;
  color: var(--cor-principal);
  display: block;
  margin-bottom: 15px;
  font-family: var(--fonte-secundaria);
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

.back-btn {
  display: inline-block;
  margin-top: 20px;
  background: var(--cor-principal);
  color: var(--cor-branco);
  padding: 12px 25px;
  font-weight: bold;
  border-radius: var(--radius-sm);
  
  &:hover { background: var(--cor-preto); }
}
</style>
