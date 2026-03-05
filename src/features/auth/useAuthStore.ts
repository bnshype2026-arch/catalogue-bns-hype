import type { User, Session } from '@supabase/supabase-js'
import { create } from 'zustand'
import { supabase } from '../../lib/supabase'

interface AuthState {
    user: User | null
    session: Session | null
    isLoading: boolean
    setUser: (user: User | null) => void
    setSession: (session: Session | null) => void
    initialize: () => Promise<void>
    signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    session: null,
    isLoading: true,
    setUser: (user) => set({ user }),
    setSession: (session) => set({ session }),
    initialize: async () => {
        try {
            const { data: { session }, error } = await supabase.auth.getSession()
            if (error) throw error

            set({ session, user: session?.user ?? null, isLoading: false })

            supabase.auth.onAuthStateChange((_event, session) => {
                set({ session, user: session?.user ?? null })
            })
        } catch (error) {
            console.error("Error fetching session:", error)
            set({ isLoading: false })
        }
    },
    signOut: async () => {
        await supabase.auth.signOut()
        set({ user: null, session: null })
    }
}))
