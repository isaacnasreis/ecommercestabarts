import { defineStore } from 'pinia'
import type { Notification } from '~/types'

let nextId = 1

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [] as Notification[]
  }),

  actions: {
    add(message: string, type: 'success' | 'error' | 'info' = 'info', duration = 3500) {
      const id = nextId++
      this.notifications.push({ id, message, type, duration })

      setTimeout(() => {
        this.remove(id)
      }, duration)
    },

    remove(id: number) {
      const index = this.notifications.findIndex(n => n.id === id)
      if (index > -1) {
        this.notifications.splice(index, 1)
      }
    },

    success(message: string) {
      this.add(message, 'success')
    },

    error(message: string) {
      this.add(message, 'error', 5000)
    },

    info(message: string) {
      this.add(message, 'info')
    }
  }
})
