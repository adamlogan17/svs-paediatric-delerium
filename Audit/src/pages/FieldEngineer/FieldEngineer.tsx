import { Link } from 'react-router-dom';
import BasicNavBar from '../../components/NavBar/NavBar';
import PButton from '../../components/PButton/PButton';

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
      url: "http://localhost:8000/test-auth/field-engineer",
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
  return (
    <div id='fieldEngineer' className='wrapper'>
      <BasicNavBar />
      <div className='content'>
        <h1>Field Agent Page</h1>
        <div className='button-container'>
          <PButton text='Reset a PICU account password' primaryColour='#025858' secondaryColour='#013e3e' width='100%' onButtonClick={() => fieldAuth()} />
          <PButton text='View Compliance Data' primaryColour='#025858' secondaryColour='#013e3e' width='100%' onButtonClick={() => fieldAuth()} />
          <PButton text='Top Secret Admin Button' primaryColour='#025858' secondaryColour='#013e3e' width='100%' onButtonClick={() => adminAuth()} />
        </div>
        <Link to='/'>
          <PButton text='Home' primaryColour='#025858' secondaryColour='#013e3e' width='100%' />
        </Link>
      </div>
    </div>
  );
}

export default FieldEngineer;
