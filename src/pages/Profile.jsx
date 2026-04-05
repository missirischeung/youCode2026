import { useState, useEffect, useMemo, useRef } from 'react'
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Form,
    Spinner,
    Badge,
    ProgressBar,
    Modal,
} from 'react-bootstrap'
import {
    CalendarEvent,
    Clock,
    GeoAlt,
    Heart,
    Stars,
    PersonHeart,
} from 'react-bootstrap-icons'
import { supabase } from '../supabaseClient'
import opportunities from '../data/opportunities'
import { getTimeCommitment } from '../utils/time'
import './Profile.css'
import '../pages/Dashboard.css'
import OpportunityCard from '../components/OpportunityCard'

const DEFAULT_AVATAR = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23e8d5dc'/%3E%3Ccircle cx='20' cy='16' r='7' fill='%23c49aac'/%3E%3Cellipse cx='20' cy='36' rx='12' ry='9' fill='%23c49aac'/%3E%3C/svg%3E`

const GENDER_OPTIONS = [
    'Prefer not to say',
    'Man',
    'Woman',
    'Non-binary',
    'Genderqueer',
    'Genderfluid',
    'Agender',
    'Two-Spirit',
    'Trans man',
    'Trans woman',
    'Other',
]

function Bubble({ label, onRemove }) {
    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: '#fcf4f7',
                color: '#8f5f72',
                border: '1px solid #ead7df',
                borderRadius: '10px',
                padding: '4px 12px',
                fontSize: '0.85rem',
                fontWeight: 600,
            }}
        >
            {label}
            {onRemove && (
                <button
                    type="button"
                    onClick={onRemove}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#a85f79',
                        cursor: 'pointer',
                        padding: '0 2px',
                        fontSize: '1rem',
                        lineHeight: 1,
                    }}
                    title="Remove"
                >
                    ×
                </button>
            )}
        </span>
    )
}

function Profile() {
    const [profile, setProfile] = useState(null)
    const [editing, setEditing] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [userId, setUserId] = useState(null)

    // future_events IDs (registered, not yet completed)
    const [futureIds, setFutureIds] = useState([])
    // event_history IDs (completed)
    const [historyIds, setHistoryIds] = useState([])

    // Avatar
    const [avatarUrl, setAvatarUrl] = useState(null)
    const [avatarUploading, setAvatarUploading] = useState(false)
    const fileInputRef = useRef(null)
    const [selectedOpportunity, setSelectedOpportunity] = useState(null)

    const savedProfileRef = useRef(null)

    // Bubble inputs
    const [skillInput, setSkillInput] = useState('')
    const [accessibilityInput, setAccessibilityInput] = useState('')

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) { setLoading(false); return }

            setUserId(user.id)

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (error) {
                setError(error.message)
            } else {
                setProfile(data)
                setFutureIds(data.future_events || [])
                setHistoryIds(data.event_history || [])

                const { data: avatarData } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(user.id)
                if (avatarData?.publicUrl) {
                    try {
                        const res = await fetch(avatarData.publicUrl, { method: 'HEAD' })
                        if (res.ok) {
                            setAvatarUrl(avatarData.publicUrl + '?t=' + Date.now())
                        }
                    } catch {
                        // no avatar uploaded, leave avatarUrl as null
                    }
                }
            }

            setLoading(false)
        }

        fetchProfile()
    }, [])

    // Derived opportunity objects
    const futureEvents = useMemo(() =>
        opportunities.filter((op) => futureIds.includes(op.id)),
        [futureIds]
    )

    const historyEvents = useMemo(() =>
        opportunities.filter((op) => historyIds.includes(op.id)),
        [historyIds]
    )

    // ── Mark event as completed ───────────────────────────────
    const handleMarkComplete = async (opId) => {
        if (!userId) return
        const newFutureIds = futureIds.filter((id) => id !== opId)
        const newHistoryIds = historyIds.includes(opId) ? historyIds : [...historyIds, opId]

        setFutureIds(newFutureIds)
        setHistoryIds(newHistoryIds)

        await supabase
            .from('profiles')
            .update({ future_events: newFutureIds, event_history: newHistoryIds })
            .eq('id', userId)
    }

    // ── Undo completion ───────────────────────────────────────
    const handleUndoComplete = async (opId) => {
        if (!userId) return
        const newHistoryIds = historyIds.filter((id) => id !== opId)
        const newFutureIds = futureIds.includes(opId) ? futureIds : [...futureIds, opId]

        setHistoryIds(newHistoryIds)
        setFutureIds(newFutureIds)

        await supabase
            .from('profiles')
            .update({ future_events: newFutureIds, event_history: newHistoryIds })
            .eq('id', userId)
    }

    // ── Cancel registration ───────────────────────────────────
    const handleUncommit = async (opId) => {
        if (!userId) return
        const newFutureIds = futureIds.filter((id) => id !== opId)
        setFutureIds(newFutureIds)
        await supabase
            .from('profiles')
            .update({ future_events: newFutureIds })
            .eq('id', userId)
    }

    // ── Avatar upload ─────────────────────────────────────────
    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        setAvatarUploading(true)
        setError('')
        const { data: { user } } = await supabase.auth.getUser()
        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(user.id, file, { upsert: true })
        if (uploadError) {
            setError('Failed to upload image: ' + uploadError.message)
        } else {
            const { data } = supabase.storage.from('avatars').getPublicUrl(user.id)
            setAvatarUrl(data.publicUrl + '?t=' + Date.now())
        }
        setAvatarUploading(false)
    }


    // ── Avatar remove ─────────────────────────────────────────
    const handleRemoveAvatar = async () => {
        if (!userId) return
        setAvatarUploading(true)
        setError('')
        const { error: removeError } = await supabase.storage
            .from('avatars')
            .remove([userId])
        if (removeError) {
            setError('Failed to remove photo: ' + removeError.message)
        } else {
            setAvatarUrl(null)
        }
        setAvatarUploading(false)
    }

    // ── Field change ──────────────────────────────────────────
    const handleChange = (field, value) => {
        setProfile((prev) => ({ ...prev, [field]: value }))
    }

    // ── Age validation ────────────────────────────────────────
    const handleAgeChange = (e) => {
        const val = parseInt(e.target.value)
        if (isNaN(val)) { handleChange('age', ''); return }
        if (val < 0 || val > 100) return
        handleChange('age', val)
    }

    // ── Skill bubbles ─────────────────────────────────────────
    const handleSkillKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            const trimmed = skillInput.trim()
            if (!trimmed) return
            const current = profile?.skill_set || []
            if (!current.includes(trimmed)) handleChange('skill_set', [...current, trimmed])
            setSkillInput('')
        }
    }
    const removeSkill = (skill) =>
        handleChange('skill_set', (profile?.skill_set || []).filter((s) => s !== skill))

    // ── Accessibility bubbles ─────────────────────────────────
    const handleAccessibilityKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            const trimmed = accessibilityInput.trim()
            if (!trimmed) return
            const current = profile?.accessibility_needs || []
            if (!current.includes(trimmed)) handleChange('accessibility_needs', [...current, trimmed])
            setAccessibilityInput('')
        }
    }
    const removeAccessibility = (item) =>
        handleChange('accessibility_needs', (profile?.accessibility_needs || []).filter((s) => s !== item))

    // ── Geolocation ───────────────────────────────────────────
    const handleLocationFocus = () => {
        if (!navigator.geolocation || profile?.location) return
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                    )
                    const json = await res.json()
                    const city = json.address?.city || json.address?.town || json.address?.village || json.address?.county || ''
                    const country = json.address?.country || ''
                    const locationString = [city, country].filter(Boolean).join(', ')
                    if (locationString) handleChange('location', locationString)
                } catch { /* silently fail */ }
            },
            () => { /* permission denied */ }
        )
    }

    // ── Save ──────────────────────────────────────────────────
    const handleSave = async () => {
        setSaving(true)
        setError('')
        setSuccess('')

        const { data: { user } } = await supabase.auth.getUser()
        const { error } = await supabase
            .from('profiles')
            .update({
                name: profile.name,
                age: profile.age,
                pronouns: profile.pronouns,
                gender_identity: profile.gender_identity,
                location: profile.location,
                skill_set: profile.skill_set,
                accessibility_needs: profile.accessibility_needs,
                has_children: profile.has_children,
                has_pets: profile.has_pets,
                updated_at: new Date().toISOString(),
            })
            .eq('id', user.id)

        setSaving(false)
        if (error) { setError(error.message) }
        else { setSuccess('Saved successfully.'); setEditing(false) }
    }

    // ── Stats — driven by event_history only ──────────────────
    const totalCompleted = historyEvents.length

    const totalHours = useMemo(() => {
        return historyEvents.reduce((sum, op) => {
            const durationText = op.timeCommitment || getTimeCommitment(op.timeRange)
            if (!durationText) return sum
            const hrMatch = durationText.match(/(\d+)\s*hr/)
            const minMatch = durationText.match(/(\d+)\s*min/)
            return sum + (hrMatch ? Number(hrMatch[1]) : 0) + (minMatch ? Number(minMatch[1]) / 60 : 0)
        }, 0)
    }, [historyEvents])

    const manageableSummary = useMemo(() => {
        let easyStart = 0, beginner = 0, solo = 0, quiet = 0
        historyEvents.forEach((op) => {
            if (op.effortLevel === 1) easyStart += 1
            if (op.beginnerFriendly) beginner += 1
            const lt = (op.tags || []).map((t) => t.toLowerCase())
            if (lt.some((t) => t.includes('alone') || t.includes('solo'))) solo += 1
            if (lt.some((t) => t.includes('quiet') || t.includes('small group'))) quiet += 1
        })
        const items = []
        if (easyStart > 0) items.push('Easy-start opportunities')
        if (beginner > 0) items.push('Beginner-friendly spaces')
        if (solo > 0) items.push('Options where you can come on your own')
        if (quiet > 0) items.push('Quieter, lower-pressure settings')
        return items
    }, [historyEvents])

    const reflectionThemes = useMemo(() => {
        const themes = new Set()
        historyEvents.forEach((op) => {
            if (op.effortLevel === 1) themes.add('Starting with small steps')
            if (op.location) themes.add('Getting more comfortable going places')
            if ((op.tags || []).some((t) => { const l = t.toLowerCase(); return l.includes('alone') || l.includes('solo') }))
                themes.add('Showing up more independently')
            if ((op.tags || []).some((t) => { const l = t.toLowerCase(); return l.includes('quiet') || l.includes('small group') }))
                themes.add('Finding lower-pressure spaces')
            if (op.schedule) themes.add('Trying out structure and routine')
            if ((op.skills || []).length > 0) themes.add('Trying new kinds of tasks')
        })
        return Array.from(themes)
    }, [historyEvents])

    const weeklyGoal = 3
    const weeklyCount = Math.min(totalCompleted, weeklyGoal)
    const weeklyPercent = (weeklyCount / weeklyGoal) * 100

    const encouragement =
        totalCompleted === 0
            ? 'A small first step can still matter. This space is here to help you ease into what feels manageable.'
            : totalCompleted < 3
                ? "You've already started building momentum. Small steps can make leaving feel more familiar over time."
                : "You've been building real consistency. Keep choosing what feels doable and supportive."

    // All events to show in "My Events" — future first, then completed (greyscale)
    const allMyEvents = useMemo(() => [
        ...futureEvents.map((op) => ({ ...op, _completed: false })),
        ...historyEvents.map((op) => ({ ...op, _completed: true })),
    ], [futureEvents, historyEvents])

    if (loading) {
        return (
            <div className="profile-page profile-loading">
                <Spinner animation="border" />
            </div>
        )
    }

    return (
        <>
            <div className="profile-page">
                <Container className="py-5">

                    {/* ── Hero Card ── */}
                    <Card className="journey-hero-card">
                        <div className="journey-hero-top">
                            <div className="journey-hero-copy">
                                <p className="journey-kicker">YOUR JOURNEY SO FAR</p>
                                <h1 className="journey-title">A look at what you've been part of</h1>
                                <p className="journey-subtitle">
                                    See what you've explored so far, what's coming up next, and what's been helping you move forward.
                                </p>
                            </div>

                            {/* Avatar */}
                            <div className="journey-avatar-wrap">
                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                    <img
                                        src={avatarUrl || DEFAULT_AVATAR}
                                        alt="avatar"
                                        className="journey-avatar"
                                    />
                                    {editing && (
                                        <>
                                            {/* Change photo pencil button */}
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={avatarUploading}
                                                style={{
                                                    position: 'absolute', bottom: 2, right: 2,
                                                    background: '#4d3b43', border: 'none', borderRadius: '50%',
                                                    width: 28, height: 28, color: '#fff', fontSize: '0.8rem',
                                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                }}
                                                title="Change photo"
                                            >
                                                {avatarUploading ? '…' : '✎'}
                                            </button>
                                            <input ref={fileInputRef} type="file" accept="image/*"
                                                style={{ display: 'none' }} onChange={handleAvatarChange} />
                                            {/* Remove photo button — only shown if an avatar exists */}
                                            {avatarUrl && (
                                                <button
                                                    onClick={handleRemoveAvatar}
                                                    disabled={avatarUploading}
                                                    style={{
                                                        position: 'absolute', top: 2, right: 2,
                                                        background: '#b44f68', border: 'none', borderRadius: '50%',
                                                        width: 22, height: 22, color: '#fff', fontSize: '0.7rem',
                                                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        lineHeight: 1,
                                                    }}
                                                    title="Remove photo"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="journey-profile-bar">
                            <div className="journey-profile-info">
                                <p className="journey-name">{profile?.name || 'Your profile'}</p>
                                <p className="journey-email">{profile?.email || '—'}</p>
                            </div>

                            {/* "Edit details" only shown when NOT editing — no Close editor button */}
                            {!editing && (
                                <Button
                                    className="journey-btn-primary"
                                    onClick={() => {
                                        savedProfileRef.current = { ...profile }
                                        setEditing(true)
                                    }}
                                >
                                    Edit details
                                </Button>
                            )}
                        </div>

                        {!editing ? (
                            <>
                                <div className="journey-meta-row">
                                    {profile?.pronouns && <span className="journey-meta-pill">{profile.pronouns}</span>}
                                    {profile?.gender_identity && <span className="journey-meta-pill">{profile.gender_identity}</span>}
                                    {profile?.location && <span className="journey-meta-pill">{profile.location}</span>}
                                    {profile?.age && <span className="journey-meta-pill">Age {profile.age}</span>}
                                    {profile?.has_children && <span className="journey-meta-pill">Has children</span>}
                                    {profile?.has_pets && <span className="journey-meta-pill">Has pets</span>}
                                </div>

                                {profile?.skill_set?.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '0.75rem' }}>
                                        {profile.skill_set.map((s) => <Bubble key={s} label={s} />)}
                                    </div>
                                )}

                                {profile?.accessibility_needs?.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '0.5rem' }}>
                                        {profile.accessibility_needs.map((s) => <Bubble key={s} label={`♿ ${s}`} />)}
                                    </div>
                                )}

                                <div className="journey-encouragement-card">
                                    <div className="journey-encouragement-icon"><Stars /></div>
                                    <div>
                                        <p className="journey-encouragement-title">Small steps still count</p>
                                        <p className="journey-encouragement-text">{encouragement}</p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <Form className="journey-edit-form">
                                <Row className="g-3">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control value={profile?.name || ''} onChange={(e) => handleChange('name', e.target.value)} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Age</Form.Label>
                                            <Form.Control type="number" min={0} max={100} value={profile?.age || ''} onChange={handleAgeChange} />
                                            <Form.Text className="text-muted">0–100 only.</Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Pronouns</Form.Label>
                                            <Form.Control value={profile?.pronouns || ''} onChange={(e) => handleChange('pronouns', e.target.value)} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Gender Identity</Form.Label>
                                            <Form.Select value={profile?.gender_identity || ''} onChange={(e) => handleChange('gender_identity', e.target.value)}>
                                                <option value="">Select…</option>
                                                {GENDER_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group>
                                            <Form.Label>Location</Form.Label>
                                            <Form.Control
                                                value={profile?.location || ''}
                                                onFocus={handleLocationFocus}
                                                onChange={(e) => handleChange('location', e.target.value)}
                                                placeholder="Click to use your location, or type manually"
                                            />
                                            <Form.Text className="text-muted">Clicking the field will ask to use your device location.</Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Skills / Interests</Form.Label>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                                                {(profile?.skill_set || []).map((s) => <Bubble key={s} label={s} onRemove={() => removeSkill(s)} />)}
                                            </div>
                                            <Form.Control value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={handleSkillKeyDown} placeholder="Type a skill and press Enter" />
                                            <Form.Text className="text-muted">Press Enter to add each skill.</Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Accessibility Needs</Form.Label>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                                                {(profile?.accessibility_needs || []).map((s) => <Bubble key={s} label={s} onRemove={() => removeAccessibility(s)} />)}
                                            </div>
                                            <Form.Control value={accessibilityInput} onChange={(e) => setAccessibilityInput(e.target.value)} onKeyDown={handleAccessibilityKeyDown} placeholder="Type a need and press Enter" />
                                            <Form.Text className="text-muted">Press Enter to add each item.</Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Check type="checkbox" label="I have children" checked={profile?.has_children || false} onChange={(e) => handleChange('has_children', e.target.checked)} />
                                    </Col>
                                    <Col md={6}>
                                        <Form.Check type="checkbox" label="I have pets" checked={profile?.has_pets || false} onChange={(e) => handleChange('has_pets', e.target.checked)} />
                                    </Col>
                                </Row>

                                <div className="journey-edit-actions">
                                    <Button className="journey-btn-primary" onClick={handleSave} disabled={saving}>
                                        {saving ? 'Saving…' : 'Save changes'}
                                    </Button>
                                    {/* Cancel reverts changes and closes the form */}
                                    <Button
                                        className="journey-btn-secondary"
                                        onClick={() => {
                                            if (savedProfileRef.current) setProfile(savedProfileRef.current)
                                            setEditing(false)
                                            setSkillInput('')
                                            setAccessibilityInput('')
                                            setError('')
                                            setSuccess('')
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </Form>
                        )}

                        {error && <p className="journey-message journey-error">{error}</p>}
                        {success && <p className="journey-message journey-success">{success}</p>}
                    </Card>

                    {/* ── Summary Cards — driven by event_history only ── */}
                    <Row className="g-4 mt-1 mb-4">
                        <Col md={6} xl={3} className="d-flex">
                            <Card className="journey-summary-card">
                                <div className="journey-summary-icon"><Heart /></div>
                                <p className="journey-summary-label">Events completed</p>
                                <h3 className="journey-summary-value">{totalCompleted}</h3>
                                <p className="journey-summary-subtext">opportunities finished so far</p>
                            </Card>
                        </Col>
                        <Col md={6} xl={3} className="d-flex">
                            <Card className="journey-summary-card">
                                <div className="journey-summary-icon"><Clock /></div>
                                <p className="journey-summary-label">Time you've given</p>
                                <h3 className="journey-summary-value">{totalHours.toFixed(1)}</h3>
                                <p className="journey-summary-subtext">hours completed</p>
                            </Card>
                        </Col>
                        <Col md={6} xl={3} className="d-flex">
                            <Card className="journey-summary-card">
                                <div className="journey-summary-icon"><PersonHeart /></div>
                                <p className="journey-summary-label">This week's momentum</p>
                                <h3 className="journey-summary-value">{weeklyCount}/{weeklyGoal}</h3>
                                <p className="journey-summary-subtext">completed toward your goal</p>
                            </Card>
                        </Col>
                        <Col md={6} xl={3} className="d-flex">
                            <Card className="journey-summary-card">
                                <div className="journey-summary-icon"><Stars /></div>
                                <p className="journey-summary-label">What's felt manageable</p>
                                <h3 className="journey-summary-value">{manageableSummary.length || 0}</h3>
                                <p className="journey-summary-subtext">supportive patterns so far</p>
                            </Card>
                        </Col>
                    </Row>

                    {/* ── Progress Card ── */}
                    <Card className="journey-progress-card mb-4">
                        <div className="journey-section-header">
                            <div>
                                <p className="journey-section-kicker">THIS WEEK</p>
                                <h3 className="journey-section-title">Keep building at your pace</h3>
                            </div>
                            <Badge className="journey-soft-badge">
                                {weeklyGoal - weeklyCount > 0
                                    ? `${weeklyGoal - weeklyCount} more to this week's goal`
                                    : "You reached this week's goal"}
                            </Badge>
                        </div>
                        <p className="journey-progress-copy">
                            Even one small, manageable opportunity can help build more comfort, routine, and independence over time.
                        </p>
                        <ProgressBar now={weeklyPercent} className="journey-progress-bar" />
                    </Card>

                    {/* ── My Events + Themes ── */}
                    <Row className="g-4 mb-4">
                        <Col lg={7}>
                            <Card className="journey-section-card h-100">
                                <div className="journey-section-header">
                                    <div>
                                        <p className="journey-section-kicker">YOUR EVENTS</p>
                                        <h3 className="journey-section-title">My Events</h3>
                                    </div>
                                </div>

                                {allMyEvents.length === 0 ? (
                                    <div className="journey-empty-state">
                                        <p className="journey-empty-title">No events yet</p>
                                        <p className="journey-empty-text">
                                            When you say "I'm in" to an opportunity, it'll show up here.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="journey-opportunity-list">
                                        {allMyEvents.map((op) => (
                                            <div
                                                key={op.id}
                                                className="journey-opportunity-item"
                                                onClick={() => setSelectedOpportunity(op)}
                                                style={{
                                                    filter: op._completed ? 'grayscale(1)' : 'none',
                                                    opacity: op._completed ? 0.65 : 1,
                                                    transition: 'filter 0.2s ease, opacity 0.2s ease',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                <div className="journey-opportunity-main">
                                                    <p className="journey-opportunity-org">{op.organization}</p>
                                                    <h4 className="journey-opportunity-title">{op.title}</h4>
                                                    <div className="journey-opportunity-meta">
                                                        {op.schedule && (
                                                            <span className="journey-opportunity-pill">
                                                                <CalendarEvent size={14} />{op.schedule}
                                                            </span>
                                                        )}
                                                        {op.timeRange && (
                                                            <span className="journey-opportunity-pill">
                                                                <Clock size={14} />{op.timeRange}
                                                            </span>
                                                        )}
                                                        {op.location && (
                                                            <span className="journey-opportunity-pill">
                                                                <GeoAlt size={14} />{op.location}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Right column — badge on top, then cancel, then checkbox */}
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem', flexShrink: 0 }}>
                                                    <Badge className={`journey-opportunity-badge ${op._completed ? 'journey-opportunity-badge--past' : ''}`}>
                                                        {op._completed ? 'Completed' : (op.effortLevel === 1 ? 'Easy start' : op.effortLevel === 2 ? 'Small stretch' : 'Ready for more')}
                                                    </Badge>

                                                    {/* Cancel registration — only for non-completed */}
                                                    {!op._completed && (
                                                        <button
                                                            className="journey-uncommit-btn"
                                                            onClick={(e) => { e.stopPropagation(); handleUncommit(op.id) }}
                                                        >
                                                            Cancel registration
                                                        </button>
                                                    )}

                                                    {/* Mark as done checkbox — below cancel, left-aligned with it */}
                                                    <label
                                                        onClick={(e) => e.stopPropagation()}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '6px',
                                                            fontSize: '0.82rem',
                                                            fontWeight: 600,
                                                            color: op._completed ? '#8a6e79' : '#5d4a52',
                                                            cursor: 'pointer',
                                                            userSelect: 'none',
                                                        }}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={op._completed}
                                                            onChange={() =>
                                                                op._completed
                                                                    ? handleUndoComplete(op.id)
                                                                    : handleMarkComplete(op.id)
                                                            }
                                                            style={{ accentColor: '#c97f97', width: 16, height: 16, cursor: 'pointer' }}
                                                        />
                                                        {op._completed ? 'Mark as not done' : 'Mark as done'}
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        </Col>

                        <Col lg={5}>
                            <Card className="journey-section-card h-100">
                                <div className="journey-section-header">
                                    <div>
                                        <p className="journey-section-kicker">WHAT'S BEEN HELPING</p>
                                        <h3 className="journey-section-title">What this has been helping you practice</h3>
                                    </div>
                                </div>

                                {reflectionThemes.length === 0 ? (
                                    <div className="journey-empty-state">
                                        <p className="journey-empty-title">Nothing here yet</p>
                                        <p className="journey-empty-text">
                                            As you complete opportunities, this section will reflect the kinds of steps you've been taking.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="journey-theme-list">
                                        {reflectionThemes.map((theme) => (
                                            <div key={theme} className="journey-theme-item">
                                                <span className="journey-theme-dot" />
                                                <span>{theme}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {manageableSummary.length > 0 && (
                                    <div className="journey-manageable-block">
                                        <p className="journey-manageable-title">What's felt more manageable so far</p>
                                        <div className="journey-manageable-tags">
                                            {manageableSummary.map((item) => (
                                                <span key={item} className="journey-manageable-pill">{item}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </Card>
                        </Col>
                    </Row>

                </Container>
            </div>

            {/* ── Opportunity detail modal (same as Dashboard) ── */}
            <Modal
                show={!!selectedOpportunity}
                onHide={() => setSelectedOpportunity(null)}
                centered
                size="lg"
                dialogClassName="opportunity-modal"
            >
                <Modal.Body className="opportunity-modal-body p-0">
                    {selectedOpportunity && (
                        <OpportunityCard
                            {...selectedOpportunity}
                            isCommitted={futureIds.includes(selectedOpportunity.id) || historyIds.includes(selectedOpportunity.id)}
                            isCompleted={historyIds.includes(selectedOpportunity.id)}
                            onCommit={({ id }) => { handleUncommit(id); setSelectedOpportunity(null) }}
                            onClose={() => setSelectedOpportunity(null)}
                        />
                    )}
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Profile