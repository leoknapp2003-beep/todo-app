'use client'

import { useState } from 'react'
import { toggleTodo, deleteTodo, editTodo } from '@/app/actions'
import type { Todo } from '@/lib/store'

export default function TodoItem({ todo }: { todo: Todo }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(todo.text)

  const commitEdit = async () => {
    const trimmed = value.trim()
    if (trimmed && trimmed !== todo.text) await editTodo(todo.id, trimmed)
    else setValue(todo.text)
    setEditing(false)
  }

  return (
    <li className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 group transition-colors">
      <form action={toggleTodo.bind(null, todo.id)}>
        <button
          type="submit"
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
            todo.completed
              ? 'bg-gradient-to-br from-violet-500 to-indigo-600 border-violet-500'
              : 'border-gray-300 hover:border-violet-400'
          }`}
        >
          {todo.completed && (
            <span className="text-white text-[10px] font-bold leading-none">✓</span>
          )}
        </button>
      </form>

      {editing ? (
        <input
          autoFocus
          value={value}
          onChange={e => setValue(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={e => {
            if (e.key === 'Enter') commitEdit()
            if (e.key === 'Escape') { setValue(todo.text); setEditing(false) }
          }}
          className="flex-1 border border-violet-400 rounded-md px-2 py-0.5 text-sm outline-none text-gray-700"
        />
      ) : (
        <span
          onDoubleClick={() => { if (!todo.completed) setEditing(true) }}
          className={`flex-1 text-sm px-1 rounded transition-colors ${
            todo.completed
              ? 'line-through text-gray-300 cursor-default'
              : 'text-gray-700 hover:bg-gray-100 cursor-text'
          }`}
        >
          {todo.text}
        </span>
      )}

      <form action={deleteTodo.bind(null, todo.id)}>
        <button
          type="submit"
          className="opacity-0 group-hover:opacity-100 text-red-400 hover:bg-red-50 w-7 h-7 flex items-center justify-center rounded-lg text-base transition-all flex-shrink-0"
        >
          ×
        </button>
      </form>
    </li>
  )
}
