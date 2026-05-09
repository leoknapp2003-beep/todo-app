'use client'

import { useRef } from 'react'
import { addTodo } from '@/app/actions'

export default function AddTodoForm() {
  const ref = useRef<HTMLFormElement>(null)

  return (
    <form
      ref={ref}
      action={async (formData) => {
        await addTodo(formData)
        ref.current?.reset()
      }}
      className="flex gap-2.5 p-4 border-b border-gray-100"
    >
      <input
        name="text"
        type="text"
        placeholder="新しいタスクを入力... (Enterで追加)"
        autoComplete="off"
        className="flex-1 border-2 border-gray-200 focus:border-violet-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors text-gray-700 placeholder:text-gray-300"
      />
      <button
        type="submit"
        className="bg-gradient-to-r from-violet-500 to-indigo-600 hover:opacity-90 active:scale-95 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all whitespace-nowrap"
      >
        追加
      </button>
    </form>
  )
}
