import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'

function App() {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>Foursight</Navbar.Brand>
        </Container>
      </Navbar>

      <Container className="py-5">
        <h1 className="mb-3">Foursight</h1>
        <p className="mb-4">Bootstrap is connected.</p>
        <Button variant="primary">Test Button</Button>
      </Container>
    </>
  )
}

export default App