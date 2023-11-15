import { Link, useNavigate } from 'react-router-dom';
import PButton from '../../components/PButton/PButton';

import '../../shared/layout.css';
import '../../shared/landing.css';
import axios from 'axios';
import { exec } from 'child_process';



/**
 * Checks if the current user as the role of 'admin' and if so sends an alert to the user
 * @author Adam Logan
 * @date 2023-04-28
 * TODO Change the 'Link' component to a MUI link component
 */

function backupData() {
  const command = `pg_dump -U postgres -d backup -t picu_backup -t api_log_backup -t compliance_data_backup > backup.sql`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
}

export function adminAuth() {  
  const configuration = {
    method: "get",
    url: `${process.env.REACT_APP_API_URL}/test-auth/admin`,
    headers: { 'Authorization': "bearer " + sessionStorage.getItem('TOKEN') } 
  };
  
  axios(configuration)
    .then((result) => {
      alert(result.data);
    })
    .catch((error) => error = new Error());
}

function Admin() {
  const navigate = useNavigate();

  return (
    <div id='admin' className='wrapper'>
      <div className='content'>
        <h1>Admin Page</h1>
        <div className='button-container'>
        <PButton text='Add a PICU' primaryColour='#025858' secondaryColour='#013e3e' width='100%' onButtonClick={() => navigate("/add-picu")}/>
          <PButton text='Reset a PICU account password' primaryColour='#025858' secondaryColour='#013e3e' width='100%' onButtonClick={() => navigate("/forgot-password")}/>
          <PButton text='View / Edit Compliance Data' primaryColour='#025858' secondaryColour='#013e3e' width='100%' onButtonClick={() => adminAuth()}/>
          <PButton text='Admin Audit Log' primaryColour='#025858' secondaryColour='#013e3e'  width='100%' onButtonClick={() => navigate("/audit-log")}/>
          <PButton text='Backup Data' primaryColour='#025858' secondaryColour='#013e3e' width='100%' onButtonClick={() => {backupData}}/>
          <PButton text='Restore Data' primaryColour='#025858' secondaryColour='#013e3e' width='100%' onButtonClick={() => {/* Add your restore function here */}}/>
        </div>
        <Link to='/'>
          <PButton text='Home' primaryColour='#025858' secondaryColour='#013e3e' width='100%' onButtonClick={() => window.location.href = "/"}/>
        </Link>
      </div>
    </div>
  );
}

export default Admin;
