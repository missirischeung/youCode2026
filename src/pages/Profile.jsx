import { useState, useEffect, useRef } from 'react'
import { Container, Row, Col, Card, Button, Form, Spinner, ProgressBar } from 'react-bootstrap'
import { supabase } from '../supabaseClient'
import opportunities from '../data/opportunities'
import './Profile.css'

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

function Profile() {
    const [profile, setProfile] = useState(null)
    const [editing, setEditing] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [futureEvents, setFutureEvents] = useState([])

    // Avatar
    const [avatarUrl, setAvatarUrl] = useState(null)
    const [avatarUploading, setAvatarUploading] = useState(false)
    const fileInputRef = useRef(null)

    // Bubble inputs
    const [skillInput, setSkillInput] = useState('')
    const [accessibilityInput, setAccessibilityInput] = useState('')

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) { setLoading(false); return }

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (error) {
                setError(error.message)
            } else {
                setProfile(data)

                const { data: avatarData } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(user.id)
                if (avatarData?.publicUrl) {
                    setAvatarUrl(avatarData.publicUrl + '?t=' + Date.now())
                }

                if (data.future_events?.length) {
                    const matched = opportunities.filter((op) =>
                        data.future_events.includes(op.id)
                    )
                    setFutureEvents(matched)
                }
            }
            setLoading(false)
        }

        fetchProfile()
    }, [])

    // ── Avatar ─────────────────────────────────────────────────
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

    // ── Field change ───────────────────────────────────────────
    const handleChange = (field, value) => {
        setProfile((prev) => ({ ...prev, [field]: value }))
    }

    // ── Age validation ─────────────────────────────────────────
    const handleAgeChange = (e) => {
        const val = parseInt(e.target.value)
        if (isNaN(val)) { handleChange('age', ''); return }
        if (val < 0 || val > 100) return
        handleChange('age', val)
    }

    // ── Skill bubbles ──────────────────────────────────────────
    const handleSkillKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            const trimmed = skillInput.trim()
            if (!trimmed) return
            const current = profile?.skill_set || []
            if (!current.includes(trimmed)) {
                handleChange('skill_set', [...current, trimmed])
            }
            setSkillInput('')
        }
    }

    const removeSkill = (skillToRemove) => {
        handleChange('skill_set', (profile?.skill_set || []).filter((s) => s !== skillToRemove))
    }

    // ── Accessibility needs bubbles ────────────────────────────
    const handleAccessibilityKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            const trimmed = accessibilityInput.trim()
            if (!trimmed) return
            const current = profile?.accessibility_needs || []
            if (!current.includes(trimmed)) {
                handleChange('accessibility_needs', [...current, trimmed])
            }
            setAccessibilityInput('')
        }
    }

    const removeAccessibility = (item) => {
        handleChange('accessibility_needs', (profile?.accessibility_needs || []).filter((s) => s !== item))
    }

    // ── Geolocation ────────────────────────────────────────────
    const handleLocationFocus = () => {
        if (!navigator.geolocation) return
        if (profile?.location) return

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                    )
                    const json = await res.json()
                    const city =
                        json.address?.city ||
                        json.address?.town ||
                        json.address?.village ||
                        json.address?.county || ''
                    const country = json.address?.country || ''
                    const locationString = [city, country].filter(Boolean).join(', ')
                    if (locationString) handleChange('location', locationString)
                } catch {
                    // silently fail
                }
            },
            () => { /* permission denied */ }
        )
    }

    // ── Save ───────────────────────────────────────────────────
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

        if (error) {
            setError(error.message)
        } else {
            setSuccess('Profile saved!')
            setEditing(false)
        }
    }

    // ── Skills breakdown from future events ────────────────────
    const skillMap = {}
    futureEvents.forEach((op) => {
        op.skills.forEach((skill) => {
            skillMap[skill] = (skillMap[skill] || 0) + 1
        })
    })

    // ── Bubble component ───────────────────────────────────────
    const Bubble = ({ label, onRemove }) => (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: '#f0e6ff',
                color: '#6f5a91',
                borderRadius: '999px',
                padding: '4px 12px',
                fontSize: '0.85rem',
                fontWeight: 500,
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
                        color: '#9b7cc4',
                        cursor: 'pointer',
                        padding: '0 2px',
                        fontSize: '0.9rem',
                        lineHeight: 1,
                    }}
                    title="Remove"
                >
                    ×
                </button>
            )}
        </span>
    )

    if (loading) {
        return (
            <div className="profile-page d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <Spinner animation="border" />
            </div>
        )
    }

    return (
        <div
            className="profile-page"
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #fdf4f7 0%, #f8f5ff 45%, #eef6ff 100%)',
                paddingTop: '3rem',
                paddingBottom: '3rem',
            }}
        >
            <Container>
                {/* Top Card */}
                <Card
                    className="mb-4 text-center mx-auto"
                    style={{
                        maxWidth: '500px',
                        borderRadius: '28px',
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(6px)',
                        boxShadow: '0 20px 50px rgba(124,108,130,0.12)',
                        padding: '2rem',
                    }}
                >
                    {/* Avatar */}
                    <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
                        <img
                            src={avatarUrl || 'https://www.gravatar.com/avatar/?d=mp&s=100'}
                            alt="avatar"
                            style={{
                                borderRadius: '50%',
                                width: 100,
                                height: 100,
                                objectFit: 'cover',
                                border: '3px solid #e7dce4',
                            }}
                        />
                        {editing && (
                            <>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={avatarUploading}
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        background: '#334155',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: 30,
                                        height: 30,
                                        color: '#fff',
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    title="Change photo"
                                >
                                    {avatarUploading ? '…' : '✎'}
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleAvatarChange}
                                />
                            </>
                        )}
                    </div>

                    {editing ? (
                        <Form style={{ width: '100%', textAlign: 'left' }}>

                            {/* Name */}
                            <Form.Group className="mb-3">
                                <Form.Label><strong>Name</strong></Form.Label>
                                <Form.Control
                                    value={profile?.name || ''}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                />
                            </Form.Group>

                            {/* Age */}
                            <Form.Group className="mb-3">
                                <Form.Label><strong>Age</strong></Form.Label>
                                <Form.Control
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={profile?.age || ''}
                                    onChange={handleAgeChange}
                                />
                                <Form.Text className="text-muted">Must be between 0 and 100.</Form.Text>
                            </Form.Group>

                            {/* Pronouns */}
                            <Form.Group className="mb-3">
                                <Form.Label><strong>Pronouns</strong></Form.Label>
                                <Form.Control
                                    value={profile?.pronouns || ''}
                                    onChange={(e) => handleChange('pronouns', e.target.value)}
                                />
                            </Form.Group>

                            {/* Gender Identity */}
                            <Form.Group className="mb-3">
                                <Form.Label><strong>Gender Identity</strong></Form.Label>
                                <Form.Select
                                    value={profile?.gender_identity || ''}
                                    onChange={(e) => handleChange('gender_identity', e.target.value)}
                                >
                                    <option value="">Select…</option>
                                    {GENDER_OPTIONS.map((g) => (
                                        <option key={g} value={g}>{g}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            {/* Location */}
                            <Form.Group className="mb-3">
                                <Form.Label><strong>Location</strong></Form.Label>
                                <Form.Control
                                    value={profile?.location || ''}
                                    onFocus={handleLocationFocus}
                                    onChange={(e) => handleChange('location', e.target.value)}
                                    placeholder="Click to use your location, or type manually"
                                />
                                <Form.Text className="text-muted">
                                    Clicking the field will ask to use your device location.
                                </Form.Text>
                            </Form.Group>

                            {/* Skills */}
                            <Form.Group className="mb-3">
                                <Form.Label><strong>Skills</strong></Form.Label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                                    {(profile?.skill_set || []).map((skill) => (
                                        <Bubble key={skill} label={skill} onRemove={() => removeSkill(skill)} />
                                    ))}
                                </div>
                                <Form.Control
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyDown={handleSkillKeyDown}
                                    placeholder="Type a skill and press Enter"
                                />
                                <Form.Text className="text-muted">Press Enter to add each skill.</Form.Text>
                            </Form.Group>

                            {/* Accessibility Needs */}
                            <Form.Group className="mb-3">
                                <Form.Label><strong>Accessibility Needs</strong></Form.Label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                                    {(profile?.accessibility_needs || []).map((item) => (
                                        <Bubble key={item} label={item} onRemove={() => removeAccessibility(item)} />
                                    ))}
                                </div>
                                <Form.Control
                                    value={accessibilityInput}
                                    onChange={(e) => setAccessibilityInput(e.target.value)}
                                    onKeyDown={handleAccessibilityKeyDown}
                                    placeholder="Type a need and press Enter"
                                />
                                <Form.Text className="text-muted">Press Enter to add each item.</Form.Text>
                            </Form.Group>

                            {/* Has Children */}
                            <Form.Group className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="I have children"
                                    checked={profile?.has_children || false}
                                    onChange={(e) => handleChange('has_children', e.target.checked)}
                                />
                            </Form.Group>

                            {/* Has Pets */}
                            <Form.Group className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="I have pets"
                                    checked={profile?.has_pets || false}
                                    onChange={(e) => handleChange('has_pets', e.target.checked)}
                                />
                            </Form.Group>

                            {error && <div className="alert alert-danger py-2">{error}</div>}
                            {success && <div className="alert alert-success py-2">{success}</div>}

                            <div className="d-flex gap-2">
                                <Button variant="dark" onClick={handleSave} disabled={saving}>
                                    {saving ? 'Saving…' : 'Save'}
                                </Button>
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => {
                                        setEditing(false)
                                        setSkillInput('')
                                        setAccessibilityInput('')
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </Form>
                    ) : (
                        <>
                            {error && <div className="alert alert-danger py-2">{error}</div>}
                            {success && <div className="alert alert-success py-2">{success}</div>}

                            <p style={{ margin: '0.25rem 0' }}><strong>Name:</strong> {profile?.name || '—'}</p>
                            <p style={{ margin: '0.25rem 0' }}><strong>Email:</strong> {profile?.email || '—'}</p>
                            <p style={{ margin: '0.25rem 0' }}><strong>Age:</strong> {profile?.age || '—'}</p>
                            <p style={{ margin: '0.25rem 0' }}><strong>Pronouns:</strong> {profile?.pronouns || '—'}</p>
                            <p style={{ margin: '0.25rem 0' }}><strong>Gender Identity:</strong> {profile?.gender_identity || '—'}</p>
                            <p style={{ margin: '0.25rem 0' }}><strong>Location:</strong> {profile?.location || '—'}</p>
                            <p style={{ margin: '0.25rem 0' }}><strong>Has Children:</strong> {profile?.has_children ? 'Yes' : 'No'}</p>
                            <p style={{ margin: '0.25rem 0' }}><strong>Has Pets:</strong> {profile?.has_pets ? 'Yes' : 'No'}</p>

                            <div style={{ margin: '0.25rem 0', textAlign: 'left' }}>
                                <strong>Skills:</strong>{' '}
                                {profile?.skill_set?.length ? (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                                        {profile.skill_set.map((s) => <Bubble key={s} label={s} />)}
                                    </div>
                                ) : '—'}
                            </div>

                            <div style={{ margin: '0.5rem 0', textAlign: 'left' }}>
                                <strong>Accessibility Needs:</strong>{' '}
                                {profile?.accessibility_needs?.length ? (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                                        {profile.accessibility_needs.map((s) => <Bubble key={s} label={s} />)}
                                    </div>
                                ) : '—'}
                            </div>

                            <Button variant="dark" className="mt-3" onClick={() => setEditing(true)}>
                                Edit
                            </Button>
                        </>
                    )}
                </Card>

                {/* Two-Column Layout */}
                <Row>
                    <Col md={6}>
                        <h3 style={{ color: '#334155', marginBottom: '1rem' }}>Upcoming Events</h3>
                        {futureEvents.length === 0 ? (
                            <p style={{ color: '#64748b' }}>You have not signed up for any events yet.</p>
                        ) : (
                            futureEvents.map((op) => (
                                <Card
                                    key={op.id}
                                    className="mb-3 p-3"
                                    style={{ borderRadius: '16px', boxShadow: '0 5px 15px rgba(124,108,130,0.08)' }}
                                >
                                    <h5 style={{ marginBottom: '0.5rem' }}>{op.title}</h5>
                                    <p style={{ color: '#64748b', marginBottom: '0.25rem' }}><strong>Organization:</strong> {op.organization}</p>
                                    <p style={{ color: '#64748b', marginBottom: '0.25rem' }}><strong>Schedule:</strong> {op.schedule}</p>
                                    <p style={{ color: '#64748b', marginBottom: '0.25rem' }}><strong>Location:</strong> {op.location}</p>
                                    <p style={{ color: '#64748b', marginBottom: 0 }}><strong>Skills:</strong> {op.skills.join(', ')}</p>
                                </Card>
                            ))
                        )}
                    </Col>

                    <Col md={6}>
                        <h3 style={{ color: '#334155', marginBottom: '1rem' }}>Skills You'll Build</h3>
                        {Object.keys(skillMap).length === 0 ? (
                            <p style={{ color: '#64748b' }}>Sign up for events to start building skills.</p>
                        ) : (
                            Object.entries(skillMap).map(([skill, count]) => (
                                <Card
                                    key={skill}
                                    className="mb-3 p-3"
                                    style={{ borderRadius: '16px', boxShadow: '0 5px 15px rgba(124,108,130,0.08)' }}
                                >
                                    <strong style={{ color: '#334155' }}>{skill}</strong>
                                    <ProgressBar
                                        now={Math.min(count, 15)}
                                        max={15}
                                        label={`${Math.min(count, 15)}/15`}
                                        style={{ height: '1.5rem', borderRadius: '12px', marginTop: '0.5rem' }}
                                        variant="info"
                                    />
                                </Card>
                            ))
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Profile
