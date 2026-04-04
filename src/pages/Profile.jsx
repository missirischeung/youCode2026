import { Container, Card, Button } from 'react-bootstrap'
import './Profile.css'

function Profile() {
  return (
    <div className="profile-page">
      <Container className="py-5">
        <Card className="profile-card mx-auto">
          <Card.Body>
            <h2>Profile</h2>

            <p><strong>Name:</strong> User</p>
            <p><strong>Email:</strong> user@email.com</p>

            <Button variant="dark">Edit</Button>
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}

export default Profile