import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { useState } from 'react';
import {
   MDBNavbar,
   MDBContainer,
   MDBIcon,
   MDBNavbarNav,
   MDBNavbarItem,
   MDBNavbarLink,
   MDBNavbarToggler,
   MDBNavbarBrand,
   MDBCollapse
 } from 'mdb-react-ui-kit';
import PDLongLogo from '../../assets/images/transparent-PD-long-logo.png';
import { Select, MenuItem } from '@mui/material';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import IconButton from '@mui/material/IconButton';
import { Paper } from '@mui/material';
import { text } from 'stream/consumers';

/**
 * The NavBar to be used site wide and should be placed at the top of the page
 * @author Adam Logan
 * @date 2023-04-28
 */
export default function Navbar(props:{theme:string, toggleMode:Function, backgroundColor:string, textColor:string}) {
     const [showNav, setShowNav] = useState(false);
     const [showNavColor, setShowNavColor] = useState(false);
     const options = [
       { label: "Contrast", value: "contrast" },
       { label: "Dark", value: "dark" },
       { label: "Light", value: "light" },
     ];

     return (
           <div>
             <Paper sx={{ borderRadius:'0px' }}>
               <MDBNavbar dark expand='lg'>
            
                 <MDBContainer >
                   <MDBNavbarBrand>
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
                   {options.map((option, index) => 
                     <MenuItem key={index} value={option.value}>
                       {option.label}
                     </MenuItem>
                   )}
                 </Select>
                   </MDBNavbarBrand >
              
                   <MDBNavbarToggler  style={{borderColor: props.textColor}}
                   onClick={() => setShowNav(!showNav)}>
                     <MDBIcon icon= 'bars'  fas />
                   </MDBNavbarToggler>
  
                   <MDBCollapse navbar show={showNav} >
                     <MDBNavbarNav  style={{ justifyContent:'right' }}>
                       <MDBNavbarItem>
                       <MDBNavbarLink style={{color:'inherit'}} href="#home" onClick={() => setShowNav(!showNav)}>Background</MDBNavbarLink>
                       </MDBNavbarItem>
  
                       <MDBNavbarItem>
                         <MDBNavbarLink style={{color:'inherit'}} href='#home' onClick={() => setShowNav(!showNav)}>Team</MDBNavbarLink>
                       </MDBNavbarItem>
  
                       <MDBNavbarItem>
                         <MDBNavbarLink style={{color:'inherit'}} href='#home' onClick={() => setShowNav(!showNav)}>How to Use</MDBNavbarLink>
                       </MDBNavbarItem>
                  
                       <MDBNavbarItem>
                         <MDBNavbarLink style={{color:'inherit'}} href='#home'  onClick={() => setShowNav(!showNav)}>Contact Us</MDBNavbarLink>
                       </MDBNavbarItem>
  
                       <MDBNavbarItem>
                         <MDBNavbarLink style={{color:'inherit'}} href='/'  onClick={() => setShowNav(!showNav)}>Home</MDBNavbarLink>
                       </MDBNavbarItem>
  
                       <MDBNavbarItem>
                         <MDBNavbarLink style={{color:'inherit'}} href='/login'  onClick={() => setShowNav(!showNav)}>Log in</MDBNavbarLink>
                       </MDBNavbarItem>
                     </MDBNavbarNav>
                   </MDBCollapse>
                 </MDBContainer>
               </MDBNavbar>
             </Paper>
       
           </div>
      
         );
       }
