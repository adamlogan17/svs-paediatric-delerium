import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import PDLongLogo from '../../assets/images/transparent-PD-long-logo.png';

/**
 * The NavBar to be used site wide and should be placed at the top of the page
 * @author Adam Logan
 * @date 2023-04-28
 */
function BasicNavBar() {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home">
            <img src={PDLongLogo}  
            alt="logo"
            width="210"
            height="50"
            className="d-inline-block align-top" />        
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Background</Nav.Link>
            <Nav.Link href="#home">Team</Nav.Link>
            <Nav.Link href="#home">How to use the Audit System</Nav.Link>
            <Nav.Link href="#home">Contact us</Nav.Link>
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/login">Login</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BasicNavBar;