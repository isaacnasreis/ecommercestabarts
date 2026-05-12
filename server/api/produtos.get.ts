import fs from 'node:fs'
import path from 'node:path'

function getDbPath() {
  return path.resolve(process.cwd(), 'server/db.json')
}

function readDb() {
  const raw = fs.readFileSync(getDbPath(), 'utf-8')
  return JSON.parse(raw)
}

export default defineEventHandler((event) => {
  try {
    const data = readDb()
    const query = getQuery(event)

    let produtos = data.produtos

    // Filtrar por departamento
    if (query.departamento) {
      const dep = (query.departamento as string).toLowerCase()
      produtos = produtos.filter((p: any) =>
        p.departamento?.toLowerCase() === dep
      )
    }

    // Filtrar por busca textual
    if (query.q) {
      const q = (query.q as string).toLowerCase()
      produtos = produtos.filter((p: any) =>
        p.nome.toLowerCase().includes(q) ||
        p.descricao?.toLowerCase().includes(q) ||
        p.departamento?.toLowerCase().includes(q)
      )
    }

    // Buscar por ID específico
    if (query.id) {
      const product = data.produtos.find((p: any) => p.id === Number(query.id))
      if (!product) {
        throw createError({ statusCode: 404, statusMessage: 'Produto não encontrado' })
      }
      return product
    }

    return produtos
  } catch (err: any) {
    if (err.statusCode) throw err
    throw createError({ statusCode: 500, statusMessage: 'Erro ao ler dados dos produtos' })
  }
})
