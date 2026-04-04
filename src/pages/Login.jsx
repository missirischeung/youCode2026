import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap'
import './Login.css'

function Login() {
  return (
    <div className="login-page">
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col xs={12} md={8} lg={5}>
            <Card className="login-card">
              <Card.Body>
                <h2 className="text-center mb-4">Login</h2>

                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter password" />
                  </Form.Group>

                  <Button variant="dark" className="w-100">
                    Log In
                  </Button>
                </Form>

              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Login