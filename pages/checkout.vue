<template>
  <div class="checkout-page container">
    <h1 class="page-title">Finalizar Compra</h1>
    
    <div v-if="cartStore.isEmpty" class="empty-state">
      <span class="empty-icon">🛒</span>
      <p>Seu carrinho está vazio.</p>
      <NuxtLink to="/produtos" class="btn-primary">Voltar às Compras</NuxtLink>
    </div>

    <div v-else class="checkout-grid">
      <!-- Formulário -->
      <div class="checkout-form">
        <section class="form-section">
          <h2>1. Dados Pessoais</h2>
          <div class="form-row">
            <div class="input-group full">
              <label>Nome Completo</label>
              <input type="text" v-model="form.nome" placeholder="João da Silva" required>
            </div>
          </div>
          <div class="form-row">
            <div class="input-group">
              <label>E-mail</label>
              <input type="email" v-model="form.email" placeholder="joao@email.com" required>
            </div>
            <div class="input-group">
              <label>CPF</label>
              <input type="text" v-model="form.cpf" placeholder="000.000.000-00" required maxlength="14">
            </div>
          </div>
        </section>

        <section class="form-section">
          <h2>2. Endereço de Entrega</h2>
          <div class="form-row">
            <div class="input-group">
              <label>CEP</label>
              <input type="text" v-model="form.cep" placeholder="00000-000" required maxlength="9">
            </div>
            <div class="input-group grow">
              <label>Rua/Avenida</label>
              <input type="text" v-model="form.rua" placeholder="Rua das Flores" required>
            </div>
          </div>
          <div class="form-row">
            <div class="input-group">
              <label>Número</label>
              <input type="text" v-model="form.numero" placeholder="123" required>
            </div>
            <div class="input-group grow">
              <label>Complemento</label>
              <input type="text" v-model="form.complemento" placeholder="Apto 42">
            </div>
          </div>
        </section>

        <section class="form-section">
          <h2>3. Pagamento</h2>
          <div class="payment-methods">
            <label class="payment-method">
              <input type="radio" v-model="form.pagamento" value="credito">
              <span>💳 Cartão de Crédito</span>
            </label>
            <label class="payment-method">
              <input type="radio" v-model="form.pagamento" value="pix">
              <span>⚡ PIX</span>
            </label>
            <label class="payment-method">
              <input type="radio" v-model="form.pagamento" value="boleto">
              <span>📄 Boleto</span>
            </label>
          </div>
          
          <Transition name="slide-down">
            <div v-if="form.pagamento === 'credito'" class="card-details">
              <div class="input-group full">
                <label>Número do Cartão</label>
                <input type="text" v-model="form.cartaoNumero" placeholder="0000 0000 0000 0000" maxlength="19">
              </div>
              <div class="form-row">
                <div class="input-group">
                  <label>Validade</label>
                  <input type="text" v-model="form.cartaoValidade" placeholder="MM/AA" maxlength="5">
                </div>
                <div class="input-group">
                  <label>CVV</label>
                  <input type="text" v-model="form.cartaoCvv" placeholder="123" maxlength="4">
                </div>
              </div>
            </div>
          </Transition>

          <Transition name="slide-down">
            <div v-if="form.pagamento === 'pix'" class="pix-info">
              <p>Após confirmar, você receberá o QR Code para pagamento.</p>
            </div>
          </Transition>
        </section>
      </div>

      <!-- Resumo -->
      <div class="checkout-summary">
        <h2>Resumo do Pedido</h2>
        
        <div class="summary-items">
          <div v-for="item in cartStore.items" :key="item.product.id" class="summary-item">
            <div class="item-info">
              <span class="item-qty">{{ item.quantity }}x</span>
              <span class="item-name">{{ item.product.nome }}</span>
            </div>
            <span class="item-price">R$ {{ itemTotal(item) }}</span>
          </div>
        </div>
        
        <div class="summary-totals">
          <div class="total-row">
            <span>Subtotal</span>
            <span>R$ {{ cartStore.cartTotal.toFixed(2).replace('.', ',') }}</span>
          </div>
          <div class="total-row">
            <span>Frete</span>
            <span :class="{ 'frete-gratis': freteValue === 0 }">
              {{ freteValue === 0 ? 'Grátis ✓' : `R$ ${freteValue.toFixed(2).replace('.', ',')}` }}
            </span>
          </div>
          <div class="total-row grand-total">
            <span>Total</span>
            <span>R$ {{ (cartStore.cartTotal + freteValue).toFixed(2).replace('.', ',') }}</span>
          </div>
        </div>
        
        <button 
          class="btn-confirmar" 
          @click="processarPagamento" 
          :disabled="isProcessing || !isFormValid"
        >
          <span v-if="isProcessing" class="spinner"></span>
          <span v-else>{{ form.pagamento === 'pix' ? 'Gerar QR Code' : 'Confirmar Pagamento' }}</span>
        </button>
        
        <div class="secure-badge">
          <span>🔒 Ambiente Seguro (Simulação de portfólio)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from 'vue'
import { useCartStore } from '~/stores/cart'
import { useNotificationStore } from '~/stores/notification'
import type { CartItem } from '~/types'

useHead({ title: 'Checkout | StabArts' })

const cartStore = useCartStore()
const notify = useNotificationStore()
const router = useRouter()
const isProcessing = ref(false)

const form = reactive({
  nome: '',
  email: '',
  cpf: '',
  cep: '',
  rua: '',
  numero: '',
  complemento: '',
  pagamento: 'credito',
  cartaoNumero: '',
  cartaoValidade: '',
  cartaoCvv: ''
})

const freteValue = computed(() => {
  return cartStore.cartTotal >= 49.99 ? 0 : 15.00
})

const isFormValid = computed(() => {
  return form.nome && form.email && form.cpf && form.cep && form.rua && form.numero
})

const itemTotal = (item: CartItem) => {
  const priceStr = item.product.preco.replace(',', '.')
  const price = parseFloat(priceStr)
  return (price * item.quantity).toFixed(2).replace('.', ',')
}

const processarPagamento = () => {
  isProcessing.value = true
  setTimeout(() => {
    isProcessing.value = false
    notify.success('Pedido realizado com sucesso! Obrigado pela compra.')
    cartStore.clearCart()
    router.push('/')
  }, 2500)
}
</script>

<style lang="scss" scoped>
.checkout-page {
  padding: 40px 20px 60px;
  animation: fadeIn 0.3s ease;
}

.page-title {
  font-family: var(--fonte-secundaria);
  font-size: 2rem;
  color: var(--cor-preto);
  margin-bottom: 30px;
  border-bottom: 2px solid var(--cor-cinza);
  padding-bottom: 15px;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  
  .empty-icon { font-size: 3rem; display: block; margin-bottom: 15px; }
  p { font-size: 1.2rem; color: var(--cor-cinza-escuro); margin-bottom: 20px; }
}

.btn-primary {
  background: var(--cor-principal);
  color: var(--cor-branco);
  padding: 15px 30px;
  font-weight: bold;
  display: inline-block;
  border-radius: var(--radius-sm);
  &:hover { background: var(--cor-preto); }
}

.checkout-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 40px;
  align-items: start;
  
  @media (max-width: 900px) { grid-template-columns: 1fr; }
}

.form-section {
  background: var(--cor-branco);
  padding: 25px;
  border: 1px solid var(--cor-cinza);
  border-radius: var(--radius-md);
  margin-bottom: 25px;
  
  h2 {
    font-size: 1.1rem;
    color: var(--cor-preto);
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--cor-cinza);
  }
}

.form-row {
  display: flex;
  gap: 15px;
  @media (max-width: 600px) { flex-direction: column; gap: 0; }
}

.input-group {
  margin-bottom: 15px;
  flex: 1;
  
  &.full { flex: 1 1 100%; }
  &.grow { flex: 2; }

  label {
    display: block;
    margin-bottom: 6px;
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--cor-preto);
  }

  input {
    width: 100%;
    padding: 11px 14px;
    border: 1px solid #ccc;
    border-radius: var(--radius-sm);
    font-family: var(--fonte-principal);
    font-size: 1rem;
    transition: border-color 0.3s;
    
    &:focus {
      outline: none;
      border-color: var(--cor-principal);
      box-shadow: 0 0 0 3px rgba(237, 63, 63, 0.1);
    }
  }
}

.payment-methods {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.payment-method {
  flex: 1;
  min-width: 120px;
  border: 1px solid #ccc;
  padding: 14px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: var(--transition);
  
  &:has(input:checked) {
    border-color: var(--cor-principal);
    background-color: rgba(237, 63, 63, 0.04);
  }
}

.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.3s ease;
}
.slide-down-enter-from, .slide-down-leave-to {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
}
.slide-down-enter-to {
  max-height: 200px;
}

.pix-info {
  padding: 15px;
  background: var(--cor-cinza);
  border-radius: var(--radius-sm);
  font-size: 0.95rem;
  color: var(--cor-cinza-escuro);
}

.checkout-summary {
  background: #fafafa;
  padding: 25px;
  border: 1px solid var(--cor-cinza);
  border-radius: var(--radius-md);
  position: sticky;
  top: 120px;
  
  h2 {
    font-size: 1.1rem;
    color: var(--cor-preto);
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ddd;
  }
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 0.95rem;
  
  .item-info { display: flex; gap: 8px; }
  .item-qty { color: var(--cor-cinza-escuro); }
  .item-price { font-weight: 600; }
}

.summary-totals {
  border-top: 1px dashed #ddd;
  padding-top: 15px;
  margin-top: 15px;
  
  .total-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    color: #555;
    
    &.grand-total {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #ddd;
      font-size: 1.2rem;
      font-weight: bold;
      color: var(--cor-preto);
    }
  }
}

.frete-gratis {
  color: var(--cor-sucesso);
  font-weight: bold;
}

.btn-confirmar {
  width: 100%;
  background: var(--cor-principal);
  color: var(--cor-branco);
  padding: 15px;
  font-weight: bold;
  font-size: 1.1rem;
  margin-top: 20px;
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

.secure-badge {
  text-align: center;
  margin-top: 15px;
  color: var(--cor-sucesso);
  font-size: 0.85rem;
}
</style>
