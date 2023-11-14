import { Link, useNavigate } from 'react-router-dom';

import '../../shared/layout.css';
import '../../shared/landing.css';
import { adminAuth } from '../Admin/Admin';
import axios from 'axios';


/**
 * Checks if the current user as the role of 'field_engineer' and if so sends an alert to the user
 * @author Adam Logan
 * @date 2023-04-28
 */
export function fieldAuth() {
  const configuration = {
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/test-auth/field-engineer`,
      headers: { 'Authorization': "bearer " + sessionStorage.getItem('TOKEN') } 
  };
  
  // make the API call
  axios(configuration)
      .then((result) => {
          alert(result.data);
      })
      .catch((error) => error = new Error());
}

function FieldEngineer() {
  const navigate = useNavigate();

  return (
    <div id='fieldEngineer' className='wrapper'>
      <div className='content'>
        <h1>Field Agent Page</h1>
        {/* <div className='button-container'>
          <PButton text='Reset a PICU account password' primaryColour='#025858' secondaryColour='#013e3e' width='100%' onButtonClick={() => navigate("/forgot-password")} />
          <PButton text='View Compliance Data' primaryColour='#025858' secondaryColour='#013e3e' width='100%' onButtonClick={() => fieldAuth()} />
          <PButton text='Top Secret Admin Button' primaryColour='#025858' secondaryColour='#013e3e' width='100%' onButtonClick={() => adminAuth()} />
        </div>
        <Link to='/'>
          <PButton text='Home' primaryColour='#025858' secondaryColour='#013e3e' width='100%' />
        </Link> */}
      </div>
    </div>
  );
}

export default FieldEngineer;
