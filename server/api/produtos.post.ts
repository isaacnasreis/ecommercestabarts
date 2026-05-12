import fs from 'node:fs'
import path from 'node:path'

function getDbPath() {
  return path.resolve(process.cwd(), 'server/db.json')
}

function readDb() {
  const raw = fs.readFileSync(getDbPath(), 'utf-8')
  return JSON.parse(raw)
}

function writeDb(data: any) {
  fs.writeFileSync(getDbPath(), JSON.stringify(data, null, 2), 'utf-8')
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.nome || !body.preco) {
    throw createError({ statusCode: 400, statusMessage: 'Nome e preço são obrigatórios' })
  }

  const data = readDb()
  const maxId = data.produtos.reduce((max: number, p: any) => Math.max(max, p.id), 0)

  const novoProduto = {
    id: maxId + 1,
    imagem: body.imagem || '',
    nome: body.nome,
    departamento: body.departamento || '',
    precoAntigo: body.precoAntigo || '',
    preco: body.preco,
    descricao: body.descricao || ''
  }

  data.produtos.push(novoProduto)
  writeDb(data)

  return novoProduto
})
