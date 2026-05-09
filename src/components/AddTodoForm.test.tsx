import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddTodoForm from './AddTodoForm'
import { addTodo } from '@/app/actions'

vi.mock('@/app/actions', () => ({
  addTodo: vi.fn().mockResolvedValue(undefined),
  toggleTodo: vi.fn().mockResolvedValue(undefined),
  deleteTodo: vi.fn().mockResolvedValue(undefined),
  editTodo: vi.fn().mockResolvedValue(undefined),
  clearCompleted: vi.fn().mockResolvedValue(undefined),
}))

describe('AddTodoForm', () => {
  beforeEach(() => vi.clearAllMocks())

  it('入力フィールドと追加ボタンが表示される', () => {
    render(<AddTodoForm />)
    expect(screen.getByPlaceholderText(/新しいタスクを入力/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '追加' })).toBeInTheDocument()
  })

  it('テキストを入力して追加ボタンをクリックするとaddTodoが呼ばれる', async () => {
    const user = userEvent.setup()
    render(<AddTodoForm />)
    await user.type(screen.getByPlaceholderText(/新しいタスクを入力/), 'テストタスク')
    await user.click(screen.getByRole('button', { name: '追加' }))
    await waitFor(() => {
      expect(vi.mocked(addTodo)).toHaveBeenCalledOnce()
      const formData = vi.mocked(addTodo).mock.calls[0][0] as FormData
      expect(formData.get('text')).toBe('テストタスク')
    })
  })

  it('Enterキーで送信するとaddTodoが呼ばれる', async () => {
    const user = userEvent.setup()
    render(<AddTodoForm />)
    await user.type(screen.getByPlaceholderText(/新しいタスクを入力/), 'Enterテスト{Enter}')
    await waitFor(() => expect(vi.mocked(addTodo)).toHaveBeenCalledOnce())
  })

  it('送信後に入力フィールドがリセットされる', async () => {
    const user = userEvent.setup()
    render(<AddTodoForm />)
    const input = screen.getByPlaceholderText(/新しいタスクを入力/)
    await user.type(input, 'リセットテスト')
    await user.click(screen.getByRole('button', { name: '追加' }))
    await waitFor(() => expect(input).toHaveValue(''))
  })
})
