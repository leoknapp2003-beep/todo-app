import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import FilterTabs from './FilterTabs'

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string
    children: React.ReactNode
    className?: string
  }) => <a href={href} className={className}>{children}</a>,
}))

describe('FilterTabs', () => {
  it('3つのフィルタータブが表示される', () => {
    render(<FilterTabs current="all" />)
    expect(screen.getByText('すべて')).toBeInTheDocument()
    expect(screen.getByText('未完了')).toBeInTheDocument()
    expect(screen.getByText('完了済み')).toBeInTheDocument()
  })

  it('currentが"all"のとき「すべて」タブがアクティブになる', () => {
    render(<FilterTabs current="all" />)
    expect(screen.getByText('すべて').closest('a')).toHaveClass('bg-violet-500')
    expect(screen.getByText('未完了').closest('a')).not.toHaveClass('bg-violet-500')
    expect(screen.getByText('完了済み').closest('a')).not.toHaveClass('bg-violet-500')
  })

  it('currentが"active"のとき「未完了」タブがアクティブになる', () => {
    render(<FilterTabs current="active" />)
    expect(screen.getByText('未完了').closest('a')).toHaveClass('bg-violet-500')
    expect(screen.getByText('すべて').closest('a')).not.toHaveClass('bg-violet-500')
    expect(screen.getByText('完了済み').closest('a')).not.toHaveClass('bg-violet-500')
  })

  it('currentが"done"のとき「完了済み」タブがアクティブになる', () => {
    render(<FilterTabs current="done" />)
    expect(screen.getByText('完了済み').closest('a')).toHaveClass('bg-violet-500')
    expect(screen.getByText('すべて').closest('a')).not.toHaveClass('bg-violet-500')
    expect(screen.getByText('未完了').closest('a')).not.toHaveClass('bg-violet-500')
  })

  it('各タブのhrefが正しいURLを持つ', () => {
    render(<FilterTabs current="all" />)
    expect(screen.getByText('すべて').closest('a')).toHaveAttribute('href', '/?filter=all')
    expect(screen.getByText('未完了').closest('a')).toHaveAttribute('href', '/?filter=active')
    expect(screen.getByText('完了済み').closest('a')).toHaveAttribute('href', '/?filter=done')
  })
})
