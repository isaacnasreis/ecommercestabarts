# StabArts — E-commerce de Arte e Artesanato

<p align="center">
  <img src="public/assets/img/logo.svg" alt="StabArts Logo" height="60">
</p>

<p align="center">
  <strong>Plataforma moderna de e-commerce para produtos de arte</strong><br>
  Desenvolvido com Nuxt 3, Pinia e SCSS — foco em performance, acessibilidade e UI premium.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/nuxt-3.21-00DC82?logo=nuxtdotjs&logoColor=white" alt="Nuxt 3">
  <img src="https://img.shields.io/badge/vue-3.5-4FC08D?logo=vuedotjs&logoColor=white" alt="Vue 3">
  <img src="https://img.shields.io/badge/pinia-state-yellow?logo=pinia" alt="Pinia">
  <img src="https://img.shields.io/badge/scss-modular-CC6699?logo=sass&logoColor=white" alt="SCSS">
  <img src="https://img.shields.io/badge/typescript-typed-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
</p>

---

## Sobre o Projeto

StabArts é um **e-commerce funcional de produtos de arte** criado como case de portfólio para demonstrar domínio em:

- **Arquitetura moderna** com Nuxt 3 (SSR + Nitro API)
- **Gerenciamento de estado** reativo com Pinia
- **Design system** consistente com variáveis CSS e SCSS modular
- **CRUD completo** via API server-side (Nitro handlers)
- **Autenticação** com controle de permissões (admin/user)
- **UI/UX premium** com micro-animações, skeleton loading e toast notifications

### Contexto

Este projeto é uma **evolução** de uma versão legada construída com HTML, CSS e JavaScript puros em 2023. A refatoração manteve a identidade visual original (paleta, tipografia e layout) enquanto modernizou toda a arquitetura, funcionalidades e experiência do usuário.

---

## Funcionalidades

| Feature | Descrição |
|---|---|
| **Catálogo de Produtos** | Listagem com grid responsivo, imagens externas e preços formatados |
| **Busca textual** | Campo de pesquisa no header com filtro via query params |
| **Filtros por categoria** | Chips de departamento (Quadros, Materiais, Molduras, Esculturas) |
| **Detalhe do produto** | Página individual com seletor de quantidade e badge de desconto |
| **Carrinho persistente** | Sidebar com controle de itens, persistência em localStorage |
| **Checkout completo** | Formulário multi-step com métodos de pagamento (Cartão/PIX/Boleto) |
| **Autenticação** | Login e cadastro com validação e feedback visual |
| **Painel Admin** | CRUD de produtos protegido por middleware (criar, editar, excluir) |
| **Toast Notifications** | Sistema de feedbacks visuais animados (success/error/info) |
| **Menu Mobile** | Navegação responsiva com hamburger animado |
| **Skeleton Loading** | Loading states com shimmer animation |

---

## Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| **Framework** | [Nuxt 3](https://nuxt.com) (SSR/CSR) |
| **UI** | [Vue 3](https://vuejs.org) (Composition API, `<script setup>`) |
| **Estado** | [Pinia](https://pinia.vuejs.org) (stores reativos + localStorage) |
| **Estilos** | SCSS modular com design tokens (variáveis CSS) |
| **API** | Nitro server handlers (REST) |
| **Tipagem** | TypeScript (interfaces compartilhadas) |
| **Dados** | JSON file-based (mock de banco de dados) |

---

## 📂 Estrutura do Projeto

```
ecommercestabarts/
├── assets/css/          # Design system global (main.scss)
├── components/          # Componentes reutilizáveis
│   ├── CartSidebar.vue
│   ├── ProductCard.vue
│   └── ToastNotification.vue
├── layouts/             # Layout principal (header, footer, nav)
│   └── default.vue
├── middleware/           # Guards de rota
│   ├── auth.ts          # Requer autenticação
│   └── admin.ts         # Requer permissão admin
├── pages/               # Rotas automáticas (file-based routing)
│   ├── index.vue        # Homepage
│   ├── login.vue        # Autenticação
│   ├── cadastro.vue     # Registro
│   ├── checkout.vue     # Finalização de compra
│   ├── produtos/
│   │   ├── index.vue    # Listagem com filtros
│   │   └── [id].vue     # Detalhe do produto
│   └── admin/
│       ├── index.vue    # Tabela de gerenciamento
│       ├── novo.vue     # Criar produto
│       └── editar/[id].vue  # Editar produto
├── server/              # API backend (Nitro)
│   ├── db.json          # Banco de dados mock
│   └── api/
│       ├── produtos.get.ts    # GET /api/produtos
│       ├── produtos.post.ts   # POST /api/produtos
│       ├── produtos/[id].put.ts    # PUT /api/produtos/:id
│       ├── produtos/[id].delete.ts # DELETE /api/produtos/:id
│       └── auth/
│           ├── login.post.ts      # POST /api/auth/login
│           └── register.post.ts   # POST /api/auth/register
├── stores/              # Gerenciamento de estado
│   ├── auth.ts          # Autenticação + permissões
│   ├── cart.ts          # Carrinho de compras
│   └── notification.ts  # Sistema de toasts
├── types/               # Interfaces TypeScript
│   └── index.ts
├── public/assets/img/   # Imagens estáticas (logo, ícones, banners)
├── nuxt.config.ts
└── package.json
```

---

## Como Executar

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
node .output/server/index.mjs
```

O projeto estará disponível em **http://localhost:3000**

---

## Credenciais de Demonstração

| Perfil | Email | Senha | Permissões |
|---|---|---|---|
| **Admin** | `admin@email.com` | `123456` | CRUD de produtos, acesso ao painel |
| **Usuário** | `isaac@email.com` | `321` | Compras, carrinho, checkout |

---

## Design System

A identidade visual é controlada por variáveis CSS globais em `assets/css/main.scss`:

| Token | Valor | Uso |
|---|---|---|
| `--cor-principal` | `#ED3F3F` | CTAs, destaques, links ativos |
| `--cor-principal-clara` | `#F5ACAC` | Backgrounds suaves, nav bar |
| `--cor-preto` | `#2D2929` | Textos, header, botões secundários |
| `--fonte-principal` | Abhaya Libre | Body text, formulários |
| `--fonte-secundaria` | Aclonica | Títulos, headings |

---

## API Endpoints

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/produtos` | Lista todos (suporta `?q=`, `?departamento=`, `?id=`) |
| `POST` | `/api/produtos` | Cria novo produto |
| `PUT` | `/api/produtos/:id` | Atualiza produto existente |
| `DELETE` | `/api/produtos/:id` | Remove produto |
| `POST` | `/api/auth/login` | Autenticação |
| `POST` | `/api/auth/register` | Cadastro |

---

## Responsividade

O layout é **mobile-first** com breakpoints:
- **Desktop:** Grid de 4 colunas, sidebar fixa no checkout
- **Tablet (≤900px):** Grid de 2–3 colunas, layout simplificado
- **Mobile (≤768px):** Coluna única, menu hamburger, busca full-width

---

## Autor

**Isaac N. Reis**
- [Portfólio](https://isaacnasreis.github.io/portfolio-js/)
- [GitHub](https://github.com/isaacnasreis)

---

## 📝 Licença

Projeto desenvolvido para fins de estudo e portfólio.
