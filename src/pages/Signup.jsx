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
            <Container className="signup-container">
                <Row className="justify-content-center align-items-center min-vh-100">
                    <Col xs={12} md={8} lg={5}>
                        <Card className="signup-card">
                            <Card.Body className="p-4 p-md-5">
                                <div className="signup-badge">New here?</div>

                                <h2 className="signup-title">Join us</h2>
                                <p className="signup-subtitle">
                                    Create your account and start building your profile.
                                </p>

                                {error && (
                                    <div className="alert alert-danger py-2 mt-3" role="alert">
                                        {error}
                                    </div>
                                )}

                                <Form onSubmit={handleSignup} className="mt-4">
                                    <Form.Group className="mb-3">
                                        <Form.Label className="signup-label">Email</Form.Label>
                                        <Form.Control
                                            className="signup-input"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="signup-label">Password</Form.Label>
                                        <Form.Control
                                            className="signup-input"
                                            type="password"
                                            value={email}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                    <Button
                                        className="signup-button w-100 mt-2"
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? 'Creating account…' : 'Create Account'}
                                    </Button>
                                </Form>

                                <div className="signup-footer mt-3">
                                    Already have an account?{' '}
                                    <Link to="/login" className="signup-link">
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