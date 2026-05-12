import fs from 'node:fs'
import path from 'node:path'
import dbRaw from '../db.json'

let memoryDb = JSON.parse(JSON.stringify(dbRaw))

export const getDbData = () => {
  return memoryDb
}

export const saveDbData = (newData: any) => {
  memoryDb = newData

  try {
    const targetPath = path.resolve(process.cwd(), 'server/db.json')
    if (fs.existsSync(targetPath)) {
      fs.writeFileSync(targetPath, JSON.stringify(newData, null, 2), 'utf-8')
    }
  } catch (err) {
    console.warn('[Database] Rodando em sistema de arquivos Read-Only. Alteração mantida apenas em memória.')
  }
}
