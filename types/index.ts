export interface Produto {
  id: number
  nome: string
  imagem: string
  preco: string
  precoAntigo: string
  descricao?: string
  departamento?: string
}

export interface Usuario {
  id: number
  nome: string
  email: string
  senha: string
}

export interface CartItem {
  product: Produto
  quantity: number
}

export type Departamento = 'Quadros' | 'Materias' | 'Esculturas' | 'Molduras'

export interface Notification {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
  duration?: number
}
