import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoItem from './TodoItem'
import { toggleTodo, deleteTodo, editTodo } from '@/app/actions'
import type { Todo } from '@/lib/store'

vi.mock('@/app/actions', () => ({
  addTodo: vi.fn().mockResolvedValue(undefined),
  toggleTodo: vi.fn().mockResolvedValue(undefined),
  deleteTodo: vi.fn().mockResolvedValue(undefined),
  editTodo: vi.fn().mockResolvedValue(undefined),
  clearCompleted: vi.fn().mockResolvedValue(undefined),
}))

const baseTodo: Todo = {
  id: 'test-id-1',
  text: 'テストタスク',
  completed: false,
  createdAt: '2024-01-01T00:00:00.000Z',
}

describe('TodoItem', () => {
  beforeEach(() => vi.clearAllMocks())

  describe('表示', () => {
    it('タスクのテキストが表示される', () => {
      render(<TodoItem todo={baseTodo} />)
      expect(screen.getByText('テストタスク')).toBeInTheDocument()
    })

    it('未完了タスクにはチェックマークが表示されない', () => {
      render(<TodoItem todo={baseTodo} />)
      expect(screen.queryByText('✓')).not.toBeInTheDocument()
    })

    it('完了済みタスクにはチェックマークが表示される', () => {
      render(<TodoItem todo={{ ...baseTodo, completed: true }} />)
      expect(screen.getByText('✓')).toBeInTheDocument()
    })

    it('完了済みタスクのテキストに打ち消し線が適用される', () => {
      render(<TodoItem todo={{ ...baseTodo, completed: true }} />)
      expect(screen.getByText('テストタスク')).toHaveClass('line-through')
    })

    it('未完了タスクのテキストに打ち消し線がない', () => {
      render(<TodoItem todo={baseTodo} />)
      expect(screen.getByText('テストタスク')).not.toHaveClass('line-through')
    })
  })

  describe('完了トグル', () => {
    it('チェックボタンをクリックするとtoggleTodoが呼ばれる', async () => {
      const user = userEvent.setup()
      render(<TodoItem todo={baseTodo} />)
      await user.click(screen.getByRole('button', { name: '完了にする' }))
      await waitFor(() => expect(vi.mocked(toggleTodo)).toHaveBeenCalledOnce())
    })

    it('完了済みタスクのボタンにaria-label "完了を取り消す" が設定される', () => {
      render(<TodoItem todo={{ ...baseTodo, completed: true }} />)
      expect(screen.getByRole('button', { name: '完了を取り消す' })).toBeInTheDocument()
    })
  })

  describe('削除', () => {
    it('削除ボタンをクリックするとdeleteTodoが呼ばれる', async () => {
      const user = userEvent.setup()
      render(<TodoItem todo={baseTodo} />)
      await user.click(screen.getByRole('button', { name: '削除' }))
      await waitFor(() => expect(vi.mocked(deleteTodo)).toHaveBeenCalledOnce())
    })
  })

  describe('インライン編集', () => {
    it('テキストをダブルクリックすると編集モードになる', async () => {
      const user = userEvent.setup()
      render(<TodoItem todo={baseTodo} />)
      await user.dblClick(screen.getByText('テストタスク'))
      expect(screen.getByDisplayValue('テストタスク')).toBeInTheDocument()
    })

    it('完了済みタスクはダブルクリックしても編集モードにならない', async () => {
      const user = userEvent.setup()
      render(<TodoItem todo={{ ...baseTodo, completed: true }} />)
      await user.dblClick(screen.getByText('テストタスク'))
      expect(screen.queryByDisplayValue('テストタスク')).not.toBeInTheDocument()
    })

    it('Enterキーを押すとeditTodoが新しいテキストで呼ばれる', async () => {
      const user = userEvent.setup()
      render(<TodoItem todo={baseTodo} />)
      await user.dblClick(screen.getByText('テストタスク'))
      const input = screen.getByDisplayValue('テストタスク')
      await user.clear(input)
      await user.type(input, '更新タスク{Enter}')
      await waitFor(() =>
        expect(vi.mocked(editTodo)).toHaveBeenCalledWith('test-id-1', '更新タスク')
      )
    })

    it('テキストが変更されていない場合editTodoは呼ばれない', async () => {
      const user = userEvent.setup()
      render(<TodoItem todo={baseTodo} />)
      await user.dblClick(screen.getByText('テストタスク'))
      await user.keyboard('{Enter}')
      expect(vi.mocked(editTodo)).not.toHaveBeenCalled()
    })

    it('Escapeキーで編集がキャンセルされ元のテキストに戻る', async () => {
      const user = userEvent.setup()
      render(<TodoItem todo={baseTodo} />)
      await user.dblClick(screen.getByText('テストタスク'))
      const input = screen.getByDisplayValue('テストタスク')
      await user.clear(input)
      await user.type(input, 'キャンセルテスト')
      await user.keyboard('{Escape}')
      expect(screen.getByText('テストタスク')).toBeInTheDocument()
      expect(vi.mocked(editTodo)).not.toHaveBeenCalled()
    })

    it('フォーカスが外れるとeditTodoが呼ばれる', async () => {
      const user = userEvent.setup()
      render(<TodoItem todo={baseTodo} />)
      await user.dblClick(screen.getByText('テストタスク'))
      const input = screen.getByDisplayValue('テストタスク')
      await user.clear(input)
      await user.type(input, 'ブラーテスト')
      await user.tab()
      await waitFor(() =>
        expect(vi.mocked(editTodo)).toHaveBeenCalledWith('test-id-1', 'ブラーテスト')
      )
    })
  })
})
