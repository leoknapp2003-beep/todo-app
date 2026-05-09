import fs from 'fs'
import path from 'path'

export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: string
}

// Vercel serverless は process.cwd() が読み取り専用のため /tmp を使用
const DATA_DIR = process.env.VERCEL ? '/tmp' : path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'todos.json')

function ensureFile(): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf-8')
}

export function getTodos(): Todo[] {
  ensureFile()
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')) as Todo[]
}

export function saveTodos(todos: Todo[]): void {
  ensureFile()
  fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2), 'utf-8')
}
