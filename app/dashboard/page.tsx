'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import AddSubscriptionForm from '@/components/AddSubscriptionForm'

export default function SubscriptionTracker() {
  const supabase = createClient()
  const [subs, setSubs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // 1. Fetch data on load
  useEffect(() => {
    fetchSubscriptions()
  }, [])

  async function fetchSubscriptions() {
    setLoading(true)
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setSubs(data)
    if (error) console.error('Error fetching:', error)
    setLoading(false)
  }

  // 2. Delete logic
  async function deleteSubscription(id: string) {
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', id)

    if (!error) {
      // Optimistic update: remove from UI immediately
      setSubs(subs.filter(sub => sub.id !== id))
    } else {
      alert("Error deleting subscription")
    }
  }

  // 3. Calculation logic
  const calculateMonthlyTotal = () => {
    const total = subs.reduce((acc, sub) => {
      const price = parseFloat(sub.price)
      return sub.billing_cycle === 'yearly' ? acc + (price / 12) : acc + price
    }, 0)
    return total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen bg-slate-50">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">SubTracker</h1>
          <p className="text-slate-500">Manage your recurring expenses</p>
        </div>
        <div className="bg-blue-600 text-white p-5 rounded-2xl shadow-xl">
          <p className="text-xs uppercase opacity-80 font-bold tracking-wider">Total Monthly Spend</p>
          <p className="text-3xl font-mono">${calculateMonthlyTotal()}</p>
        </div>
      </header>

      {/* Adding the Form Component */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Add New Service</h2>
        <AddSubscriptionForm onAdd={fetchSubscriptions} />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Your Subscriptions</h2>
        <div className="grid gap-3">
          {loading ? (
            <p className="text-slate-500 italic">Loading your subscriptions...</p>
          ) : subs.length === 0 ? (
            <div className="text-center p-10 border-2 border-dashed rounded-xl text-slate-400">
              No subscriptions found. Add your first one above!
            </div>
          ) : (
            subs.map((sub) => (
              <div
                key={sub.id}
                className="group flex justify-between items-center p-4 bg-white border rounded-xl hover:shadow-md transition-all border-slate-200"
              >
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800">{sub.name}</span>
                  <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full w-fit mt-1">
                    {sub.category || 'General'}
                  </span>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-bold text-slate-900">${parseFloat(sub.price).toFixed(2)}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">
                      {sub.billing_cycle}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteSubscription(sub.id)}
                    className="bg-red-50 text-red-500 p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all duration-200"
                    title="Delete subscription"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}