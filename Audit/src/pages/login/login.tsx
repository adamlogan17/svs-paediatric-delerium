import BasicNavBar from '../../components/NavBar/NavBar';
import PButton from '../../components/PButton/PButton';

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
                        <label htmlFor="username">PICU Site Number:</label>
                        <input id="username" className="entry" type="text" name="username"/>
                        <br />

                        <label htmlFor="password">Password:</label>
                        <input id="password" className="entry" type="text" name="password"/>
                        <br />
                    </div>
                    <PButton text="Start"/>
                </form>
            </div>
        </div>
  );
}

export default Login;
