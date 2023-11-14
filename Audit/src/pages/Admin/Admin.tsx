import { useNavigate } from 'react-router-dom';

import { Avatar, Box, Button, Container, Typography } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

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
          Admin Page
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
