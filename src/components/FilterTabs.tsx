import Link from 'next/link'

const TABS = [
  { key: 'all',    label: 'すべて' },
  { key: 'active', label: '未完了' },
  { key: 'done',   label: '完了済み' },
] as const

export default function FilterTabs({ current }: { current: string }) {
  return (
    <div className="flex gap-1.5 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
      {TABS.map(tab => (
        <Link
          key={tab.key}
          href={`/?filter=${tab.key}`}
          className={`text-xs font-medium px-4 py-1.5 rounded-full border-2 transition-colors ${
            current === tab.key
              ? 'bg-violet-500 text-white border-violet-500'
              : 'border-transparent text-gray-500 hover:text-violet-500 hover:border-violet-300'
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  )
}
