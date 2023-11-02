import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import PDLongLogo from '../../assets/images/transparent-PD-long-logo.png';

import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import IconButton from '@mui/material/IconButton';
import { Select, MenuItem } from '@mui/material';

/**
 * The NavBar to be used site wide and should be placed at the top of the page
 * @author Adam Logan
 * @date 2023-04-28
 */
function BasicNavBar(props:{theme:string, toggleMode:Function, backgroundColor:string, textColor:string}) {
  const options = [
    { label: "Contrast", value: "contrast" },
    { label: "Dark", value: "dark" },
    { label: "Light", value: "light" },
  ];

  return (
    <Navbar expand="lg" style={{ backgroundColor:props.backgroundColor, color:props.textColor}}>
      <Container>
        <Navbar.Brand>
            <img 
              src={PDLongLogo}  
              alt="logo"
              width="210"
              height="50"
              className="d-inline-block align-top" 
            />
          {/* <IconButton sx={{ ml: 1 }} onClick={() => props.toggleMode('light' ? 'dark' : 'light')} >
            {props.theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton> */}
          <Select
            sx={{marginLeft:'10px'}}
            value={props.theme}
            onChange={(e) => props.toggleMode(e.target.value)}
          >
            {options.map((option, index) => 
              <MenuItem key={index} value={option.value}>
                {option.label}
              </MenuItem>
            )}
          </Select>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
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
      </Container>
    </Navbar>
  );
}

export default BasicNavBar;