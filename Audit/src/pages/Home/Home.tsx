import { useNavigate } from 'react-router-dom';

import '../../shared/layout.css';
import { Button } from '@mui/material';

/**
 * This is the landing page of the site
 * @author Adam Logan
 * @date 2023-04-28
 */

function Home() {
  const navigate = useNavigate();
  return (
    <div id='home' className='wrapper'>
      <div className = 'content'>
        <div className = 'row' id = 'UpperTextContainer'>
          <h2>
            <u>Audit & Feedback</u>
          </h2>
          <p>
            <strong>
              Thank you for your interest in auditing the delirium screening practice in your unit. 
              We have developed audit tools to accommodate units who use either the CAPD or SOSPD 
              screening tools. Please follow the link to access and download the audit material most 
              appropriate to your unit.
            </strong>
          </p>
        </div>

        <div className = 'row' id = 'ButtonContainer'>
          <div className = 'half-column' id = 'SOSPD-ButtonColumn'>
            <Button 
              variant="contained"
              onClick={() => navigate('/form', { state: { method: 'SOSPD' }})}
            >
              SOSPD Audit Section
            </Button>
          </div>

          <div className = 'half-column' id = 'CAPD-ButtonColumn'>
            <Button 
              variant="contained"
              onClick={() => navigate('/form', { state: { method: 'CAPD' }})}
            >
              CAPD Audit Section
            </Button>
          </div>
        </div>

        <br />
        <div className = 'row' id = 'ContactInfoContainer'>
          <h3>The Welcome-Wolfson Institute for Experimental Medicine</h3>
          <p>
            School of Medicine, Dentistry and Biomedical Sciences<br></br>
            Queen's University Belfast<br></br>
            97 Lisburn Road Belfast<br></br>
            BT9 7BL
          </p>

          <p>
              Tel: (+44) 028 9097 1643
          </p>
          <p>
              Web: <a href = 'https://www.qub.ac.uk/sites/uk-paediatric-delirium-group/'>UK Paediatric Delirium Group</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
