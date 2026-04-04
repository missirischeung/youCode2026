import { Card, Badge, Button } from 'react-bootstrap'
import './OpportunityCard.css'

function OpportunityCard({
  title,
  organization,
  description,
  location,
  effortLevel,
  skills = [],
  schedule,
  beginnerFriendly = false,
}) {
  return (
    <Card className="opportunity-card h-100">
      <Card.Body className="d-flex flex-column">
        <div className="opportunity-top mb-3">
          <div>
            <p className="opportunity-org mb-1">{organization}</p>
            <h3 className="opportunity-title mb-0">{title}</h3>
          </div>

          {beginnerFriendly && (
            <span className="opportunity-pill">Beginner Friendly</span>
          )}
        </div>

        <p className="opportunity-description">
          {description}
        </p>

        <div className="opportunity-details">
          <div className="opportunity-detail-row">
            <span className="detail-label">Location</span>
            <span className="detail-value">{location}</span>
          </div>

          <div className="opportunity-detail-row">
            <span className="detail-label">Effort</span>
            <span className="detail-value">{effortLevel}</span>
          </div>

          <div className="opportunity-detail-row">
            <span className="detail-label">Schedule</span>
            <span className="detail-value">{schedule}</span>
          </div>
        </div>

        <div className="skills-section mt-3">
          <p className="skills-heading mb-2">Skills you can build</p>
          <div className="skills-list">
            {skills.map((skill, index) => (
              <Badge key={index} className="skill-badge">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-4">
          <Button className="opportunity-button w-100">
            View Opportunity
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}

export default OpportunityCard