import { getTodos } from '@/lib/store'
import { clearCompleted } from './actions'
import AddTodoForm from '@/components/AddTodoForm'
import FilterTabs from '@/components/FilterTabs'
import TodoItem from '@/components/TodoItem'

export const dynamic = 'force-dynamic'

type Filter = 'all' | 'active' | 'done'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const { filter: rawFilter } = await searchParams
  const filter = (['all', 'active', 'done'].includes(rawFilter ?? '')
    ? rawFilter
    : 'all') as Filter

  const allTodos = getTodos()
  const visibleTodos = allTodos.filter(t => {
    if (filter === 'active') return !t.completed
    if (filter === 'done') return t.completed
    return true
  })

  const activeCount = allTodos.filter(t => !t.completed).length
  const hasCompleted = allTodos.some(t => t.completed)

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 flex items-start justify-center pt-16 pb-12 px-4">
      <div className="w-full max-w-lg">
        <h1 className="text-center text-white text-5xl font-bold mb-8 tracking-tight drop-shadow-lg">
          ✅ TODO
        </h1>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <AddTodoForm />
          <FilterTabs current={filter} />

          <ul className="divide-y divide-gray-100 max-h-[420px] overflow-y-auto">
            {visibleTodos.length === 0 ? (
              <li className="flex flex-col items-center justify-center py-16 text-gray-300">
                <span className="text-5xl mb-3">
                  {filter === 'done' ? '🎉' : filter === 'active' ? '✨' : '📝'}
                </span>
                <p className="text-sm">
                  {filter === 'done'
                    ? '完了済みのタスクはありません'
                    : filter === 'active'
                    ? '未完了のタスクはありません'
                    : 'タスクを追加してください'}
                </p>
              </li>
            ) : (
              visibleTodos.map(todo => <TodoItem key={todo.id} todo={todo} />)
            )}
          </ul>

          <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-100">
            <span className="text-xs text-gray-400">{activeCount} 件残り</span>
            <form action={clearCompleted}>
              <button
                type="submit"
                disabled={!hasCompleted}
                className="text-xs text-red-400 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-default disabled:hover:bg-transparent"
              >
                完了済みを削除
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-gray-300 pb-3">
            ダブルクリックでタスクを編集
          </p>
        </div>
      </div>
    </main>
  )
}
