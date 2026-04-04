import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap'
import './Signup.css'

function Signup() {
  return (
    <div className="signup-page">
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col xs={12} md={8} lg={5}>
            <Card className="signup-card">
              <Card.Body>
                <h2 className="text-center mb-4">Sign Up</h2>

                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" />
                  </Form.Group>

                  <Button variant="dark" className="w-100">
                    Create Account
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

export default Signup