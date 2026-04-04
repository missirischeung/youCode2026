import { Container, Row, Col, Card } from 'react-bootstrap'
import './Dashboard.css'

function Dashboard() {
  return (
    <div className="dashboard-page">
      <Container className="py-5">
        <h1 className="mb-4">Dashboard</h1>

        <Row className="g-4">
          <Col md={6} lg={4}>
            <Card className="dashboard-card">
              <Card.Body>
                <h5>Card 1</h5>
                <p>Some content here</p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={4}>
            <Card className="dashboard-card">
              <Card.Body>
                <h5>Card 2</h5>
                <p>More content</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

      </Container>
    </div>
  )
}

export default Dashboard