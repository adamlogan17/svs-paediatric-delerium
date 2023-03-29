import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
// import NavDropdown from 'react-bootstrap/NavDropdown';
import PDLongLogo from '../../assets/images/Paediatric Delirium Long Logo.png';

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
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#home">Background</Nav.Link>
            <Nav.Link href="#home">Team</Nav.Link>
            <Nav.Link href="#home">How to use the Audit System</Nav.Link>
            <Nav.Link href="#home">Contact us</Nav.Link>
            {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BasicNavBar;