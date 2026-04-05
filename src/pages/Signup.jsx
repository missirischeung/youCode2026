import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { Container, Row, Col, Form, Button, Card, Modal } from 'react-bootstrap'
import { supabase } from '../supabaseClient'
import './Signup.css'

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

        // Check profiles table for existing email before attempting signup
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
            <Container>
                <Row className="justify-content-center align-items-center min-vh-100">
                    <Col xs={12} md={8} lg={5}>
                        <Card className="signup-card">
                            <Card.Body className="p-4">
                                <h2 className="text-center mb-4">Sign Up</h2>

                                {error && (
                                    <div className="alert alert-danger py-2" role="alert">
                                        {error}
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

            {/* Duplicate email modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton style={{ borderBottom: 'none', paddingBottom: 0 }}>
                    <Modal.Title style={{ color: '#334155', fontWeight: 700 }}>Account Already Exists</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ color: '#64748b', paddingTop: '0.5rem' }}>
                    An account is already linked to <strong>{email}</strong>. Please log in instead.
                </Modal.Body>
                <Modal.Footer style={{ borderTop: 'none' }}>
                    <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
                        Go Back
                    </Button>
                    <Button
                        variant="dark"
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
