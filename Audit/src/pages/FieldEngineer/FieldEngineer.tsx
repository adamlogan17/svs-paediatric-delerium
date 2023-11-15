import { useNavigate } from 'react-router-dom';
import EngineeringIcon from '@mui/icons-material/Engineering';
import { Avatar, Box, Button, Container, Typography } from '@mui/material';

/**
 * 
 * @todo ensure that the buttons look appropriate for all screen sizes
 */
function FieldEngineer() {
  const navigate = useNavigate();

  const buttonStyle = { mt: 3, mb: 2, width:'500px' };

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
          <EngineeringIcon />
        </Avatar>

        <Typography component="h1" variant="h5">
          Field Engineer Page
        </Typography>

        <Button 
          onClick={() => navigate('/forgot-password')} 
          sx={buttonStyle}
          variant="contained"
        >
          Forgotten Password
        </Button>
      </Box>
    </Container>
  );
}

export default FieldEngineer;
