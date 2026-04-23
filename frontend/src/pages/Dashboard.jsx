import { useState, useMemo } from 'react'
import { useUser } from "@clerk/react"
import Navbar from '../components/Navbar'
import PasswordCard from '../components/PasswordCard'
import PasswordModal from '../components/PasswordModal'
import EmptyState from '../components/EmptyState'
import StatsBar from '../components/StatsBar'
import SkeletonCard from '../components/SkeletonCard'
import { usePasswords } from '../hooks/usePasswords'
import { ArrowUpDown, Clock, AlignLeft } from 'lucide-react'

const SORT_OPTIONS = [
  { value: 'recent', label: 'Recent', icon: Clock },
  { value: 'az', label: 'A → Z', icon: AlignLeft },
]

export default function Dashboard() {
  const { user } = useUser()
  const { passwords, loading, addPassword, updatePassword, deletePassword } = usePasswords()
  const [modalOpen, setModalOpen] = useState(false)
  const [editEntry, setEditEntry] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('recent')

  const filtered = useMemo(() => {
    let list = [...passwords]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(p =>
        p.websiteName?.toLowerCase().includes(q) ||
        p.username?.toLowerCase().includes(q) ||
        p.url?.toLowerCase().includes(q)
      )
    }

    if (sortBy === 'az') {
      list.sort((a, b) => a.websiteName?.localeCompare(b.websiteName))
    }
    // 'recent' is default from server (newest first)

    return list
  }, [passwords, searchQuery, sortBy])

  const handleAdd = () => {
    setEditEntry(null)
    setModalOpen(true)
  }

  const handleEdit = (entry) => {
    setEditEntry(entry)
    setModalOpen(true)
  }

  const handleSubmit = async (form) => {
    if (editEntry) {
      await updatePassword(editEntry._id, form)
    } else {
      await addPassword(form)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <Navbar
        onAdd={handleAdd}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Welcome back, {user?.firstName || 'there'} 👋
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Your credentials are encrypted and safe.
          </p>
        </div>

        {/* Stats */}
        {!loading && passwords.length > 0 && (
          <StatsBar passwords={passwords} />
        )}

        {/* Toolbar */}
        {!loading && passwords.length > 0 && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-[var(--text-secondary)]">
              {filtered.length} credential{filtered.length !== 1 ? 's' : ''}
              {searchQuery && ` for "${searchQuery}"`}
            </p>
            <div className="flex items-center gap-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-0.5">
              {SORT_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setSortBy(value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    sortBy === value
                      ? 'bg-vault-500 text-white shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState onAdd={handleAdd} hasSearch={!!searchQuery} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(entry => (
              <PasswordCard
                key={entry._id}
                entry={entry}
                onEdit={handleEdit}
                onDelete={deletePassword}
              />
            ))}
          </div>
        )}
      </main>

      <PasswordModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        editEntry={editEntry}
      />
    </div>
  )
}
