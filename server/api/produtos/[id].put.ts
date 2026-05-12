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
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const data = readDb()

  const index = data.produtos.findIndex((p: any) => p.id === id)
  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Produto não encontrado' })
  }

  data.produtos[index] = { ...data.produtos[index], ...body, id }
  writeDb(data)

  return data.produtos[index]
})
