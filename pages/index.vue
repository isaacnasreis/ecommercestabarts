<template>
  <div class="home-page">
    <!-- Banner usando a imagem de ilustração existente -->
    <section class="banner">
      <h1 class="banner__titulo">Novos Quadros</h1>
      <div class="banner__textos">
        <p class="banner__subtitulo">Nova coleção exclusiva com descontos progressivos</p>
        <NuxtLink to="/produtos" class="banner__botao">Novos Quadros</NuxtLink>
      </div>
    </section>

    <!-- Seção: Quadros -->
    <section class="produtos container">
      <div class="produtos__topo">
        <h2 class="produtos__titulo">Quadros</h2>
        <NuxtLink to="/produtos" class="produtos__link">Ver tudo <span>&rsaquo;</span></NuxtLink>
      </div>

      <div class="produtos__linha">
        <template v-if="pending">
          <p class="loading">Carregando produtos...</p>
        </template>
        <template v-else>
          <ProductCard 
            v-for="produto in quadros" 
            :key="produto.id" 
            :produto="produto" 
          />
        </template>
      </div>
    </section>

    <!-- Faixa de Frete -->
    <section class="faixa">
      <h2 class="faixa__textoT">Frete grátis |</h2>
      <h3 class="faixa__textoP">Em compras a partir de R$ 49,99 para todo o Brasil</h3>
    </section>

    <!-- Seção: Materiais -->
    <section class="produtos container">
      <div class="produtos__topo">
        <h2 class="produtos__titulo">Materiais</h2>
        <NuxtLink to="/produtos" class="produtos__link">Ver tudo <span>&rsaquo;</span></NuxtLink>
      </div>

      <div class="produtos__linha">
        <template v-if="pending">
          <p class="loading">Carregando produtos...</p>
        </template>
        <template v-else>
          <ProductCard 
            v-for="produto in materiais" 
            :key="produto.id" 
            :produto="produto" 
          />
        </template>
      </div>
    </section>

    <!-- Seção: Mais Vendidos -->
    <section class="produtos container">
      <div class="produtos__topo">
        <h2 class="produtos__titulo">Mais vendidos</h2>
        <NuxtLink to="/produtos" class="produtos__link">Ver tudo <span>&rsaquo;</span></NuxtLink>
      </div>

      <div class="produtos__linha">
        <template v-if="pending">
          <p class="loading">Carregando produtos...</p>
        </template>
        <template v-else>
          <ProductCard 
            v-for="produto in maisVendidos" 
            :key="produto.id" 
            :produto="produto" 
          />
        </template>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

useHead({
  title: 'StabArts | Loja de Arte e Artesanato Online'
})

const { data: produtos, pending } = await useFetch('/api/produtos')

const quadros = computed(() => {
  if (!produtos.value) return []
  return produtos.value.filter((p: any) => 
    p.departamento === 'Quadros' || p.nome?.toLowerCase().includes('quadro') || p.nome?.toLowerCase().includes('moldura')
  )
})

const materiais = computed(() => {
  if (!produtos.value) return []
  return produtos.value.filter((p: any) => 
    p.departamento === 'Materias' || p.nome?.toLowerCase().includes('pinc') || p.nome?.toLowerCase().includes('tinta') || p.nome?.toLowerCase().includes('giz')
  )
})

const maisVendidos = computed(() => {
  if (!produtos.value) return []
  return produtos.value.slice(0, 6)
})
</script>

<style lang="scss" scoped>
.banner {
  height: 400px;
  background-image: url('/assets/img/ilustracao.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 40px 5%;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(to top, rgba(45, 41, 41, 0.85) 0%, rgba(45, 41, 41, 0.2) 60%, transparent 100%);
    z-index: 1;
  }
}

.banner__titulo, .banner__textos {
  position: relative;
  z-index: 2;
  color: var(--cor-branco);
}

.banner__titulo {
  font-family: var(--fonte-secundaria);
  font-size: 3rem;
  margin-bottom: 10px;
}

.banner__textos {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.banner__subtitulo {
  font-size: 1.2rem;
}

.banner__botao {
  background-color: var(--cor-principal);
  color: var(--cor-branco);
  padding: 15px 30px;
  font-weight: bold;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--cor-preto);
  }
}

/* Seções de produtos */
.produtos {
  margin: 50px auto;
}

.produtos__topo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  border-bottom: 2px solid var(--cor-cinza);
  padding-bottom: 10px;
}

.produtos__titulo {
  font-family: var(--fonte-secundaria);
  font-size: 1.8rem;
}

.produtos__link {
  color: var(--cor-principal);
  font-weight: bold;
  font-size: 1rem;
  
  &:hover {
    text-decoration: underline;
  }

  span {
    font-size: 1.2rem;
  }
}

.produtos__linha {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 30px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
  grid-column: 1 / -1;
}

/* Faixa de Frete Grátis */
.faixa {
  background-color: var(--cor-principal);
  color: var(--cor-branco);
  padding: 35px 20px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
}

.faixa__textoT {
  font-family: var(--fonte-secundaria);
  font-size: 1.8rem;
}

.faixa__textoP {
  font-size: 1.3rem;
  font-weight: normal;
}
</style>
