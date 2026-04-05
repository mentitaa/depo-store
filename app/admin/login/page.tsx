'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Credenciales incorrectas. Verifica tu correo y contraseña.')
      setLoading(false)
      return
    }

    router.replace('/admin')
  }

  return (
    <div className="min-h-dvh bg-[#FFF8FA] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-[#F0D4DC] shadow-sm p-8 w-full max-w-sm flex flex-col gap-7">

        {/* Logo */}
        <div className="text-center">
          <h1
            style={{ fontFamily: 'ui-monospace, "Cascadia Code", "Fira Code", monospace', fontWeight: 700, fontSize: 15, color: '#180A10', margin: 0 }}
          >
            Anora✨
          </h1>
          <p className="text-xs text-[#180A10]/40 mt-2 uppercase tracking-widest">
            Panel de administración
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[#180A10]/50 font-medium" htmlFor="email">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@midepo.pe"
              className="px-4 py-2.5 rounded-xl border border-[#F0D4DC] text-sm text-[#180A10] bg-[#FFF8FA] focus:outline-none focus:border-[#C85880] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[#180A10]/50 font-medium" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="px-4 py-2.5 rounded-xl border border-[#F0D4DC] text-sm text-[#180A10] bg-[#FFF8FA] focus:outline-none focus:border-[#C85880] transition-colors"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2 border border-red-100">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full py-3 rounded-full bg-[#C85880] text-white font-semibold text-sm hover:bg-[#a8446a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}
