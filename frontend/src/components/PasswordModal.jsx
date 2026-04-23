import { useState, useEffect } from 'react'
import { X, RefreshCw, Eye, EyeOff, Shield } from 'lucide-react'
import { generatePassword, getPasswordStrength } from '../utils/passwordUtils'

const EMPTY_FORM = {
  websiteName: '',
  url: '',
  username: '',
  password: '',
  notes: '',
}

export default function PasswordModal({ isOpen, onClose, onSubmit, editEntry }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [showPassword, setShowPassword] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editEntry) {
      setForm({
        websiteName: editEntry.websiteName || '',
        url: editEntry.url || '',
        username: editEntry.username || '',
        password: editEntry.password || '',
        notes: editEntry.notes || '',
      })
    } else {
      setForm(EMPTY_FORM)
    }
    setErrors({})
    setShowPassword(false)
  }, [editEntry, isOpen])

  const strength = getPasswordStrength(form.password)

  const validate = () => {
    const e = {}
    if (!form.websiteName.trim()) e.websiteName = 'Website name is required'
    if (!form.username.trim()) e.username = 'Username/email is required'
    if (!form.password) e.password = 'Password is required'
    if (form.password && form.password.length < 4) e.password = 'Password too short'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      await onSubmit(form)
      onClose()
    } catch (err) {
      // error handled in hook
    } finally {
      setSaving(false)
    }
  }

  const handleGenerate = () => {
    setForm(f => ({ ...f, password: generatePassword() }))
    setShowPassword(true)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />

      {/* Modal */}
      <div className="relative w-full max-w-md card p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-vault-100 dark:bg-vault-950/50 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-vault-500" />
            </div>
            <h2 className="font-bold text-lg">
              {editEntry ? 'Edit Credential' : 'Add Credential'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Website Name */}
          <div>
            <label className="input-label">Website Name *</label>
            <input
              type="text"
              className={`input-field ${errors.websiteName ? 'border-red-400' : ''}`}
              placeholder="e.g. GitHub"
              value={form.websiteName}
              onChange={e => setForm(f => ({ ...f, websiteName: e.target.value }))}
              autoFocus
            />
            {errors.websiteName && <p className="text-red-500 text-xs mt-1">{errors.websiteName}</p>}
          </div>

          {/* URL */}
          <div>
            <label className="input-label">URL</label>
            <input
              type="text"
              className="input-field"
              placeholder="https://github.com"
              value={form.url}
              onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
            />
          </div>

          {/* Username */}
          <div>
            <label className="input-label">Username / Email *</label>
            <input
              type="text"
              className={`input-field ${errors.username ? 'border-red-400' : ''}`}
              placeholder="you@example.com"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              autoComplete="off"
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="input-label">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className={`input-field pr-20 ${errors.password ? 'border-red-400' : ''}`}
                placeholder="Enter password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                autoComplete="new-password"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="p-1.5 text-[var(--text-muted)] hover:text-vault-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="p-1.5 text-[var(--text-muted)] hover:text-vault-500 transition-colors"
                  title="Generate strong password"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}

            {/* Strength indicator */}
            {form.password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[0, 1, 2, 3].map(i => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                        i < strength.score ? strength.color : 'bg-[var(--border)]'
                      }`}
                    />
                  ))}
                </div>
                <p className={`text-xs font-medium ${
                  strength.score <= 1 ? 'text-red-500' :
                  strength.score === 2 ? 'text-yellow-500' :
                  strength.score === 3 ? 'text-blue-500' : 'text-green-500'
                }`}>
                  {strength.label}
                </p>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="input-label">Notes</label>
            <textarea
              className="input-field resize-none"
              rows={3}
              placeholder="Optional notes…"
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
              {saving ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : editEntry ? 'Save Changes' : 'Add Credential'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
