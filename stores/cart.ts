import { defineStore } from 'pinia'
import type { Produto, CartItem } from '~/types'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    isOpen: false
  }),

  getters: {
    totalItems: (state) => state.items.reduce((total, item) => total + item.quantity, 0),

    cartTotal: (state) => {
      return state.items.reduce((total, item) => {
        const priceStr = item.product.preco.replace(',', '.')
        const price = parseFloat(priceStr)
        return total + (price * item.quantity)
      }, 0)
    },

    isEmpty: (state) => state.items.length === 0
  },

  actions: {
    addItem(product: Produto, quantity: number = 1) {
      const existingItem = this.items.find(i => i.product.id === product.id)
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        this.items.push({ product, quantity })
      }
      this.isOpen = true
      this._persist()
    },

    removeItem(productId: number) {
      const index = this.items.findIndex(i => i.product.id === productId)
      if (index > -1) {
        this.items.splice(index, 1)
      }
      this._persist()
    },

    updateQuantity(productId: number, quantity: number) {
      const item = this.items.find(i => i.product.id === productId)
      if (item) {
        if (quantity <= 0) {
          this.removeItem(productId)
        } else {
          item.quantity = quantity
          this._persist()
        }
      }
    },

    toggleCart() {
      this.isOpen = !this.isOpen
    },

    clearCart() {
      this.items = []
      this.isOpen = false
      this._persist()
    },

    // Persistência em localStorage
    _persist() {
      if (import.meta.client) {
        localStorage.setItem('stabarts-cart', JSON.stringify(this.items))
      }
    },

    hydrate() {
      if (import.meta.client) {
        const saved = localStorage.getItem('stabarts-cart')
        if (saved) {
          try {
            this.items = JSON.parse(saved)
          } catch {
            this.items = []
          }
        }
      }
    }
  }
})
