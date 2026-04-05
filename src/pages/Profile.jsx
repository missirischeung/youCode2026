import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Form, Spinner, ProgressBar } from 'react-bootstrap'
import { supabase } from '../supabaseClient'
import opportunities from '../data/opportunities'
import './Profile.css'

function Profile() {
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [registered, setRegistered] = useState([]) // registered opportunities

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) setError(error.message)
      else {
        setProfile(data)

        // Get registered opportunities from user.profile
        if (data.registeredOpportunities?.length) {
          const regs = opportunities.filter((op) =>
            data.registeredOpportunities.includes(op.id)
          )
          setRegistered(regs)
        }
      }
      setLoading(false)
    }

    fetchProfile()
  }, [])

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { error } = await supabase
      .from('profiles')
      .update({
        name: profile.name,
        age: profile.age,
        pronouns: profile.pronouns,
        location: profile.location,
        skill_set: profile.skill_set,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    setSaving(false)

    if (error) setError(error.message)
    else {
      setSuccess('Profile saved!')
      setEditing(false)
    }
  }

  // Aggregate skills for progress bar
  const skillMap = {}
  registered.forEach((op) => {
    op.skills.forEach((skill) => {
      skillMap[skill] = (skillMap[skill] || 0) + 1
    })
  })

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
        {/* Top Card: Avatar + Info */}
        <Card
          className="mb-4 text-center mx-auto"
          style={{
            maxWidth: '450px',
            borderRadius: '28px',
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(6px)',
            boxShadow: '0 20px 50px rgba(124,108,130,0.12)',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img
            src={'https://www.gravatar.com/avatar/?d=mp&s=100'}
            alt="avatar"
            style={{ borderRadius: '50%', width: 100, height: 100, marginBottom: '1rem' }}
          />

          {editing ? (
            <Form style={{ width: '100%' }}>
              <Form.Group className="mb-3">
                <Form.Label><strong>Name</strong></Form.Label>
                <Form.Control
                  value={profile?.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label><strong>Age</strong></Form.Label>
                <Form.Control
                  type="number"
                  value={profile?.age || ''}
                  onChange={(e) => handleChange('age', parseInt(e.target.value) || '')}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label><strong>Pronouns</strong></Form.Label>
                <Form.Control
                  value={profile?.pronouns || ''}
                  onChange={(e) => handleChange('pronouns', e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label><strong>Location</strong></Form.Label>
                <Form.Control
                  value={profile?.location || ''}
                  onChange={(e) => handleChange('location', e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  <strong>Skills</strong>{' '}
                  <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                    (comma-separated)
                  </span>
                </Form.Label>
                <Form.Control
                  value={profile?.skill_set ? profile.skill_set.join(', ') : ''}
                  onChange={(e) =>
                    handleChange(
                      'skill_set',
                      e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                    )
                  }
                />
              </Form.Group>

              <div className="d-flex gap-2">
                <Button variant="dark" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving…' : 'Save'}
                </Button>
                <Button variant="outline-secondary" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            </Form>
          ) : (
            <>
              <p style={{ margin: '0.25rem 0' }}><strong>Name:</strong> {profile?.name || '—'}</p>
              <p style={{ margin: '0.25rem 0' }}><strong>Email:</strong> {profile?.email || '—'}</p>
              {profile?.age && profile?.gender && (
                <p style={{ margin: '0.25rem 0' }}>
                  Age: {profile.age} | Gender: {profile.gender}
                </p>
              )}
              {profile?.pronouns && <p style={{ margin: '0.25rem 0' }}>Pronouns: {profile.pronouns}</p>}
              {profile?.location && <p style={{ margin: '0.25rem 0' }}>Location: {profile.location}</p>}
              {profile?.getHoursVolunteered && (
                <p style={{ margin: '0.25rem 0' }}>Hours Volunteered: {profile.getHoursVolunteered()}</p>
              )}
              <Button variant="dark" onClick={() => setEditing(true)}>Edit</Button>
            </>
          )}
        </Card>

        {/* Two-Column Layout */}
        <Row>
          {/* Left: Recent Volunteer Experiences */}
          <Col md={6}>
            <h3 style={{ color: '#334155', marginBottom: '1rem' }}>Recent Volunteer Experiences</h3>
            {registered.length === 0 ? (
              <p style={{ color: '#64748b' }}>You have not registered for any opportunities yet.</p>
            ) : (
              registered.slice(-5).map((op) => (
                <Card
                  key={op.id}
                  className="mb-3 p-3"
                  style={{ borderRadius: '16px', boxShadow: '0 5px 15px rgba(124,108,130,0.08)' }}
                >
                  <h5 style={{ marginBottom: '0.5rem' }}>{op.title}</h5>
                  <p style={{ color: '#64748b', marginBottom: '0.25rem' }}>
                    <strong>Organization:</strong> {op.organization}
                  </p>
                  <p style={{ color: '#64748b', marginBottom: '0.25rem' }}>
                    <strong>Effort Level:</strong> {op.effortLevel}
                  </p>
                  <p style={{ color: '#64748b', marginBottom: 0 }}>
                    <strong>Skills:</strong> {op.skills.slice(0, 3).join(', ')}
                  </p>
                </Card>
              ))
            )}
          </Col>

          {/* Right: Skills Learned */}
          <Col md={6}>
            <h3 style={{ color: '#334155', marginBottom: '1rem' }}>Skills Learned</h3>
            {Object.keys(skillMap).length === 0 ? (
              <p style={{ color: '#64748b' }}>No skills earned yet</p>
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
