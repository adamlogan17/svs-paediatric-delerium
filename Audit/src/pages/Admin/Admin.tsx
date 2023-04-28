import { Link } from 'react-router-dom';
import BasicNavBar from '../../components/NavBar/NavBar';
import PButton from '../../components/PButton/PButton';

import '../../shared/layout.css';
import '../../shared/landing.css';
import axios from 'axios';

/**
 * Checks if the current user as the role of 'admin' and if so sends an alert to the user
 * @author Adam Logan
 * @date 2023-04-28
 */
export function adminAuth() {
  const configuration = {
      method: "get",
      url: "http://localhost:8000/test-auth/admin",
      headers: { 'Authorization': "bearer " + sessionStorage.getItem('TOKEN') } 
  };
  
  // make the API call
  axios(configuration)
      .then((result) => {
          alert(result.data);
      })
      .catch((error) => error = new Error());
}

function Admin() {
  return (
    <div id='admin' className='wrapper'>
      <BasicNavBar />
      <div className='content'>
        <h1>Admin Page</h1>
        <div className='button-container'>
          <PButton text='Reset a PICU account password' primaryColour='#025858' secondaryColour='#013e3e' width='100%' onButtonClick={() => adminAuth()}/>
          <PButton text='View / Edit Compliance Data' primaryColour='#025858' secondaryColour='#013e3e' width='100%' onButtonClick={() => adminAuth()}/>
          <PButton text='Admin Audit Log' primaryColour='#025858' secondaryColour='#013e3e'  width='100%' onButtonClick={() => adminAuth()} />
        </div>
        <Link to='/'>
          <PButton text='Home' primaryColour='#025858' secondaryColour='#013e3e' width='100%' onButtonClick={() => window.location.href = "/"}/>
        </Link>
      </div>
    </div>
  );
}

export default Admin;
