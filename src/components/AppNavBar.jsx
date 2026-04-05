import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { Link, useNavigate } from 'react-router'
import { supabase } from '../supabaseClient'

function AppNavbar({ session, profile }) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg" style={{ position: 'relative' }}>
      <Container>
        {/* Left: Logo */}
        <Navbar.Brand as={Link} to="/">
          Foursight
        </Navbar.Brand>

        {/* Center: User Name */}
        {session && profile?.name && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'white',
              fontWeight: '600',
              fontSize: '1.1rem',
            }}
          >
            {profile.name}
          </div>
        )}

        <Navbar.Toggle aria-controls="main-navbar" />

        {/* Right: Links */}
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto">
            {!session ? (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/signup">Signup</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                <Nav.Link onClick={handleLogout} style={{ cursor: 'pointer' }}>
                  Log Out
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default AppNavbar