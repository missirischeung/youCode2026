import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap'
import { supabase } from '../supabaseClient'
import './Signup.css'

function Signup() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSignup = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        // Check if a profile already exists with this email
        const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email)
            .maybeSingle()

        if (existingProfile) {
            setError('An account with this email already exists. Please log in instead.')
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
            <Container>
                <Row className="justify-content-center align-items-center min-vh-100">
                    <Col xs={12} md={8} lg={5}>
                        <Card className="signup-card">
                            <Card.Body className="p-4">
                                <h2 className="text-center mb-4">Sign Up</h2>

                                {error && (
                                    <div className="alert alert-danger py-2" role="alert">
                                        {error}{' '}
                                        {error.includes('log in') && (
                                            <Link to="/login" style={{ color: '#842029', fontWeight: 600 }}>
                                                Go to login →
                                            </Link>
                                        )}
                                    </div>
                                )}

                                <Form onSubmit={handleSignup}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                    <Button variant="dark" className="w-100" type="submit" disabled={loading}>
                                        {loading ? 'Checking…' : 'Create Account'}
                                    </Button>
                                </Form>

                                <div className="text-center mt-3" style={{ fontSize: '0.95rem', color: '#64748b' }}>
                                    Already have an account?{' '}
                                    <Link to="/login" style={{ color: '#8a6fb0', textDecoration: 'none', fontWeight: 500 }}>
                                        Log in
                                    </Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Signup
