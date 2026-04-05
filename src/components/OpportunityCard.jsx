import { Card, Badge, Button } from "react-bootstrap";
import {
    GeoAlt,
    Clock,
    CashCoin,
    People,
    PersonCheck,
    BusFront,
    Heart,
    Star,
} from "react-bootstrap-icons";
import { getTimeCommitment } from "../utils/time";
import "./OpportunityCard.css";

const EFFORT_CONFIG = {
    1: { label: "Easy start", className: "effort-level--1" },
    2: { label: "Small stretch", className: "effort-level--2" },
    3: { label: "Ready for more", className: "effort-level--3" },
};

function InfoChip({ icon, text }) {
    if (!text) return null;

    return (
        <span className="opportunity-chip">
            <span className="opportunity-chip-icon">{icon}</span>
            <span>{text}</span>
        </span>
    );
}

function OpportunityCard({
    id,
    title,
    organization,
    description,
    location,
    effortLevel = 1,
    skills = [],
    schedule,
    timeRange,
    timeCommitment,
    beginnerFriendly = false,
    impact,
    whyItHelps,
    cost = "Free",
    transitSupport,
    barrierSupport = [],
    tags = [],
    builds = [],
    nextStepLabel = "I'm in",
    onCommit,
    isCommitted = false,
}) {
    const effort = EFFORT_CONFIG[effortLevel] ?? EFFORT_CONFIG[1];
    const duration = timeCommitment || getTimeCommitment(timeRange);

    const supportTags = [
        ...(beginnerFriendly ? ["Beginner friendly"] : []),
        ...tags,
    ];

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
                                    <span className="impact-label">
                                        Impact:
                                    </span>{" "}
                                    {impact}
                                </p>
                            )}
                            {whyItHelps && (
                                <p className="opportunity-impact-line">
                                    <span className="impact-label">
                                        Why this helps:
                                    </span>{" "}
                                    {whyItHelps}
                                </p>
                            )}
                        </div>
                    )}

                    <div className="opportunity-chip-row">
                        <InfoChip
                            icon={<BusFront size={14} />}
                            text={transitSupport}
                        />
                        <InfoChip icon={<CashCoin size={14} />} text={cost} />
                    </div>

                    {supportTags.length > 0 && (
                        <div className="opportunity-chip-row opportunity-chip-row--soft">
                            {supportTags.map((tag, index) => {
                                const lower = tag.toLowerCase();
                                let icon = <Star size={14} />;

                                if (lower.includes("kids"))
                                    icon = <People size={14} />;
                                else if (
                                    lower.includes("solo") ||
                                    lower.includes("alone")
                                )
                                    icon = <PersonCheck size={14} />;
                                else if (lower.includes("free"))
                                    icon = <CashCoin size={14} />;
                                else if (lower.includes("location"))
                                    icon = <GeoAlt size={14} />;
                                else if (
                                    lower.includes("quiet") ||
                                    lower.includes("small group")
                                )
                                    icon = <Heart size={14} />;
                                else if (lower.includes("beginner"))
                                    icon = <Star size={14} />;

                                return (
                                    <span
                                        key={index}
                                        className="opportunity-chip opportunity-chip--soft"
                                    >
                                        <span className="opportunity-chip-icon">
                                            {icon}
                                        </span>
                                        <span>{tag}</span>
                                    </span>
                                );
                            })}
                        </div>
                    )}

                    {barrierSupport.length > 0 && (
                        <div className="opportunity-support-note">
                            {barrierSupport.join(" • ")}
                        </div>
                    )}

                    {builds.length > 0 && (
                        <div className="opportunity-builds">
                            <span className="builds-label">Builds:</span>{" "}
                            {builds.join(" • ")}
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

                        {schedule && (
                            <div className="opportunity-side-row">
                                <span className="detail-label">When</span>
                                <span className="detail-value">{schedule}</span>
                            </div>
                        )}

                        {timeRange && (
                            <div className="opportunity-side-row">
                                <span className="detail-label">Time</span>
                                <span className="detail-value">
                                    {timeRange}
                                </span>
                            </div>
                        )}

                        {duration && (
                            <div className="opportunity-side-row">
                                <span className="detail-label">
                                    Time commitment
                                </span>
                                <span className="detail-value">{duration}</span>
                            </div>
                        )}

                        <div className="opportunity-side-row">
                            <span className="detail-label">Effort</span>
                            <span className="detail-value">{effort.label}</span>
                        </div>
                    </div>

                    <Button
                        className="opportunity-button"
                        onClick={() =>
                            onCommit?.({
                                id,
                                title,
                                organization,
                                location,
                            })
                        }
                    >
                        {isCommitted ? "Committed" : nextStepLabel}
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
}

export default OpportunityCard;
