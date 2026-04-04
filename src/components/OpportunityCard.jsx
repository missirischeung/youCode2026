import { Card, Badge, Button } from 'react-bootstrap'
import {
  GeoAlt,
  Clock,
  CashCoin,
  People,
  PersonCheck,
  BusFront,
  Heart,
} from 'react-bootstrap-icons'
import './OpportunityCard.css'

const EFFORT_CONFIG = {
  1: { label: 'Easy start', className: 'effort-level--1' },
  2: { label: 'Small stretch', className: 'effort-level--2' },
  3: { label: 'Ready for more', className: 'effort-level--3' },
}

function InfoChip({ icon, text }) {
  if (!text) return null

  return (
    <span className="opportunity-chip">
      <span className="opportunity-chip-icon">{icon}</span>
      <span>{text}</span>
    </span>
  )
}

function OpportunityCard({
  title,
  organization,
  description,
  location,
  effortLevel = 1,
  skills = [],
  schedule,
  beginnerFriendly = false,
  impact,
  whyItHelps,
  timeCommitment,
  cost = 'Free',
  transitSupport,
  barrierSupport = [],
  tags = [],
  builds = [],
  nextStepLabel = "I'm in",
}) {
  const effort = EFFORT_CONFIG[effortLevel] ?? EFFORT_CONFIG[1]

  const supportTags = [...(beginnerFriendly ? ['Beginner friendly'] : []), ...tags]

  return (
    <Card className={`opportunity-card ${effort.className}`}>
      <div className="opportunity-accent-bar" />

      <Card.Body className="opportunity-body">
        <div className="opportunity-main">
          <div className="opportunity-top">
            <div className="opportunity-title-block">
              <p className="opportunity-org">{organization}</p>
              <h3 className="opportunity-title">{title}</h3>
            </div>

            <div className="opportunity-badges">
              <span className="opportunity-badge opportunity-badge--effort">
                {effort.label}
              </span>
            </div>
          </div>

          <p className="opportunity-description">{description}</p>

          {(impact || whyItHelps) && (
            <div className="opportunity-impact-box">
              {impact && (
                <p className="opportunity-impact-line">
                  <span className="impact-label">Impact:</span> {impact}
                </p>
              )}
              {whyItHelps && (
                <p className="opportunity-impact-line">
                  <span className="impact-label">Why this helps:</span> {whyItHelps}
                </p>
              )}
            </div>
          )}

          <div className="opportunity-chip-row">
            <InfoChip icon={<BusFront size={14} />} text={transitSupport || location} />
            <InfoChip icon={<Clock size={14} />} text={timeCommitment || schedule} />
            <InfoChip icon={<CashCoin size={14} />} text={cost} />
          </div>

          {supportTags.length > 0 && (
            <div className="opportunity-chip-row opportunity-chip-row--soft">
              {supportTags.map((tag, index) => {
                let icon = <PersonCheck size={14} />

                if (tag.toLowerCase().includes('kids')) icon = <People size={14} />
                if (tag.toLowerCase().includes('solo')) icon = <PersonCheck size={14} />
                if (tag.toLowerCase().includes('free')) icon = <CashCoin size={14} />
                if (tag.toLowerCase().includes('location')) icon = <GeoAlt size={14} />
                if (tag.toLowerCase().includes('quiet')) icon = <Heart size={14} />

                return (
                  <span key={index} className="opportunity-chip opportunity-chip--soft">
                    <span className="opportunity-chip-icon">{icon}</span>
                    <span>{tag}</span>
                  </span>
                )
              })}
            </div>
          )}

          {barrierSupport.length > 0 && (
            <div className="opportunity-support-note">
              {barrierSupport.join(' • ')}
            </div>
          )}

          {builds.length > 0 && (
            <div className="opportunity-builds">
              <span className="builds-label">Builds:</span>{' '}
              {builds.join(' • ')}
            </div>
          )}

          {skills.length > 0 && (
            <div className="skills-section">
              <div className="skills-list">
                {skills.map((skill, index) => (
                  <Badge key={index} className="skill-badge">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="opportunity-side">
          <div className="opportunity-side-card">
            <div className="opportunity-side-row">
              <span className="detail-label">Where</span>
              <span className="detail-value">{location}</span>
            </div>

            <div className="opportunity-side-row">
              <span className="detail-label">When</span>
              <span className="detail-value">{schedule}</span>
            </div>

            <div className="opportunity-side-row">
              <span className="detail-label">Effort</span>
              <span className="detail-value">{effort.label}</span>
            </div>
          </div>

          <Button className="opportunity-button">
            {nextStepLabel}
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}

export default OpportunityCard