import { Card } from 'react-bootstrap'
import {
  GeoAlt,
  Clock,
  CashCoin,
  People,
  PersonCheck,
  Heart,
} from 'react-bootstrap-icons'
import './PreviewCard.css'

const EFFORT_CONFIG = {
  1: { label: 'Easy start', className: 'preview-card--1' },
  2: { label: 'Small stretch', className: 'preview-card--2' },
  3: { label: 'Ready for more', className: 'preview-card--3' },
}

function IconBubble({ show, icon, label }) {
  if (!show) return null

  return (
    <span className="preview-icon-bubble" title={label} aria-label={label}>
      {icon}
    </span>
  )
}

function PreviewCard({
  title,
  organization,
  location,
  effortLevel = 1,
  schedule,
  timeCommitment,
  cost = 'Free',
  tags = [],
  beginnerFriendly = false,
  whyItHelps,
  description,
  onClick,
}) {
  const effort = EFFORT_CONFIG[effortLevel] ?? EFFORT_CONFIG[1]
  const lowerTags = tags.map((tag) => tag.toLowerCase())

  const kidsWelcome = lowerTags.some((tag) => tag.includes('kids'))
  const okAlone =
    lowerTags.some((tag) => tag.includes('alone')) ||
    lowerTags.some((tag) => tag.includes('solo'))
  const quiet =
    lowerTags.some((tag) => tag.includes('quiet')) ||
    lowerTags.some((tag) => tag.includes('small group'))
  const free = cost.toLowerCase().includes('free')
  const beginner = beginnerFriendly

  const shortLine =
    whyItHelps ||
    description ||
    'A supportive way to get involved.'

  return (
    <Card
      className={`preview-card ${effort.className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
    >
      <div className="preview-card-accent" />

      <Card.Body className="preview-card-body">
        <div className="preview-card-top">
          <div className="preview-card-title-block">
            <p className="preview-card-org">{organization}</p>
            <h3 className="preview-card-title">{title}</h3>
          </div>

          <span className="preview-card-effort">
            {effort.label}
          </span>
        </div>

        <p className="preview-card-line">
          {shortLine}
        </p>

        <div className="preview-card-meta">
          {(timeCommitment || schedule) && (
            <span className="preview-meta-pill">
              <Clock size={14} />
              <span>{timeCommitment || schedule}</span>
            </span>
          )}

          {location && (
            <span className="preview-meta-pill">
              <GeoAlt size={14} />
              <span>{location}</span>
            </span>
          )}

          {free && (
            <span className="preview-meta-pill">
              <CashCoin size={14} />
              <span>Free</span>
            </span>
          )}
        </div>

        <div className="preview-card-icons">
          <IconBubble
            show={kidsWelcome}
            icon={<People size={15} />}
            label="Kids welcome"
          />
          <IconBubble
            show={okAlone}
            icon={<PersonCheck size={15} />}
            label="Okay to come alone"
          />
          <IconBubble
            show={quiet}
            icon={<Heart size={15} />}
            label="Quiet or small group"
          />
          <IconBubble
            show={beginner}
            icon={<Clock size={15} />}
            label="Beginner friendly"
          />
        </div>
      </Card.Body>
    </Card>
  )
}

export default PreviewCard