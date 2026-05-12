<template>
  <div class="layout">
    <header class="cabecalho">
      <div class="cabecalho__anuncio">
        <p>Frete grátis | em compras acima de R$ 49,99</p>
      </div>
      
      <div class="cabecalho__menu">
        <NuxtLink to="/" class="cabecalho__logo">
          <img src="/assets/img/logo.svg" alt="Logo Stab Arts">
        </NuxtLink>
        
        <form class="cabecalho__pesquisa" @submit.prevent="handleSearch">
          <input 
            class="cabecalho__input" 
            type="text" 
            v-model="searchQuery"
            placeholder="O que deseja encontrar?"
          >
          <button class="cabecalho__input--botao" type="submit">
            <img src="/assets/img/lupa.svg" alt="Buscar" class="search-icon">
          </button>
        </form>
        
        <div class="cabecalho__paginas">
          <!-- Login / User -->
          <NuxtLink v-if="!authStore.isAuthenticated" to="/login" class="cabecalho__login">
            <img src="/assets/img/usuario.svg" alt="" class="login-icon">
            <span class="cabecalho__login--texto">Login</span>
          </NuxtLink>

          <div v-else class="cabecalho__user-menu">
            <button @click="toggleUserMenu" class="cabecalho__user-btn">
              <span class="user-avatar">{{ authStore.userName.charAt(0) }}</span>
              <span class="user-name">{{ authStore.userName }}</span>
            </button>
            <Transition name="dropdown">
              <div v-if="userMenuOpen" class="user-dropdown">
                <NuxtLink v-if="authStore.isAdmin" to="/admin" class="dropdown-item" @click="userMenuOpen = false">
                  Painel Admin
                </NuxtLink>
                <button @click="handleLogout" class="dropdown-item dropdown-item--danger">
                  Sair
                </button>
              </div>
            </Transition>
          </div>
          
          <button @click="cartStore.toggleCart" class="icone-btn" aria-label="Carrinho">
            <img src="/assets/img/carrinhoCompras.svg" alt="ícone carrinho de compras" class="cabecalho__carrinho icone">
            <span class="cart-badge" v-if="cartStore.totalItems > 0">{{ cartStore.totalItems }}</span>
          </button>
          <NuxtLink to="/admin" class="icone-btn" v-if="authStore.isAdmin">
            <img src="/assets/img/prancheta.svg" alt="ícone prancheta (pedidos)" class="cabecalho__prancheta icone">
          </NuxtLink>

          <!-- Mobile hamburger -->
          <button class="hamburger" @click="mobileMenuOpen = !mobileMenuOpen" aria-label="Menu">
            <span :class="{ 'is-open': mobileMenuOpen }"></span>
          </button>
        </div>
      </div>

      <nav class="nav-desktop">
        <ul class="cabecalho__navegacao">
          <li><NuxtLink to="/produtos?departamento=Quadros" class="cabecalho__link">Casa e decoração</NuxtLink></li>
          <li><NuxtLink to="/produtos?departamento=Materias" class="cabecalho__link">Acessórios</NuxtLink></li>
          <li><NuxtLink to="/produtos" class="cabecalho__link">Papelaria</NuxtLink></li>
          <li><NuxtLink to="/produtos" class="cabecalho__link">Vestuário</NuxtLink></li>
        </ul>
      </nav>

      <!-- Mobile nav -->
      <Transition name="slide-nav">
        <nav v-if="mobileMenuOpen" class="nav-mobile">
          <ul>
            <li><NuxtLink to="/produtos?departamento=Quadros" @click="mobileMenuOpen = false">Casa e decoração</NuxtLink></li>
            <li><NuxtLink to="/produtos?departamento=Materias" @click="mobileMenuOpen = false">Acessórios</NuxtLink></li>
            <li><NuxtLink to="/produtos" @click="mobileMenuOpen = false">Papelaria</NuxtLink></li>
            <li><NuxtLink to="/produtos" @click="mobileMenuOpen = false">Vestuário</NuxtLink></li>
            <li v-if="!authStore.isAuthenticated"><NuxtLink to="/login" @click="mobileMenuOpen = false">Login</NuxtLink></li>
            <li v-if="authStore.isAdmin"><NuxtLink to="/admin" @click="mobileMenuOpen = false">Painel Admin</NuxtLink></li>
          </ul>
        </nav>
      </Transition>
    </header>
    
    <CartSidebar />
    <ToastNotification />
    
    <main class="main-content">
      <slot />
    </main>
    
    <footer class="rodape">
      <div class="rodape__info container">
        <section class="rodape__logo">
          <NuxtLink to="/"><img src="/assets/img/logo.svg" alt="Logo Stab Arts" class="rodape__logo--imagem"></NuxtLink>
          <h3 class="rodape__socias--titulo">Rede Sociais</h3>
          <div class="rodape__socias">
            <a href="#" target="_blank"><img src="/assets/img/twitter.svg" alt="Ícone Twitter" class="rodape__socias--twiter"></a>
            <a href="#" target="_blank"><img src="/assets/img/instagram.svg" alt="Ícone Instagram" class="rodape__socias--instagram"></a>
            <a href="#" target="_blank"><img src="/assets/img/facebook.svg" alt="Ícone Facebook" class="rodape__socias--facebook"></a>
          </div>
        </section>

        <section class="rodape__links">
          <nav class="rodape__nav">
            <a href="#" class="rodape__link">Quem somos nós</a>
            <a href="#" class="rodape__link">Política de privacidade</a>
            <a href="#" class="rodape__link">Programa fidelidade</a>
            <a href="#" class="rodape__link">Nossas lojas</a>
            <a href="#" class="rodape__link">Quero ser franqueado</a>
            <a href="#" class="rodape__link">Anuncie aqui</a>
          </nav>
        </section>

        <section class="rodape__contato">
          <form @submit.prevent class="rodape__form">
            <legend>Fale com a Stab Arts</legend>
            <input type="text" placeholder="Nome" maxlength="40" required>
            <textarea name="mensagem" id="mensagem" cols="30" rows="5" maxlength="120" placeholder="Escreva uma mensagem" required></textarea>
            <button type="submit">Enviar mensagem</button>
          </form>
        </section>
      </div>

      <section class="rodape__copy">
        <p>© Desenvolvido por Isaac N. Reis - 2026</p>
        <a href="https://isaacnasreis.github.io/portfolio-js/" target="_blank">Portfólio</a>
      </section>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCartStore } from '~/stores/cart'
import { useAuthStore } from '~/stores/auth'
import { useNotificationStore } from '~/stores/notification'

const cartStore = useCartStore()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const searchQuery = ref('')
const userMenuOpen = ref(false)
const mobileMenuOpen = ref(false)

const router = useRouter()

onMounted(() => {
  cartStore.hydrate()
  authStore.hydrate()
})

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/produtos?q=${encodeURIComponent(searchQuery.value.trim())}`)
    searchQuery.value = ''
  }
}

const handleLogout = () => {
  authStore.logout()
  userMenuOpen.value = false
  notificationStore.info('Você saiu da sua conta.')
  router.push('/')
}

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value
}
</script>

<style lang="scss" scoped>
.cabecalho {
  background-color: var(--cor-branco);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow-sm);
}

.cabecalho__anuncio {
  background-color: var(--cor-preto);
  color: var(--cor-branco);
  text-align: center;
  padding: 10px 0;
  
  p {
    font-size: 14px;
    letter-spacing: 1px;
  }
}

.cabecalho__menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 5%;
  flex-wrap: wrap;
  gap: 20px;
}

.cabecalho__logo img {
  height: 50px;
}

.cabecalho__pesquisa {
  display: flex;
  border: 1px solid var(--cor-principal);
  border-radius: var(--radius-pill);
  overflow: hidden;
  width: 40%;
  min-width: 300px;
  transition: box-shadow 0.3s ease;

  &:focus-within {
    box-shadow: 0 0 0 3px rgba(237, 63, 63, 0.15);
  }
  
  .cabecalho__input {
    flex: 1;
    border: none;
    background: transparent;
    padding: 10px 20px;
    font-family: var(--fonte-principal);
    font-size: 16px;
    
    &:focus {
      outline: none;
    }
  }
  
  .cabecalho__input--botao {
    padding: 0 15px;
    color: var(--cor-preto);
    display: flex;
    align-items: center;

    .search-icon {
      width: 18px;
      height: 18px;
      opacity: 0.6;
    }
  }
}

.cabecalho__paginas {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cabecalho__login {
  color: var(--cor-preto);
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--cor-principal);
  border-radius: var(--radius-pill);
  padding: 8px 20px;
  transition: var(--transition);
  
  .login-icon {
    width: 18px;
    height: 18px;
  }
  
  &:hover {
    background-color: var(--cor-principal);
    color: var(--cor-branco);
  }
}

.cabecalho__user-menu {
  position: relative;
}

.cabecalho__user-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border: 1px solid var(--cor-principal-clara);
  border-radius: var(--radius-pill);
  transition: var(--transition);

  &:hover {
    background: var(--cor-cinza);
  }
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--cor-principal);
  color: var(--cor-branco);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
}

.user-name {
  font-size: 14px;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 768px) {
    display: none;
  }
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: var(--cor-branco);
  border: 1px solid var(--cor-cinza);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  min-width: 160px;
  overflow: hidden;
  z-index: 50;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 12px 16px;
  font-size: 0.95rem;
  text-align: left;
  transition: background 0.2s;

  &:hover {
    background: var(--cor-cinza);
  }

  &--danger {
    color: var(--cor-principal);
    
    &:hover {
      background: rgba(237, 63, 63, 0.06);
    }
  }
}

.dropdown-enter-active, .dropdown-leave-active {
  transition: all 0.2s ease;
}
.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.icone-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .icone {
    width: 24px;
    height: 24px;
  }
  
  .cart-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background: var(--cor-principal);
    color: white;
    font-size: 11px;
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-family: sans-serif;
    font-weight: bold;
    animation: pulse 0.3s ease;
  }
}

/* ═══ Hamburger ═══ */
.hamburger {
  display: none;
  width: 28px;
  height: 24px;
  position: relative;

  span, span::before, span::after {
    display: block;
    position: absolute;
    width: 100%;
    height: 2px;
    background: var(--cor-preto);
    transition: var(--transition);
  }

  span {
    top: 50%;
    transform: translateY(-50%);

    &::before {
      content: '';
      top: -8px;
    }

    &::after {
      content: '';
      top: 8px;
    }

    &.is-open {
      background: transparent;

      &::before {
        top: 0;
        transform: rotate(45deg);
      }

      &::after {
        top: 0;
        transform: rotate(-45deg);
      }
    }
  }

  @media (max-width: 768px) {
    display: block;
  }
}

/* ═══ Nav Desktop ═══ */
.nav-desktop {
  background-color: var(--cor-principal-clara);
  padding: 15px 0;

  @media (max-width: 768px) {
    display: none;
  }
}

.cabecalho__navegacao {
  display: flex;
  justify-content: center;
  gap: 60px;
  
  .cabecalho__link {
    color: var(--cor-preto);
    font-size: 16px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    transition: var(--transition);
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0;
      height: 2px;
      background: var(--cor-principal);
      transition: width 0.3s ease;
    }

    &:hover {
      color: var(--cor-principal);

      &::after {
        width: 100%;
      }
    }
  }
}

/* ═══ Nav Mobile ═══ */
.nav-mobile {
  background: var(--cor-principal-clara);
  padding: 20px 5%;

  ul {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  a {
    color: var(--cor-preto);
    font-size: 16px;
    font-weight: 700;
    text-transform: uppercase;
    display: block;
    padding: 8px 0;
    border-bottom: 1px solid rgba(0,0,0,0.08);
  }
}

.slide-nav-enter-active, .slide-nav-leave-active {
  transition: all 0.3s ease;
}
.slide-nav-enter-from, .slide-nav-leave-to {
  opacity: 0;
  max-height: 0;
  padding: 0 5%;
  overflow: hidden;
}
.slide-nav-enter-to, .slide-nav-leave-from {
  max-height: 400px;
}

/* ═══ Rodapé ═══ */
.rodape {
  background-color: var(--cor-principal-clara);
  margin-top: 50px;
  padding-top: 40px;
}

.rodape__info {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 30px;
  padding-bottom: 40px;
}

.rodape__logo--imagem {
  margin-bottom: 20px;
}

.rodape__socias--titulo {
  font-family: var(--fonte-secundaria);
  font-size: 18px;
  margin-bottom: 15px;
  color: var(--cor-preto);
}

.rodape__socias {
  display: flex;
  gap: 15px;
  
  img {
    transition: var(--transition);
    &:hover { transform: translateY(-3px); }
  }
}

.rodape__nav {
  display: flex;
  flex-direction: column;
  gap: 15px;
  
  .rodape__link {
    color: var(--cor-preto);
    font-size: 16px;
    transition: var(--transition);
    &:hover { color: var(--cor-principal); }
  }
}

.rodape__form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 300px;
  
  legend {
    font-family: var(--fonte-secundaria);
    font-size: 18px;
    margin-bottom: 5px;
  }
  
  input, textarea {
    padding: 10px;
    border: 1px solid #ccc;
    font-family: var(--fonte-principal);
    font-size: 16px;
    border-radius: var(--radius-sm);
    transition: border-color 0.3s;
    
    &:focus { outline: none; border-color: var(--cor-principal); }
  }
  
  button {
    background-color: var(--cor-principal);
    color: var(--cor-branco);
    padding: 12px;
    font-weight: bold;
    font-size: 16px;
    border-radius: var(--radius-sm);
    transition: var(--transition);
    
    &:hover { background-color: var(--cor-preto); }
  }
}

.rodape__copy {
  background-color: var(--cor-preto);
  color: var(--cor-branco);
  text-align: center;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  
  a {
    color: var(--cor-principal-clara);
    &:hover { text-decoration: underline; }
  }
}

/* ═══ Responsive ═══ */
@media (max-width: 768px) {
  .cabecalho__pesquisa {
    min-width: unset;
    width: 100%;
    order: 3;
  }

  .cabecalho__menu {
    flex-wrap: wrap;
  }
}
</style>
