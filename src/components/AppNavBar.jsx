import { Navbar, Container, Nav, NavDropdown, Form, FormControl } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import './AppNavBar.css'

// Inline SVG default — works offline, no external request needed
const DEFAULT_AVATAR = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23e8d5dc'/%3E%3Ccircle cx='20' cy='16' r='7' fill='%23c49aac'/%3E%3Cellipse cx='20' cy='36' rx='12' ry='9' fill='%23c49aac'/%3E%3C/svg%3E`

function AppNavbar({ session, profile, avatarUrl, handleLogout, searchQuery, setSearchQuery }) {
    const location = useLocation()

    return (
        <Navbar
            expand="lg"
            style={{
                background: 'linear-gradient(135deg, #d88fa3, #8fb7d9)',
                boxShadow: '0 10px 24px rgba(143, 183, 217, 0.25)'
            }}
        >
            <Container>
                <Navbar.Brand
                    as={Link}
                    to="/"
                    style={{ color: '#fff', fontWeight: '700' }}
                >
                    ForHer
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="main-navbar" />

                <Navbar.Collapse id="main-navbar">
                    <Nav className="me-auto">
                        {session && location.pathname === '/dashboard' && (
                            <Form className="d-flex">
                                <FormControl
                                    type="search"
                                    placeholder="Search opportunities..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        borderRadius: '12px',
                                        border: 'none',
                                        width: '250px'
                                    }}
                                />
                            </Form>
                        )}
                    </Nav>

                    <Nav className="ms-auto align-items-center">
                        {!session ? (
                            <>
                                <Nav.Link as={Link} to="/login" className="navbar-link-custom">Login</Nav.Link>
                                <Nav.Link as={Link} to="/signup" className="navbar-link-custom">Signup</Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link
                                    as={Link}
                                    to="/dashboard"
                                    className={`navbar-link-custom${location.pathname === '/dashboard' ? ' active-link' : ''}`}
                                >
                                    Dashboard
                                </Nav.Link>

                                <NavDropdown
                                    align="end"
                                    className="navbar-profile-dropdown"
                                    title={
                                        <span className="navbar-profile-title">
                                            <img
                                                src={avatarUrl || DEFAULT_AVATAR}
                                                alt="avatar"
                                                className="navbar-profile-avatar"
                                                onError={(e) => { e.currentTarget.src = DEFAULT_AVATAR }}
                                            />
                                            <span className="navbar-profile-name">
                                                {profile?.name || 'User'}
                                            </span>
                                        </span>
                                    }
                                >
                                    <NavDropdown.Item as={Link} to="/profile">
                                        Profile
                                    </NavDropdown.Item>
                                    <NavDropdown.Item onClick={handleLogout}>
                                        Log Out
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default AppNavbar