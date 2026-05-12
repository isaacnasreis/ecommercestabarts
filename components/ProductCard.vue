<template>
  <article class="produto">
    <NuxtLink :to="`/produtos/${produto.id}`" class="produto__imagem-wrapper">
      <img :src="produto.imagem" :alt="produto.nome" class="produto__imagem" loading="lazy">
      <span v-if="desconto > 0" class="produto__tag">-{{ desconto }}%</span>
    </NuxtLink>
    
    <div class="produto__info">
      <span class="produto__departamento" v-if="produto.departamento">{{ produto.departamento }}</span>
      <h3 class="produto__titulo">{{ produto.nome }}</h3>
      
      <div class="produto__preco">
        <p class="produto__preco--antigo" v-if="produto.precoAntigo">
          R$ {{ produto.precoAntigo }}
        </p>
        <h4>R$ {{ produto.preco }}</h4>
      </div>
    </div>
    
    <div class="produto__acoes">
      <NuxtLink :to="`/produtos/${produto.id}`" class="produto__link">Ver produto</NuxtLink>
      <button @click="addToCart" class="produto__add-btn" aria-label="Adicionar ao carrinho">+</button>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Produto } from '~/types'
import { useCartStore } from '~/stores/cart'
import { useNotificationStore } from '~/stores/notification'
import { computed } from 'vue'

const props = defineProps<{
  produto: Produto
}>()

const cartStore = useCartStore()
const notify = useNotificationStore()

const desconto = computed(() => {
  if (!props.produto.precoAntigo) return 0
  const antigo = parseFloat(props.produto.precoAntigo.replace(',', '.'))
  const atual = parseFloat(props.produto.preco.replace(',', '.'))
  if (antigo <= 0) return 0
  return Math.round(((antigo - atual) / antigo) * 100)
})

const addToCart = () => {
  cartStore.addItem(props.produto)
  notify.success(`${props.produto.nome} adicionado ao carrinho!`)
}
</script>

<style lang="scss" scoped>
.produto {
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background: var(--cor-branco);
  border-radius: var(--radius-md);
  overflow: hidden;
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-md);
  }
}

.produto__imagem-wrapper {
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  background-color: var(--cor-cinza);
  position: relative;
  display: block;
}

.produto__tag {
  position: absolute;
  top: 10px;
  left: 10px;
  background: var(--cor-principal);
  color: var(--cor-branco);
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: bold;
}

.produto__imagem {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
  
  .produto:hover & {
    transform: scale(1.08);
  }
}

.produto__info {
  padding: 15px 12px 10px;
  flex: 1;
}

.produto__departamento {
  display: inline-block;
  font-size: 0.75rem;
  color: var(--cor-principal);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 700;
  margin-bottom: 4px;
}

.produto__titulo {
  font-family: var(--fonte-secundaria);
  font-size: 1.05rem;
  margin-bottom: 8px;
  color: var(--cor-preto);
}

.produto__preco {
  margin-bottom: 0;
  
  h4 {
    font-size: 1.3rem;
    color: var(--cor-principal);
  }
}

.produto__preco--antigo {
  text-decoration: line-through;
  color: var(--cor-cinza-escuro);
  font-size: 0.85rem;
}

.produto__acoes {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 0 12px 15px;
}

.produto__link {
  color: var(--cor-principal);
  font-weight: bold;
  font-size: 0.95rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1.5px;
    background: var(--cor-principal);
    transition: width 0.3s;
  }

  &:hover::after {
    width: 100%;
  }
}

.produto__add-btn {
  width: 36px;
  height: 36px;
  background-color: var(--cor-preto);
  color: var(--cor-branco);
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--cor-principal);
    transform: scale(1.1);
  }
}
</style>
