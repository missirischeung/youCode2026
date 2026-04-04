import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap'
import './Login.css'

function Login() {
  return (
    <div className="login-page">
      <Container className="login-container">
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col xs={12} md={10} lg={6} xl={5}>
            <Card className="login-card shadow-sm">
              <Card.Body className="p-4 p-md-5">
                <div className="login-badge">Foursight</div>

                <h1 className="login-title">
                  Welcome back
                </h1>

                <p className="login-subtitle">
                  A space to explore strengths, build confidence, and grow through meaningful opportunities.
                </p>

                <Form className="mt-4">
                  <Form.Group className="mb-3" controlId="loginEmail">
                    <Form.Label className="login-label">Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      className="login-input"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="loginPassword">
                    <Form.Label className="login-label">Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      className="login-input"
                    />
                  </Form.Group>

                  <div className="login-links mb-4">
                    <a href="#" className="login-link">Forgot password?</a>
                  </div>

                  <Button className="login-button w-100" type="submit">
                    Log In
                  </Button>
                </Form>

                <div className="login-footer mt-4">
                  <span>New here?</span>{' '}
                  <a href="#" className="login-link">Create an account</a>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Login