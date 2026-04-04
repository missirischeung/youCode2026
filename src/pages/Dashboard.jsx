import { Container, Row, Col } from 'react-bootstrap'
import OpportunityCard from '../components/OpportunityCard'
import opportunities from '../data/opportunities'
import './Dashboard.css'

function Dashboard() {
  return (
    <div className="dashboard-page">
      <Container className="py-5">
        <h1 className="mb-2">Opportunities for You</h1>
        <p className="mb-4 dashboard-subtitle">
          Explore supportive ways to build skills, contribute, and grow confidence.
        </p>

        <Row className="g-4">
          {opportunities.map((opportunity) => (
            <Col key={opportunity.id} xs={12} md={6} xl={4}>
              <OpportunityCard {...opportunity} />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  )
}

export default Dashboard