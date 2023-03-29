import BasicNavBar from '../../components/NavBar/NavBar';
import PButton from '../../components/PButton/PButton';
import TypeDropDown from '../../components/TypeDropDown/TypeDropDown';

import '../../shared/layout.css';
import './login.css'

function Login() {
  return (
        <div id='login' className='wrapper'>
            <BasicNavBar />
            
            <div className = 'content'>
                <h1>Please Login</h1>
                <br />

                <form action="" method="get">
                    <div className="data-input">
                        <TypeDropDown />
                        <br />

                        <label htmlFor="password">Password:</label>
                        <input id="password" className="entry" type="text" name="password"/>
                        <br />
                    </div>
                    <PButton text="Start" primaryColour='#025858' secondaryColour='#013e3e'/>
                </form>
            </div>
        </div>
  );
}

export default Login;
