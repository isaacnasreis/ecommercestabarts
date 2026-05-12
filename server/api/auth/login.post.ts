import fs from 'node:fs'
import path from 'node:path'

function getDbPath() {
  return path.resolve(process.cwd(), 'server/db.json')
}

function readDb() {
  const raw = fs.readFileSync(getDbPath(), 'utf-8')
  return JSON.parse(raw)
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.email || !body.senha) {
    throw createError({ statusCode: 400, statusMessage: 'Email e senha são obrigatórios' })
  }

  const data = readDb()
  const user = data.profile.find(
    (u: any) => u.email === body.email && u.senha === body.senha
  )

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Email ou senha inválidos' })
  }

  // Retorna sem a senha
  return {
    id: user.id,
    nome: user.nome,
    email: user.email,
    isAdmin: user.email === 'admin@email.com'
  }
})
