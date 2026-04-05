import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { Form, Button } from 'react-bootstrap'
import { supabase } from '../supabaseClient'
import './Login.css'

// Placeholder logo icon — replace with your actual logo later
function LogoPlaceholder() {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="8" stroke="rgba(255,255,255,0.85)" strokeWidth="1.8" />
            <circle cx="10" cy="10" r="3" fill="rgba(255,255,255,0.85)" />
            <line x1="10" y1="2" x2="10" y2="6" stroke="rgba(255,255,255,0.7)" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="10" y1="14" x2="10" y2="18" stroke="rgba(255,255,255,0.7)" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="2" y1="10" x2="6" y2="10" stroke="rgba(255,255,255,0.7)" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="14" y1="10" x2="18" y2="10" stroke="rgba(255,255,255,0.7)" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    )
}

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const { error } = await supabase.auth.signInWithPassword({ email, password })

        setLoading(false)

        if (error) {
            setError(error.message)
        } else {
            navigate('/dashboard')
        }
    }

    return (
        <div className="login-page">
            <div className="login-card-outer">

                {/* ── Left: gradient panel ── */}
                <div className="login-left">

                    {/* Logo + wordmark */}
                    <div className="login-brand">
                        <div className="login-brand-logo">
                            <LogoPlaceholder />
                        </div>
                        <span className="login-brand-name">ForHer</span>
                    </div>

                    {/* Hero copy */}
                    <div className="login-left-body">
                        <h1 className="login-hero-headline">
                            Wellbeing that meets you <em>where you are.</em>
                        </h1>
                        <p className="login-hero-sub">
                            Foursight helps women in shelters build confidence, find community,
                            and take small steps toward a life that feels like their own.
                        </p>
                    </div>

                    {/* Quote */}
                    <div className="login-quote-card">
                        <p className="login-quote-text">
                            "There is no limit to what we, as women, can accomplish.."
                        </p>
                        <p className="login-quote-attr">-Michelle Obama</p>
                    </div>
                </div>

                {/* ── Right: form panel ── */}
                <div className="login-right">
                    <div className="login-form-wrap">
                        <p className="login-form-kicker">Welcome back</p>
                        <h2 className="login-form-title">Log in to your account</h2>
                        <p className="login-form-sub">Pick up right where you left off.</p>

                        {error && (
                            <div
                                className="alert py-2 mb-3"
                                role="alert"
                                style={{
                                    borderRadius: 12,
                                    border: 'none',
                                    background: '#fff1f4',
                                    color: '#b14d6d',
                                    fontSize: '0.88rem',
                                }}
                            >
                                {error}
                            </div>
                        )}

                        <Form onSubmit={handleLogin}>
                            <Form.Group className="mb-3">
                                <label className="login-label">Email</label>
                                <input
                                    type="email"
                                    className="login-input"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-1">
                                <label className="login-label">Password</label>
                                <input
                                    type="password"
                                    className="login-input"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <div className="login-links">
                                <a href="#" className="login-link">Forgot password?</a>
                            </div>

                            <Button className="login-button w-100" type="submit" disabled={loading}>
                                {loading ? 'Logging in…' : 'Log In'}
                            </Button>
                        </Form>

                        <p className="login-footer">
                            New here?{' '}
                            <Link to="/signup" className="login-link" style={{ fontWeight: 600 }}>
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Login