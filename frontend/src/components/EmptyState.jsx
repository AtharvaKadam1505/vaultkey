import { ShieldPlus } from 'lucide-react'

export default function EmptyState({ onAdd, hasSearch }) {
  if (hasSearch) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
        <div className="w-16 h-16 bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl flex items-center justify-center mb-4">
          <span className="text-3xl">🔍</span>
        </div>
        <h3 className="font-semibold text-[var(--text-primary)] mb-1">No results found</h3>
        <p className="text-sm text-[var(--text-secondary)]">Try a different search term</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
      <div className="w-20 h-20 bg-vault-50 dark:bg-vault-950/30 border-2 border-dashed border-vault-200 dark:border-vault-900 rounded-2xl flex items-center justify-center mb-5">
        <ShieldPlus className="w-9 h-9 text-vault-400" />
      </div>
      <h3 className="font-bold text-lg text-[var(--text-primary)] mb-1.5">Your vault is empty</h3>
      <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-xs">
        Add your first credential to securely store and manage your passwords.
      </p>
      <button onClick={onAdd} className="btn-primary">
        Add your first credential
      </button>
    </div>
  )
}
