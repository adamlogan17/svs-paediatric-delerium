import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import PDLongLogo from '../../assets/images/transparent-PD-long-logo.png';

import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import IconButton from '@mui/material/IconButton';

/**
 * The NavBar to be used site wide and should be placed at the top of the page
 * @author Adam Logan
 * @date 2023-04-28
 */
function BasicNavBar({props}:any) {
  return (
    <Navbar bg={props.mode} expand="lg">
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

            <IconButton sx={{ ml: 1 }} onClick={() => props.toggleMode()} >
              {props.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BasicNavBar;