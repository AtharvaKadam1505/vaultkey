import { useState } from 'react'
import { Eye, EyeOff, Copy, Edit2, Trash2, ExternalLink, Check } from 'lucide-react'
import { copyToClipboard, getFaviconUrl, formatUrl } from '../utils/passwordUtils'
import toast from 'react-hot-toast'

export default function PasswordCard({ entry, onEdit, onDelete }) {
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const faviconUrl = getFaviconUrl(entry.url)
  const displayDomain = formatUrl(entry.url)

  const handleCopy = async () => {
    try {
      await copyToClipboard(entry.password)
      setCopied(true)
      toast.success('Password copied!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(`Delete credentials for "${entry.websiteName}"?`)) return
    setDeleting(true)
    try {
      await onDelete(entry._id)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="card p-4 hover:shadow-lg dark:hover:shadow-vault-950/40 transition-all duration-200 animate-slide-up group">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Favicon / Letter Avatar */}
          <div className="w-10 h-10 rounded-lg bg-vault-50 dark:bg-dark-500 border border-[var(--border)] flex items-center justify-center shrink-0 overflow-hidden">
            {faviconUrl ? (
              <img
                src={faviconUrl}
                alt=""
                className="w-5 h-5 object-contain"
                onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
              />
            ) : null}
            <span
              className="text-vault-600 dark:text-vault-400 font-bold text-sm"
              style={{ display: faviconUrl ? 'none' : 'flex' }}
            >
              {entry.websiteName?.[0]?.toUpperCase() || '?'}
            </span>
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold text-[var(--text-primary)] truncate">{entry.websiteName}</h3>
            {entry.url && (
              <a
                href={entry.url.startsWith('http') ? entry.url : `https://${entry.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-vault-500 hover:text-vault-600 truncate flex items-center gap-1"
              >
                {displayDomain}
                <ExternalLink className="w-2.5 h-2.5 shrink-0" />
              </a>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(entry)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-vault-500 hover:bg-vault-50 dark:hover:bg-dark-500 transition-all"
            title="Edit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Credentials */}
      <div className="space-y-2">
        {/* Username */}
        <div className="flex items-center gap-2 bg-[var(--bg-secondary)] rounded-lg px-3 py-2">
          <span className="text-xs text-[var(--text-muted)] w-16 shrink-0 font-medium">user</span>
          <span className="text-sm text-[var(--text-primary)] font-mono truncate flex-1">
            {entry.username}
          </span>
          <button
            onClick={() => copyToClipboard(entry.username).then(() => toast.success('Username copied!'))}
            className="text-[var(--text-muted)] hover:text-vault-500 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Password */}
        <div className="flex items-center gap-2 bg-[var(--bg-secondary)] rounded-lg px-3 py-2">
          <span className="text-xs text-[var(--text-muted)] w-16 shrink-0 font-medium">pass</span>
          <span className="text-sm text-[var(--text-primary)] font-mono truncate flex-1 tracking-wider">
            {showPassword ? entry.password : '••••••••••••'}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowPassword(v => !v)}
              className="text-[var(--text-muted)] hover:text-vault-500 transition-colors"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleCopy}
              className="text-[var(--text-muted)] hover:text-vault-500 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Notes */}
      {entry.notes && (
        <p className="mt-3 text-xs text-[var(--text-muted)] italic line-clamp-2 border-t border-[var(--border)] pt-2.5">
          {entry.notes}
        </p>
      )}
    </div>
  )
}
