import { useState, useEffect } from 'react'
import { Container, Card, Button, Form, Spinner } from 'react-bootstrap'
import { supabase } from '../supabaseClient'
import './Profile.css'

function Profile() {
    const [profile, setProfile] = useState(null)
    const [editing, setEditing] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) { setLoading(false); return }

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (error) setError(error.message)
            else setProfile(data)
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

        const { data: { user } } = await supabase.auth.getUser()

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

        if (error) {
            setError(error.message)
        } else {
            setSuccess('Profile saved!')
            setEditing(false)
        }
    }

    if (loading) {
        return (
            <div className="profile-page d-flex justify-content-center align-items-center">
                <Spinner animation="border" />
            </div>
        )
    }

    return (
        <div className="profile-page">
            <Container className="py-5">
                <Card className="profile-card mx-auto">
                    <Card.Body className="p-4">
                        <h2 className="mb-4">Profile</h2>

                        {error && <div className="alert alert-danger py-2">{error}</div>}
                        {success && <div className="alert alert-success py-2">{success}</div>}

                        {editing ? (
                            <Form>
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
                                        <span className="text-muted" style={{ fontSize: '0.85rem' }}>(comma-separated)</span>
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
                                <p><strong>Name:</strong> {profile?.name || '—'}</p>
                                <p><strong>Email:</strong> {profile?.email || '—'}</p>
                                <p><strong>Age:</strong> {profile?.age || '—'}</p>
                                <p><strong>Pronouns:</strong> {profile?.pronouns || '—'}</p>
                                <p><strong>Location:</strong> {profile?.location || '—'}</p>
                                <p><strong>Skills:</strong> {profile?.skill_set?.join(', ') || '—'}</p>

                                <Button variant="dark" onClick={() => setEditing(true)}>
                                    Edit
                                </Button>
                            </>
                        )}
                    </Card.Body>
                </Card>
            </Container>
        </div>
    )
}

export default Profile
