import { UserButton, useUser } from "@clerk/react"
import { Shield, Sun, Moon, Plus } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

export default function Navbar({ onAdd, searchQuery, setSearchQuery }) {
  const { user } = useUser()
  const { isDark, toggle } = useTheme()

  return (
    <header className="sticky top-0 z-30 bg-[var(--bg-primary)] border-b border-[var(--border)] backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-vault-500 rounded-lg flex items-center justify-center shadow-lg shadow-vault-500/20">
            <Shield className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-lg tracking-tight hidden sm:block">
            Vault<span className="text-vault-500">Key</span>
          </span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search credentials…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="input-field text-sm py-2"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onAdd}
            className="btn-primary text-sm py-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:block">Add</span>
          </button>

          <button
            onClick={toggle}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-vault-50 dark:hover:bg-dark-500 transition-all"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <UserButton />
        </div>
      </div>
    </header>
  );
}
