import { useNavigate } from 'react-router-dom';

import { Button } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PageContainer from '../../components/PageContainer/PageContainer';

/**
 * 
 * @todo ensure that the buttons look appropriate for all screen sizes
 */
function Admin() {
  const buttonStyle = { mt: 3, mb: 2, width:'500px' };

  const navigate = useNavigate();

  return (
    <PageContainer title="Admin" icon={<AdminPanelSettingsIcon />}>
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
    </PageContainer>
  );
}

export default Admin;
