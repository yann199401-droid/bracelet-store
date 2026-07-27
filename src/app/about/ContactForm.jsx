'use client'

import { useState } from 'react'
import { useI18n } from '@/lib/I18nContext'

export default function AboutForm() {
  const { t } = useI18n()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const fields = [
    { key: 'name', label: t('about.formName'), type: 'text' },
    { key: 'email', label: t('about.formEmail'), type: 'email' },
    { key: 'subject', label: t('about.formSubject'), type: 'text' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((f) => (
        <div key={f.key}>
          <label className="block text-sm text-gray-600 mb-1">{f.label}</label>
          <input
            type={f.type}
            value={form[f.key]}
            onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
            required
            className="chinese-input"
          />
        </div>
      ))}
      <div>
        <label className="block text-sm text-gray-600 mb-1">{t('about.formMessage')}</label>
        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
          rows={4}
          className="chinese-input resize-none"
        />
      </div>
      <button type="submit" disabled={status === 'sending'} className="chinese-btn-primary w-full">
        {status === 'sending' ? t('about.formSending') : t('about.formSubmit')}
      </button>
      {status === 'success' && <p className="text-green-600 text-sm">{t('about.formSuccess')}</p>}
      {status === 'error' && <p className="text-red-600 text-sm">{t('about.formError')}</p>}
    </form>
  )
}
