import { Container } from 'react-bootstrap'
import OpportunityCard from '../components/OpportunityCard'
import opportunities from '../data/opportunities'
import './Dashboard.css'

function Dashboard({ onCommit, committedIds = [] }) {
  return (
    <div className="dashboard-page">
      <Container className="py-5">
        <h1 className="dashboard-title">Opportunities for You</h1>

        <p className="dashboard-subtitle">
          Explore supportive ways to build skills, contribute, and grow confidence.
        </p>

        {/* 🔥 THIS is what makes them rows */}
        <div className="opportunity-list">
          {opportunities.map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              {...opportunity}
              onCommit={onCommit}
              isCommitted={committedIds.includes(opportunity.id)}
            />
          ))}
        </div>
      </Container>
    </div>
  )
}

export default Dashboard