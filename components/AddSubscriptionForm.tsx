'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function AddSubscriptionForm({ onAdd }: { onAdd: () => void }) {
    const supabase = createClient()
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [cycle, setCycle] = useState('monthly')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const { error } = await supabase.from('subscriptions').insert([
            {
                name,
                price: parseFloat(price),
                billing_cycle: cycle,
            }
        ])

        if (!error) {
            setName('')
            setPrice('')
            onAdd()
        } else {
            alert("Error adding subscription. Check your connection.")
        }
        setIsSubmitting(false)
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Service Name</label>
                    <input
                        type="text"
                        placeholder="Netflix, Spotify..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        required
                    />
                </div>

                <div className="w-full md:w-32">
                    <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Price</label>
                    <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        required
                    />
                </div>

                <div className="w-full md:w-40">
                    <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Billing</label>
                    <select
                        value={cycle}
                        onChange={(e) => setCycle(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
                    >
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </div>

                <div className="flex items-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full md:w-auto px-6 py-2.5 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 disabled:bg-slate-400 transition-colors"
                    >
                        {isSubmitting ? 'Adding...' : 'Add'}
                    </button>
                </div>
            </div>
        </form>
    )
}