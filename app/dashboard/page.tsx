'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import AddSubscriptionForm from '@/components/AddSubscriptionForm'

export default function SubscriptionTracker() {
  const supabase = createClient()
  const [subs, setSubs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  async function fetchSubscriptions() {
    setLoading(true)
    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setSubs(data)
    setLoading(false)
  }

  async function deleteSubscription(id: string) {
    const { error } = await supabase.from('subscriptions').delete().eq('id', id)
    if (!error) setSubs(subs.filter(sub => sub.id !== id))
  }

  const monthlyVal = subs.reduce((acc, sub) => {
    const price = parseFloat(sub.price)
    return sub.billing_cycle === 'yearly' ? acc + (price / 12) : acc + price
  }, 0)

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 font-sans">
      {/* Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[0%] w-[30%] h-[30%] bg-blue-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-[1400px] mx-auto p-6 md:p-12">
        <header className="mb-16 flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <h1 className="text-5xl font-black tracking-tighter mb-2 bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">
              SubTracker
            </h1>
            <p className="text-slate-400 font-medium">Precision expense monitoring</p>
          </div>

          <div className="flex gap-6">
            <div className="glass p-6 rounded-[2rem] min-w-[220px]">
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold mb-1">Monthly</p>
              <p className="text-4xl font-light tracking-tighter text-glow">
                ${monthlyVal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] min-w-[220px] text-black shadow-[0_20px_50px_rgba(255,255,255,0.1)]">
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold mb-1 text-black/50">Annual</p>
              <p className="text-4xl font-black tracking-tighter">
                ${(monthlyVal * 12).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Side: Add Form */}
          <div className="lg:col-span-4">
            <div className="glass p-8 rounded-[2.5rem] sticky top-12">
              <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                New Subscription
              </h2>
              <AddSubscriptionForm onAdd={fetchSubscriptions} />
            </div>
          </div>

          {/* Right Side: List */}
          <div className="lg:col-span-8">
            <div className="space-y-4">
              {loading ? (
                <div className="text-slate-500 font-mono text-sm uppercase tracking-widest text-center py-20">Loading Data...</div>
              ) : (
                subs.map((sub) => (
                  <div
                    key={sub.id}
                    className="glass group flex items-center justify-between p-6 rounded-[2rem] hover:bg-white/[0.08] transition-all duration-500 border-white/5 hover:border-white/20"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 flex items-center justify-center text-2xl font-bold text-white shadow-inner">
                        {sub.name[0]}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold tracking-tight">{sub.name}</h3>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1 italic">{sub.category}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-10">
                      <div className="text-right">
                        <p className="text-2xl font-light tracking-tighter">${parseFloat(sub.price).toFixed(2)}</p>
                        <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">{sub.billing_cycle}</p>
                      </div>
                      <button
                        onClick={() => deleteSubscription(sub.id)}
                        className="opacity-0 group-hover:opacity-100 p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}