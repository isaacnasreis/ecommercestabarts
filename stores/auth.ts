import { defineStore } from 'pinia'

interface AuthUser {
  id: number
  nome: string
  email: string
  isAdmin: boolean
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthUser | null,
    isAuthenticated: false
  }),

  getters: {
    isAdmin: (state) => state.user?.isAdmin ?? false,
    userName: (state) => state.user?.nome ?? ''
  },

  actions: {
    async login(email: string, senha: string) {
      const data = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, senha }
      })

      this.user = data as AuthUser
      this.isAuthenticated = true
      this._persist()
      return data
    },

    async register(nome: string, email: string, senha: string) {
      const data = await $fetch('/api/auth/register', {
        method: 'POST',
        body: { nome, email, senha }
      })

      return data
    },

    logout() {
      this.user = null
      this.isAuthenticated = false
      this._persist()
    },

    _persist() {
      if (import.meta.client) {
        if (this.user) {
          localStorage.setItem('stabarts-auth', JSON.stringify({
            user: this.user,
            isAuthenticated: this.isAuthenticated
          }))
        } else {
          localStorage.removeItem('stabarts-auth')
        }
      }
    },

    hydrate() {
      if (import.meta.client) {
        const saved = localStorage.getItem('stabarts-auth')
        if (saved) {
          try {
            const data = JSON.parse(saved)
            this.user = data.user
            this.isAuthenticated = data.isAuthenticated
          } catch {
            this.user = null
            this.isAuthenticated = false
          }
        }
      }
    }
  }
})
