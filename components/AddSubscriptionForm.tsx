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
                category: 'Entertainment'
            }
        ])

        if (!error) {
            setName('')
            setPrice('')
            onAdd()
        } else {
            alert("Error adding subscription.")
        }
        setIsSubmitting(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Service Name</label>
                    <input
                        type="text"
                        placeholder="Netflix, Spotify..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full mt-1 p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-purple-500/50 focus:bg-white/10 outline-none transition-all text-white placeholder:text-slate-600"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Price</label>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full mt-1 p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-purple-500/50 focus:bg-white/10 outline-none transition-all text-white placeholder:text-slate-600"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Billing</label>
                        <select
                            value={cycle}
                            onChange={(e) => setCycle(e.target.value)}
                            className="w-full mt-1 p-4 bg-white/5 border border-white/10 rounded-2xl focus:border-purple-500/50 focus:bg-white/10 outline-none transition-all text-white appearance-none"
                        >
                            <option value="monthly" className="bg-[#050505]">Monthly</option>
                            <option value="yearly" className="bg-[#050505]">Yearly</option>
                        </select>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-purple-500 hover:text-white transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
            >
                {isSubmitting ? 'Processing...' : 'Add Subscription'}
            </button>
        </form>
    )
}