import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import PDLongLogo from '../../assets/images/transparent-PD-long-logo.png';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import IconButton from '@mui/material/IconButton';
import { Select, MenuItem, Container } from '@mui/material';
import BorderColor from '@mui/icons-material/BorderColor';

/**
 * The NavBar to be used site wide and should be placed at the top of the page
 * @author Adam Logan
 * @date 2023-04-28*/

function BasicNavBar(props:{theme:string, toggleMode:Function, backgroundColor:string, textColor:string, buttonColor:string, modeOptions:{label:string, value:string}[]}) {
  return (
    <Container>
    <Navbar expand="lg" style={{ backgroundColor:props.backgroundColor, color:props.textColor}}>
        <Navbar.Brand>
            <img 
              src={PDLongLogo}  
              alt="logo"
              width="210"
              height="50"
              className="d-inline-block align-top" 
            />
          <Select
            sx={{marginLeft:'10px'}}
            value={props.theme}
            onChange={(e) => props.toggleMode(e.target.value)}
          >
            {props.modeOptions.map((option, index) => 
              <MenuItem key={index} value={option.value}>
                {option.label}
              </MenuItem>
            )}
          </Select>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" style={{backgroundColor: props.buttonColor}} />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto" >
            <Nav.Link href="#home" style={{color:'inherit'}}>Background</Nav.Link>
            <Nav.Link href="#home" style={{color:'inherit'}}>Team</Nav.Link>
            <Nav.Link href="#home" style={{color:'inherit'}}>How to use the Audit System</Nav.Link>
            <Nav.Link href="#home" style={{color:'inherit'}}>Contact us</Nav.Link>
            <Nav.Link href="/" style={{color:'inherit'}}>Home</Nav.Link>
            <Nav.Link href="/login" style={{color:'inherit'}}>Login</Nav.Link>
          </Nav>
        </Navbar.Collapse>
    </Navbar>
    </Container>
  );
}
export default BasicNavBar;