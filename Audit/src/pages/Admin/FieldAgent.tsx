import { Link } from 'react-router-dom';
import BasicNavBar from '../../components/NavBar/NavBar';
import PButton from '../../components/PButton/PButton';

import '../../shared/layout.css';
import './Admin.css';

function FieldAgent() {
  return (
    <div id='fieldAgent' className='wrapper'>
      <BasicNavBar />
      <div className='content'>
        <h1>Field Agent Page</h1>
        <div className='button-container'>
          <Link to='/fieldAgent'>
            <PButton text='Reset a PICU account password' primaryColour='#025858' secondaryColour='#013e3e' width='100%' />
          </Link>
          <PButton text='View Compliance Data' primaryColour='#025858' secondaryColour='#013e3e' width='100%' />
        </div>
        <Link to='/'>
          <PButton text='Home' primaryColour='#025858' secondaryColour='#013e3e' width='100%' />
        </Link>
      </div>
    </div>
  );
}

export default FieldAgent;
