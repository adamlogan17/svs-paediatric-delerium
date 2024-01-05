import { useNavigate } from 'react-router-dom';
import EngineeringIcon from '@mui/icons-material/Engineering';
import { Button } from '@mui/material';
import PageContainer from '../../components/PageContainer/PageContainer';

/**
 * 
 * @todo ensure that the buttons look appropriate for all screen sizes
 */
function FieldEngineer() {
  const navigate = useNavigate();

  const buttonStyle = { mt: 3, mb: 2, width:'500px' };

  return (
    <PageContainer title="Field Engineer" icon={<EngineeringIcon />}>
      <Button 
        onClick={() => navigate('/reset-password')} 
        sx={buttonStyle}
        variant="contained"
      >
        Reset Password
      </Button>
    </PageContainer>
  );
}

export default FieldEngineer;
