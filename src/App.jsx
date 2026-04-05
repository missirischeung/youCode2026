import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'

import { supabase } from './supabaseClient'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import AppNavbar from './components/AppNavBar'

function ProtectedRoute({ session, children }) {
    if (session === undefined) return null
    if (!session) return <Navigate to="/login" replace />
    return children
}

function App() {
    const [session, setSession] = useState(undefined)
    const [profile, setProfile] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [committedIds, setCommittedIds] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session ?? null)
        })

        const { data: { subscription } } =
            supabase.auth.onAuthStateChange((_event, session) => {
                setSession(session ?? null)
            })

        return () => subscription.unsubscribe()
    }, [])

    useEffect(() => {
        const fetchProfile = async () => {
            if (!session || !session.user) return

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single()

            if (!error) setProfile(data)
        }

        fetchProfile()
    }, [session])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/login')
    }

    const handleCommit = (opportunity) => {
        if (!opportunity?.id) return
        if (!committedIds.includes(opportunity.id)) {
            setCommittedIds(prev => [...prev, opportunity.id])
        }
    }

    return (
        <>
            <AppNavbar
                session={session}
                profile={profile}
                handleLogout={handleLogout}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute session={session}>
                            <Dashboard
                                searchQuery={searchQuery}
                                onCommit={handleCommit}
                                committedIds={committedIds}
                            />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute session={session}>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </>
    )
}

export default App
