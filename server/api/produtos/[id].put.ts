export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)
  const data = getDbData()

  const index = data.produtos.findIndex((p: any) => p.id === id)
  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Produto não encontrado' })
  }

  data.produtos[index] = { ...data.produtos[index], ...body, id }
  saveDbData(data)

  return data.produtos[index]
})
