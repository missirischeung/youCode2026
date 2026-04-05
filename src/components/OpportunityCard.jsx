import { useState } from "react";
import { Badge, Button } from "react-bootstrap";
import {
    GeoAlt,
    Clock,
    CashCoin,
    BusFront,
    CalendarEvent,
} from "react-bootstrap-icons";
import { getTimeCommitment } from "../utils/time";
import "./OpportunityCard.css";

const EFFORT_CONFIG = {
    1: { label: "Easy start",     className: "effort-level--1" },
    2: { label: "Small stretch",  className: "effort-level--2" },
    3: { label: "Ready for more", className: "effort-level--3" },
};

const TABS = [
    { id: "overview",  label: "Overview"     },
    { id: "logistics", label: "When & where" },
    { id: "barriers",  label: "Good to know" },
    { id: "skills",    label: "Skills"       },
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
    effortLevel = 1,
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
    nextStepLabel = "I'm in",
    onCommit,
    isCommitted = false,
}) {
    const [activeTab, setActiveTab] = useState("overview");

    const effort = EFFORT_CONFIG[effortLevel] ?? EFFORT_CONFIG[1];
    const duration = timeCommitment || getTimeCommitment(timeRange);

    // derive barrier flags from tags array
    const lowerTags = tags.map((t) => t.toLowerCase());
    const hasKids     = lowerTags.some((t) => t.includes("kids"));
    const hasSolo     = lowerTags.some((t) => t.includes("alone") || t.includes("solo"));
    const hasQuiet    = lowerTags.some((t) => t.includes("quiet") || t.includes("small group"));
    const hasDropIn   = barrierSupport.some((b) => b.toLowerCase().includes("drop"));
    const hasBring    = barrierSupport.find((b) => b.toLowerCase().includes("bring"));

    // deduplicate builds and skills — use builds if available, fall back to skills,
    // then remove any entries that already appear in the other list
    const displaySkills = builds.length > 0
        ? builds
        : skills.filter((s) => !builds.includes(s));

    return (
        <div className={`oc-card ${effort.className}`}>

            {/* Accent bar */}
            <div className="oc-accent-bar" />

            {/* Header — always visible */}
            <div className="oc-header">
                <div className="oc-title-group">
                    <p className="oc-org">{organization}</p>
                    <h3 className="oc-title">{title}</h3>
                </div>
                <div className="oc-header-badges">
                    <span className="oc-effort-badge">{effort.label}</span>
                    {duration && (
                        <span className="oc-time-badge">
                            <Clock size={12} /> {duration}
                        </span>
                    )}
                </div>
            </div>

            {/* Pill nav — always visible */}
            <div className="oc-pill-nav">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        className={`oc-pill-btn ${activeTab === tab.id ? "active" : ""}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Panels */}
            <div className="oc-panel">

                {/* OVERVIEW */}
                {activeTab === "overview" && (
                    <div className="oc-section">
                        <p className="oc-section-label">What you'll do</p>
                        <p className="oc-body-text">{description}</p>

                        {whyItHelps && (
                            <div className="oc-why-box">{whyItHelps}</div>
                        )}

                        {impact && (
                            <p className="oc-impact-line">
                                <span className="oc-impact-label">Impact: </span>
                                {impact}
                            </p>
                        )}
                    </div>
                )}

                {/* WHEN & WHERE */}
                {activeTab === "logistics" && (
                    <div className="oc-section">
                        <div className="oc-info-grid">
                            <InfoCell
                                label="Where"
                                value={location}
                                icon={<GeoAlt size={14} />}
                            />
                            <InfoCell
                                label="Getting there"
                                value={transitSupport}
                                icon={<BusFront size={14} />}
                            />
                            <InfoCell
                                label="When"
                                value={schedule}
                                icon={<CalendarEvent size={14} />}
                            />
                            <InfoCell
                                label="Time"
                                value={timeRange}
                                icon={<Clock size={14} />}
                            />
                            <InfoCell
                                label="Time commitment"
                                value={duration}
                                icon={<Clock size={14} />}
                            />
                            <InfoCell
                                label="Cost"
                                value={cost}
                                icon={<CashCoin size={14} />}
                            />
                        </div>
                    </div>
                )}

                {/* GOOD TO KNOW */}
                {activeTab === "barriers" && (
                    <div className="oc-section">
                        <div className="oc-good-list">
                            <GoodItem show={hasDropIn}       label="Drop-in — no sign-up needed"    variant="green" />
                            <GoodItem show={hasKids}         label="OK to bring kids"                variant="green" />
                            <GoodItem show={hasQuiet}        label="Quiet, small group environment"  variant="green" />
                            <GoodItem show={hasSolo}         label="Fine to come alone"              variant="green" />
                            <GoodItem show={beginnerFriendly} label="Beginner friendly"              variant="green" />
                            <GoodItem show={!!hasBring}      label={hasBring || ""}                  variant="amber" />
                        </div>
                    </div>
                )}

                {/* SKILLS */}
                {activeTab === "skills" && (
                    <div className="oc-section">
                        <p className="oc-section-label">Skills you'll build</p>
                        <div className="oc-skills-row">
                            {displaySkills.map((s, i) => (
                                <Badge key={i} className="oc-skill-badge">{s}</Badge>
                            ))}
                        </div>

                        {impact && (
                            <p className="oc-impact-line" style={{ marginTop: "6px" }}>
                                <span className="oc-impact-label">Impact: </span>
                                {impact}
                            </p>
                        )}
                    </div>
                )}

            </div>

            {/* Footer — always visible */}
            <div className="oc-footer">
                <Button
                    className="oc-commit-btn"
                    onClick={() => onCommit?.({ id, title, organization, location })}
                    disabled={isCommitted}
                >
                    {isCommitted ? "✓ Committed" : nextStepLabel}
                </Button>
            </div>

        </div>
    );
}

export default OpportunityCard;
