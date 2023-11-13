import { Link, useNavigate } from 'react-router-dom';

import axios from 'axios';
import { Avatar, Box, Button, Container, Typography } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

/**
 * Checks if the current user as the role of 'admin' and if so sends an alert to the user
 * @author Adam Logan
 * @date 2023-04-28
 * TODO Change the 'Link' component to a MUI link component
 */
export function adminAuth() {  
  const configuration = {
    method: "get",
    url: `${process.env.REACT_APP_API_URL}/test-auth/admin`,
    headers: { 'Authorization': "bearer " + sessionStorage.getItem('TOKEN') } 
  };
  
  axios(configuration)
    .then((result) => {
      alert(result.data);
    })
    .catch((error) => error = new Error());
}

/**
 * 
 * @todo ensure that the buttons look appropriate for all screen sizes
 */
function Admin() {
  const buttonStyle = { mt: 3, mb: 2, width:'500px' };

  const navigate = useNavigate();

  return (
    <Container component="main" maxWidth="xl">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >

        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <AdminPanelSettingsIcon />
        </Avatar>

        <Typography component="h1" variant="h5">
          Sign in
        </Typography>

        <Button 
          onClick={() => navigate('/add-picu')} 
          sx={buttonStyle}
          variant="contained"
        >
          Add a PICU
        </Button>

        <Button 
          onClick={() => navigate('/forgot-password')} 
          sx={buttonStyle}
          variant="contained"
        >
          Forgotten Password
        </Button>

        <Button 
          onClick={() => navigate('/edit-compliance')} 
          sx={buttonStyle}
          variant="contained"
        >
          Edit Compliance Data
        </Button>

        <Button 
          onClick={() => navigate('/edit-picus')} 
          sx={buttonStyle}
          variant="contained"
        >
          Edit PICU details
        </Button>

        <Button 
          onClick={() => navigate('/audit-log')} 
          sx={buttonStyle}
          variant="contained"
        >
          View Audit Log
        </Button>

        <Button 
          onClick={() => navigate('/audit-graphs')} 
          sx={buttonStyle}
          variant="contained"
        >
          View Graphs
        </Button>

      </Box>
    </Container>

    
  );
}

export default Admin;
