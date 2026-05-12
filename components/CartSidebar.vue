<template>
  <div>
    <!-- Overlay -->
    <div 
      class="cart-overlay" 
      v-if="cartStore.isOpen" 
      @click="cartStore.toggleCart"
      aria-hidden="true"
    ></div>

    <!-- Sidebar -->
    <aside 
      class="cart-sidebar" 
      :class="{ 'is-open': cartStore.isOpen }"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
    >
      <div class="cart-header">
        <h2 id="cart-title">Seu Carrinho</h2>
        <button @click="cartStore.toggleCart" class="close-btn" aria-label="Fechar carrinho">
          &#10006;
        </button>
      </div>

      <div class="cart-body" v-if="cartStore.items.length > 0">
        <div 
          v-for="item in cartStore.items" 
          :key="item.product.id" 
          class="cart-item"
        >
          <img :src="item.product.imagem" :alt="item.product.nome" class="item-img">
          
          <div class="item-details">
            <h4 class="item-name">{{ item.product.nome }}</h4>
            <p class="item-price">R$ {{ item.product.preco }}</p>
            
            <div class="item-actions">
              <div class="quantity-controls">
                <button @click="cartStore.updateQuantity(item.product.id, item.quantity - 1)" :disabled="item.quantity <= 1">-</button>
                <span>{{ item.quantity }}</span>
                <button @click="cartStore.updateQuantity(item.product.id, item.quantity + 1)">+</button>
              </div>
              
              <button @click="cartStore.removeItem(item.product.id)" class="remove-btn">
                Remover
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="cart-empty" v-else>
        <p>Seu carrinho está vazio.</p>
        <button @click="cartStore.toggleCart" class="continue-btn">Continuar comprando</button>
      </div>

      <div class="cart-footer" v-if="cartStore.items.length > 0">
        <div class="cart-total">
          <span>Subtotal</span>
          <span>R$ {{ cartStore.cartTotal.toFixed(2).replace('.', ',') }}</span>
        </div>
        <p class="frete-aviso" v-if="cartStore.cartTotal >= 49.99">
          Parabéns! Você ganhou <strong>Frete Grátis</strong>.
        </p>
        <p class="frete-aviso" v-else>
          Faltam R$ {{ (49.99 - cartStore.cartTotal).toFixed(2).replace('.', ',') }} para Frete Grátis.
        </p>
        
        <NuxtLink to="/checkout" class="checkout-btn" @click="cartStore.toggleCart">
          Finalizar Compra
        </NuxtLink>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()
</script>

<style lang="scss" scoped>
.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
}

.cart-sidebar {
  position: fixed;
  top: 0;
  right: -400px;
  width: 100%;
  max-width: 400px;
  height: 100vh;
  background-color: var(--cor-branco);
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  z-index: 999;
  display: flex;
  flex-direction: column;
  transition: right 0.3s ease-in-out;
  
  &.is-open {
    right: 0;
  }
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--cor-cinza);
  
  h2 {
    font-family: var(--fonte-secundaria);
    font-size: 1.5rem;
    color: var(--cor-preto);
  }
  
  .close-btn {
    font-size: 1.5rem;
    color: var(--cor-preto);
    
    &:hover {
      color: var(--cor-principal);
    }
  }
}

.cart-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cart-item {
  display: flex;
  gap: 15px;
  border-bottom: 1px solid var(--cor-cinza);
  padding-bottom: 15px;
  
  .item-img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    background-color: var(--cor-cinza);
  }
  
  .item-details {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .item-name {
    font-size: 1rem;
    color: var(--cor-preto);
    margin-bottom: 5px;
  }
  
  .item-price {
    font-weight: bold;
    color: var(--cor-principal);
    margin-bottom: 10px;
  }
}

.item-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.quantity-controls {
  display: flex;
  align-items: center;
  border: 1px solid var(--cor-cinza);
  overflow: hidden;
  
  button {
    width: 30px;
    height: 30px;
    background: var(--cor-cinza);
    font-weight: bold;
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    &:hover:not(:disabled) {
      background: #e0e0e0;
    }
  }
  
  span {
    width: 30px;
    text-align: center;
    font-size: 0.9rem;
  }
}

.remove-btn {
  color: var(--cor-preto);
  font-size: 0.85rem;
  text-decoration: underline;
  
  &:hover {
    color: var(--cor-principal);
  }
}

.cart-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  text-align: center;
  
  p {
    color: var(--cor-preto);
    margin-bottom: 20px;
  }
  
  .continue-btn {
    background-color: var(--cor-preto);
    color: var(--cor-branco);
    padding: 10px 20px;
    transition: background-color 0.3s ease;
    
    &:hover {
      background-color: var(--cor-principal);
    }
  }
}

.cart-footer {
  padding: 20px;
  border-top: 1px solid var(--cor-cinza);
  
  .cart-total {
    display: flex;
    justify-content: space-between;
    font-size: 1.25rem;
    font-weight: bold;
    color: var(--cor-preto);
    margin-bottom: 10px;
  }
  
  .frete-aviso {
    font-size: 0.9rem;
    color: #555;
    margin-bottom: 15px;
    text-align: center;
    
    strong {
      color: var(--cor-principal);
    }
  }
  
  .checkout-btn {
    display: block;
    width: 100%;
    text-align: center;
    background-color: var(--cor-principal);
    color: var(--cor-branco);
    padding: 15px;
    font-weight: bold;
    font-size: 1.1rem;
    transition: background-color 0.3s ease;
    
    &:hover {
      background-color: var(--cor-preto);
    }
  }
}
</style>
