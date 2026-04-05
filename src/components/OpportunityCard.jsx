import { useState } from "react";
import {
    GeoAlt,
    Clock,
    CashCoin,
    BusFront,
    CalendarEvent,
} from "react-bootstrap-icons";
import { getTimeCommitment } from "../utils/time";
import "./OpportunityCard.css";

const TABS = [
    { id: "overview", label: "What you'll do" },
    { id: "logistics", label: "What to expect" },
    { id: "barriers", label: "Before you go" },
    { id: "skills", label: "What you'll gain" },
];

function InfoCell({ label, value, icon }) {
    if (!value) return null;
    return (
        <div className="oc-info-cell">
            {icon && <span className="oc-info-cell-icon">{icon}</span>}
            <div>
                <span className="oc-info-label">{label}</span>
                <span className="oc-info-value">{value}</span>
            </div>
        </div>
    );
}

function GoodItem({ show, label, variant = "green" }) {
    if (!show) return null;
    return (
        <div className={`oc-good-item oc-good-item--${variant}`}>
            <div className={`oc-good-dot oc-good-dot--${variant}`}>
                {variant === "green" ? "✓" : "✦"}
            </div>
            <span>{label}</span>
        </div>
    );
}

function OpportunityCard({
    id,
    title,
    organization,
    description,
    location,
    schedule,
    timeRange,
    timeCommitment,
    cost = "Free",
    transitSupport,
    beginnerFriendly = false,
    impact,
    whyItHelps,
    barrierSupport = [],
    tags = [],
    builds = [],
    skills = [],
    nextStepLabel = "Count me in!",
    onCommit,
    isCommitted = false,
    isCompleted = false,
    meetingPoint,
    arrivalNotes,
    accessibilityNotes,
    activities = [],
    website,
    contactName,
    contactEmail,
    onClose,
    image,
}) {
    const [activeTab, setActiveTab] = useState("overview");

    const duration = timeCommitment || getTimeCommitment(timeRange);

    const lowerTags = tags.map((t) => t.toLowerCase());
    const hasKids = lowerTags.some((t) => t.includes("kid-friendly"));
    const hasSolo = lowerTags.some(
        (t) => t.includes("alone") || t.includes("solo")
    );
    const hasQuiet = lowerTags.some(
        (t) => t.includes("quiet") || t.includes("small group")
    );
    const hasDropIn = barrierSupport.some((b) =>
        b.toLowerCase().includes("drop")
    );
    const hasBring = barrierSupport.find((b) =>
        b.toLowerCase().includes("bring")
    );

    const displaySkills =
        builds.length > 0 ? builds : skills.filter((s) => !builds.includes(s));

    const mapsUrl = location
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              location
          )}`
        : null;

    const hasLogistics =
        transitSupport ||
        meetingPoint ||
        arrivalNotes ||
        accessibilityNotes ||
        mapsUrl;

    return (
        <div className="oc-card">
            <div className="oc-accent-bar" />

            {/* ── Header: always visible ── */}
            <div
                className="oc-header"
                style={{
                    backgroundImage: image ? `url(${image})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                }}
            >
                {/* Overlay for readability when image is present */}
                {image && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            backgroundColor: "rgba(255, 255, 255, 0.45)",
                            zIndex: 1,
                        }}
                    />
                )}

                <div style={{ position: "relative", zIndex: 2 }}>
                    <div className="oc-header-top">
                        <button
                            className="oc-close-btn"
                            onClick={onClose}
                            aria-label="Close"
                        >
                            ✕
                        </button>
                        {duration && (
                            <span className="oc-time-badge">
                                <Clock size={12} /> Time Commitment: {duration}
                            </span>
                        )}
                    </div>
                    <div className="oc-title-group">
                        <p className="oc-org">{organization}</p>
                        <h3 className="oc-title">{title}</h3>
                        {location && mapsUrl && (
                            <a
                                href={mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="oc-location-link"
                            >
                                <GeoAlt size={13} />
                                <span>{location}</span>
                            </a>
                        )}
                        <div className="oc-quick-tags">
                            {schedule && (
                                <span className="oc-quick-tag">
                                    <CalendarEvent size={13} />
                                    <span>{schedule}</span>
                                </span>
                            )}
                            {timeRange && (
                                <span className="oc-quick-tag">
                                    <Clock size={13} />
                                    <span>{timeRange}</span>
                                </span>
                            )}
                            {cost && (
                                <span className="oc-quick-tag">
                                    <CashCoin size={13} />
                                    <span>{cost}</span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Binder tabs — sit inside the card, above the panel border ── */}
            <div className="oc-binder-nav">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        className={`oc-binder-tab ${
                            activeTab === tab.id ? "active" : ""
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ── Panel: key prop triggers fade-slide animation on tab change ── */}
            <div key={activeTab} className="oc-panel">
                {/* OVERVIEW */}
                {activeTab === "overview" && (
                    <div className="oc-section">
                        <div className="oc-overview-block">
                            <p className="oc-section-label">
                                What you'll get to try
                            </p>
                            {activities.length > 0 ? (
                                <ul className="oc-activity-list">
                                    {activities.map((item, i) => (
                                        <li
                                            key={i}
                                            className="oc-activity-item"
                                        >
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="oc-body-text">{description}</p>
                            )}
                        </div>

                        {whyItHelps && (
                            <div className="oc-why-box">{whyItHelps}</div>
                        )}

                        {impact && (
                            <p className="oc-impact-line">
                                <span className="oc-impact-label">
                                    Impact:{" "}
                                </span>
                                {impact}
                            </p>
                        )}

                        {(website || contactName || contactEmail) && (
                            <details className="oc-contact-dropdown">
                                <summary className="oc-contact-summary">
                                    Contact & details
                                </summary>
                                <div className="oc-contact-dropdown-body">
                                    {website && (
                                        <div className="oc-contact-row">
                                            <span className="oc-contact-label">
                                                Website
                                            </span>
                                            <a
                                                href={website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="oc-contact-link"
                                            >
                                                Visit website
                                            </a>
                                        </div>
                                    )}
                                    {contactName && (
                                        <div className="oc-contact-row">
                                            <span className="oc-contact-label">
                                                Contact
                                            </span>
                                            <span className="oc-contact-value">
                                                {contactName}
                                            </span>
                                        </div>
                                    )}
                                    {contactEmail && (
                                        <div className="oc-contact-row">
                                            <span className="oc-contact-label">
                                                Email
                                            </span>
                                            <a
                                                href={`mailto:${contactEmail}`}
                                                className="oc-contact-link"
                                            >
                                                {contactEmail}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </details>
                        )}
                    </div>
                )}

                {/* WHEN & WHERE — directions focused */}
                {activeTab === "logistics" && (
                    <div className="oc-section">
                        {!hasLogistics && (
                            <p className="oc-body-text oc-muted-text">
                                We’ll reach out with more details once you sign up. Feel free to contact us if you need additional support. We'd love to me you!
                            </p>
                        )}

                        {transitSupport && (
                            <div className="oc-direction-block">
                                <p className="oc-section-label">
                                    Getting there 
                                </p>
                                <div className="oc-direction-card">
                                    <span className="oc-direction-icon">
                                        <BusFront size={16} />
                                    </span>
                                    <p className="oc-body-text">
                                        {transitSupport}
                                    </p>
                                </div>
                            </div>
                        )}

                        {meetingPoint && (
                            <div className="oc-direction-block">
                                <p className="oc-section-label">
                                    Where to meet
                                </p>
                                <div className="oc-direction-card">
                                    <span className="oc-direction-icon">
                                        <GeoAlt size={16} />
                                    </span>
                                    <p className="oc-body-text">
                                        {meetingPoint}
                                    </p>
                                </div>
                            </div>
                        )}

                        {arrivalNotes && (
                            <div className="oc-direction-block">
                                <p className="oc-section-label">
                                    What happens when you arrive
                                </p>
                                <p className="oc-body-text">{arrivalNotes}</p>
                            </div>
                        )}

                        {accessibilityNotes && (
                            <div className="oc-direction-block">
                                <p className="oc-section-label">
                                    Accessibility support
                                </p>
                                <p className="oc-body-text">
                                    {accessibilityNotes}
                                </p>
                            </div>
                        )}

                        {mapsUrl && (
                            <a
                                href={mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="oc-map-link"
                            >
                                <GeoAlt size={14} />
                                View location on map
                            </a>
                        )}
                    </div>
                )}

                {/* GOOD TO KNOW */}
                {activeTab === "barriers" && (
                    <div className="oc-section">
                        <div className="oc-good-list">
                            <GoodItem
                                show={hasDropIn}
                                label="You can drop in — no sign-up needed"
                                variant="green"
                            />
                            <GoodItem
                                show={hasKids}
                                label="Kids are welcome!"
                                variant="green"
                            />
                            <GoodItem
                                show={hasQuiet}
                                label="Small, calm group setting"
                                variant="green"
                            />
                            <GoodItem
                                show={hasSolo}
                                label="Bring yourself or come with a group!"
                                variant="green"
                            />
                            <GoodItem
                                show={beginnerFriendly}
                                label="Open to newcomers"
                                variant="green"
                            />
                            <GoodItem
                                show={!!hasBring}
                                label={hasBring || ""}
                                variant="amber"
                            />
                        </div>
                    </div>
                )}

                {/* SKILLS */}
                {activeTab === "skills" && (
                    <div className="oc-section">
                        <p className="oc-body-text oc-soft-note">
                            No experience needed! Feel free to join us for how long you'd like. Just bring yourself, we'd love
                            to meet you! 
                        </p>
                        <p className="oc-section-label">Skills you get to try</p>
                        <div className="oc-skills-row">
                            {displaySkills.map((s, i) => (
                                <span key={i} className="oc-skill-pill">
                                    {s}
                                </span>
                            ))}
                        </div>
                        {impact && (
                            <p
                                className="oc-impact-line"
                                style={{ marginTop: "6px" }}
                            >
                                <span className="oc-impact-label">
                                    Impact:{" "}
                                </span>
                                {impact}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* ── Footer: always visible ── */}
            <div className="oc-footer">
                {isCompleted ? (
                    <button
                        type="button"
                        className="oc-commit-btn oc-commit-btn--completed"
                        disabled
                        aria-label="You have already completed this event"
                    >
                        <span className="oc-commit-btn-inner">
                            <span className="oc-commit-btn-text is-visible">
                                ✓ Already completed
                            </span>
                        </span>
                    </button>
                ) : (
                    <button
                        type="button"
                        className={`oc-commit-btn ${
                            isCommitted ? "oc-commit-btn--committed" : ""
                        }`}
                        onClick={() =>
                            onCommit?.({ id, title, organization, location })
                        }
                        aria-live="polite"
                    >
                        <span className="oc-commit-btn-inner">
                            <span
                                className={`oc-commit-btn-text ${
                                    isCommitted ? "is-hidden" : "is-visible"
                                }`}
                            >
                                {nextStepLabel}
                            </span>
                            <span
                                className={`oc-commit-btn-text oc-commit-btn-text--alt ${
                                    isCommitted ? "is-visible" : "is-hidden"
                                }`}
                            >
                                ✕Changed my plans
                            </span>
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
}

export default OpportunityCard;
