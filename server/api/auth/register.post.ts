export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.nome || !body.email || !body.senha) {
    throw createError({ statusCode: 400, statusMessage: 'Nome, email e senha são obrigatórios' })
  }

  const data = getDbData()

  // Verifica se email já existe
  const exists = data.profile.find((u: any) => u.email === body.email)
  if (exists) {
    throw createError({ statusCode: 409, statusMessage: 'Este email já está cadastrado' })
  }

  const maxId = data.profile.reduce((max: number, u: any) => Math.max(max, u.id), 0)

  const novoUsuario = {
    id: maxId + 1,
    nome: body.nome,
    email: body.email,
    senha: body.senha
  }

  data.profile.push(novoUsuario)
  saveDbData(data)

  return {
    id: novoUsuario.id,
    nome: novoUsuario.nome,
    email: novoUsuario.email,
    isAdmin: false
  }
})
