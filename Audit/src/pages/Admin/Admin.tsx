import { Link } from 'react-router-dom';
import BasicNavBar from '../../components/NavBar/NavBar';
import PButton from '../../components/PButton/PButton';

import '../../shared/layout.css';
import './Admin.css';

function Admin() {
  return (
    <div id='admin' className='wrapper'>
      <BasicNavBar />
      <div className='content'>
        <h1>Admin Page</h1>
        <div className='button-container'>
          <Link to='/adminpassword'>
            <PButton text='Reset a PICU account password' primaryColour='#025858' secondaryColour='#013e3e' width='100%' />
          </Link>
          <PButton text='View / Edit Compliance Data' primaryColour='#025858' secondaryColour='#013e3e' width='100%' />
          <PButton text='Admin Audit Log' primaryColour='#025858' secondaryColour='#013e3e'  width='100%' />
        </div>
        <Link to='/'>
          <PButton text='Home' primaryColour='#025858' secondaryColour='#013e3e' width='100%' />
        </Link>
      </div>
    </div>
  );
}

export default Admin;
