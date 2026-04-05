import { useState } from 'react';
import { Navbar, Container, Nav, NavDropdown, Form, FormControl } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

function AppNavbar({ session, profile, avatarUrl, handleLogout }) {
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');

    const avatarSrc = avatarUrl || 'https://www.gravatar.com/avatar/?d=mp&s=28';

    return (
        <Navbar expand="lg" style={{
            background: 'linear-gradient(135deg, #d88fa3, #8fb7d9)',
            boxShadow: '0 10px 24px rgba(143, 183, 217, 0.25)'
        }}>
            <Container>
                <Navbar.Brand as={Link} to="/" style={{ color: '#fff', fontWeight: '700' }}>
                    Foursight
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="main-navbar" />
                <Navbar.Collapse id="main-navbar">
                    <Nav className="me-auto">
                        {session && location.pathname === '/dashboard' && (
                            <Form className="d-flex">
                                <FormControl
                                    type="search"
                                    placeholder="Search opportunities..."
                                    className="me-2"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ borderRadius: '12px', border: 'none', width: '250px' }}
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
                                    className={`navbar-link-custom ${location.pathname === '/dashboard' ? 'active-link' : ''}`}
                                >
                                    Dashboard
                                </Nav.Link>

                                <NavDropdown
                                    title={
                                        <span className="navbar-profile-title">
                                            <img
                                                src={avatarSrc}
                                                alt="avatar"
                                                className="navbar-profile-avatar"
                                                style={{
                                                    width: '28px',
                                                    height: '28px',
                                                    minWidth: '28px',
                                                    minHeight: '28px',
                                                    maxWidth: '28px',
                                                    maxHeight: '28px',
                                                    borderRadius: '50%',
                                                    objectFit: 'cover',
                                                    display: 'inline-block',
                                                    flexShrink: 0,
                                                    marginRight: '8px',
                                                }}
                                            />
                                            <span className="navbar-profile-name">{profile?.name || 'User'}</span>
                                        </span>
                                    }
                                    align="end"
                                    className="navbar-profile-dropdown"
                                >
                                    <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/dashboard">Dashboard</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={handleLogout}>Log Out</NavDropdown.Item>
                                </NavDropdown>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default AppNavbar;