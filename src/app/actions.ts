'use server'

import { revalidatePath } from 'next/cache'
import { randomUUID } from 'crypto'
import { getTodos, saveTodos } from '@/lib/store'

export async function addTodo(formData: FormData): Promise<void> {
  const text = (formData.get('text') as string)?.trim()
  if (!text) return
  const todos = getTodos()
  todos.unshift({
    id: randomUUID(),
    text,
    completed: false,
    createdAt: new Date().toISOString(),
  })
  saveTodos(todos)
  revalidatePath('/')
}

export async function toggleTodo(id: string): Promise<void> {
  const todos = getTodos()
  const todo = todos.find(t => t.id === id)
  if (todo) todo.completed = !todo.completed
  saveTodos(todos)
  revalidatePath('/')
}

export async function deleteTodo(id: string): Promise<void> {
  saveTodos(getTodos().filter(t => t.id !== id))
  revalidatePath('/')
}

export async function editTodo(id: string, text: string): Promise<void> {
  const trimmed = text.trim()
  if (!trimmed) return
  const todos = getTodos()
  const todo = todos.find(t => t.id === id)
  if (todo) todo.text = trimmed
  saveTodos(todos)
  revalidatePath('/')
}

export async function clearCompleted(): Promise<void> {
  saveTodos(getTodos().filter(t => !t.completed))
  revalidatePath('/')
}
