import { useEffect, useState } from 'react'
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router'

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
    const navigate = useNavigate()

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session ?? null)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    useEffect(() => {
        const fetchProfile = async () => {
            if (!session.user) return

            const {data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

            if(!error) {
                setProfile(data)
            }
        }
        fetchProfile()
    }, [session])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/login')
    }

    return (
        <>
            <AppNavbar session={session} profile={profile}/>

            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute session={session}>
                            <Dashboard />
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
