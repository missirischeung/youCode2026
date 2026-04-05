import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { Form, Button, Modal } from 'react-bootstrap'
import { supabase } from '../supabaseClient'
import './Signup.css'

// Placeholder logo — replace with actual logo later
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

const STEPS = [
    {
        title: 'Create your account',
        desc: 'Just an email and password to get started.',
    },
    {
        title: 'Build your profile',
        desc: 'Tell us about yourself — at your own pace.',
    },
    {
        title: 'Explore opportunities',
        desc: 'Find supportive ways to grow and connect.',
    },
]

function Signup() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSignup = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email)
            .maybeSingle()

        if (existingProfile) {
            setShowModal(true)
            setLoading(false)
            return
        }

        const { error: signUpError } = await supabase.auth.signUp({ email, password })

        setLoading(false)

        if (signUpError) {
            setError(signUpError.message)
        } else {
            navigate('/profile')
        }
    }

    return (
        <div className="signup-page">
            <div className="signup-card-outer">

                {/* ── Left: gradient panel ── */}
                <div className="signup-left">

                    {/* Logo + wordmark */}
                    <div className="signup-brand">
                        <div className="signup-brand-logo">
                            <LogoPlaceholder />
                        </div>
                        <span className="signup-brand-name">ForHer</span>
                    </div>

                    {/* Hero copy */}
                    <div className="signup-left-body">
                        <h1 className="signup-hero-headline">
                            Your journey starts with <em>one step.</em>
                        </h1>
                        <p className="signup-hero-sub">
                            Signing up takes less than a minute. Everything else moves
                            at whatever pace feels right for you.
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="signup-steps">
                        {STEPS.map((s, i) => (
                            <div className="signup-step" key={s.title}>
                                <div className="signup-step-num">{i + 1}</div>
                                <div className="signup-step-text">
                                    <strong>{s.title}</strong>
                                    <span>{s.desc}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Right: form panel ── */}
                <div className="signup-right">
                    <div className="signup-form-wrap">
                        <p className="signup-form-kicker">Get started</p>
                        <h2 className="signup-form-title">Create your account</h2>
                        <p className="signup-form-sub">Free to join. No commitment needed.</p>

                        {error && (
                            <div className="alert alert-danger py-2 mb-3" role="alert">
                                {error}
                            </div>
                        )}

                        <Form onSubmit={handleSignup}>
                            <Form.Group className="mb-3">
                                <label className="signup-label">Email</label>
                                <input
                                    type="email"
                                    className="signup-input form-control"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <label className="signup-label">Password</label>
                                <input
                                    type="password"
                                    className="signup-input form-control"
                                    placeholder="Choose a password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Button
                                className="signup-button w-100"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Checking…' : 'Create Account'}
                            </Button>
                        </Form>

                        <p className="signup-footer">
                            Already have an account?{' '}
                            <Link to="/login" className="signup-link">Log in</Link>
                        </p>
                    </div>
                </div>

            </div>

            {/* Duplicate email modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton style={{ borderBottom: 'none', paddingBottom: 0 }}>
                    <Modal.Title style={{ color: '#334155', fontWeight: 700 }}>
                        Account Already Exists
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ color: '#64748b', paddingTop: '0.5rem' }}>
                    An account is already linked to <strong>{email}</strong>. Please log in instead.
                </Modal.Body>
                <Modal.Footer style={{ borderTop: 'none' }}>
                    <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
                        Go Back
                    </Button>
                    <Button
                        style={{
                            background: 'linear-gradient(135deg, #8fb7d9, #c97f97)',
                            border: 'none',
                            borderRadius: 10,
                            fontWeight: 700,
                        }}
                        onClick={() => navigate('/login')}
                    >
                        Go to Login
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Signup