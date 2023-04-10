import BasicNavBar from '../../components/NavBar/NavBar';
import PButton from '../../components/PButton/PButton';
import TypeDropDown from '../../components/TypeDropDown/TypeDropDown';
import axios from 'axios';

import '../../shared/layout.css';
import './login.css';

function authenticateUser():void {
    const configuration = {
        method: "get",
        url: "http://localhost:8000/login/21/pass1"
    };
    
    // make the API call
    axios(configuration)
        .then((result) => {
            // sets the cookies
            sessionStorage.setItem("TOKEN", result.data.token);
            sessionStorage.setItem("ROLE", result.data.role);

            // redirect user to another page
            window.location.href = "/";
        })
        .catch((error) => error = new Error());
}

function Login() {
    return (
        <div id='login' className='wrapper'>
            <BasicNavBar />
            
            <div className = 'content'>
                <h1>Please Login</h1>
                <br />

                <form action="" method="get">
                    <div className="data-input">
                        <TypeDropDown text="Site Number" primaryColour='#025858' secondaryColour='#013e3e' options={["hello", "world"]}/>
                        <br />

                        <label htmlFor="password">Password:</label>
                        <input id="password" className="entry" type="text" name="password"/>
                        <br />
                    </div>
                    <PButton text="Start" primaryColour='#025858' secondaryColour='#013e3e' onButtonClick={()=>authenticateUser()} />
                </form>
            </div>
        </div>
    );
}

export default Login;
