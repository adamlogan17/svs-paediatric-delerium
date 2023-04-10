import BasicNavBar from '../../components/NavBar/NavBar';
import PButton from '../../components/PButton/PButton';
import TypeDropDown from '../../components/TypeDropDown/TypeDropDown';
import Cookies from "universal-cookie";
import axios from 'axios';

import '../../shared/layout.css';
import './login.css';

function authenticateUser():void {
    const cookies:Cookies = new Cookies();

    const configuration = {
        method: "get",
        url: "http://localhost:8000/login/21/pass1"
    };
    
    // make the API call
    axios(configuration)
        .then((result) => {
            // set the cookie
            cookies.set("TOKEN", result.data.token, {
                path: "/",
            });
            cookies.set("ROLE", result.data.role, {
                path: "/",
            });
            // redirect user to the auth page
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
