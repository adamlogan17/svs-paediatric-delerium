import BasicNavBar from '../../components/NavBar/NavBar';
import PButton from '../../components/PButton/PButton';
import axios from 'axios';

import '../../shared/layout.css';
import './login.css';
import { useRef } from 'react';

/**
 * Calls the 'login' API and, if successful, sets the role, username and JWT token in session storage
 * @author Adam Logan
 * @date 2023-04-28
 * @param { string|undefined } username The username provided
 * @param { string|undefined } password The password provided
 * @returns { void }
 */
function authenticateUser(username:string|undefined, password:string|undefined):void {
    const configuration = {
        method: "post",
        url: "http://localhost:8000/login", 
        data: {
                username: username,
                password: password
            }
    };
    
    // make the API call
    axios(configuration)
        .then((result) => {
            // sets the cookies
            sessionStorage.setItem("TOKEN", result.data.token);
            sessionStorage.setItem("ROLE", result.data.role);
            sessionStorage.setItem("SITE", result.data.username);

            if(result.data.token === undefined) {
                alert("Invalid username or password");
            } else {
                alert("Logged in as " + result.data.username + " with the role of " + result.data.role);
                // redirects the user depending on role
                if(result.data.role === "admin") {
                    window.location.href = "/admin";
                } else if (result.data.role === "field_engineer") {
                    window.location.href = "/fieldengineer";
                }
                else if (result.data.role === "picu") {
                    window.location.href = "/";
                }

            }
        })
        .catch((error) => error = new Error());
}


/**
 * This is the login page which, depending on the user's role redirects them to a different page
 * @author Adam Logan
 * @date 2023-04-28
 */
function Login() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    
    function handleButtonClick():void {
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        authenticateUser(username, password);
    };

    return (
        <div id='login' className='wrapper'>
        <BasicNavBar />
        <div className='content'>
            <h1>Please Login</h1>
            <br />

            <div className='data-input'>
                <label htmlFor='username'>Username:</label>
                <input id='username' className='entry' type='text' name='username' ref={usernameRef} />
                <br />

                <label htmlFor='password'>Password:</label>
                <input id='password' className='entry' type='password' name='password' ref={passwordRef} />
                <br />
            </div>
            <PButton text='Login' primaryColour='#025858' secondaryColour='#013e3e' onButtonClick={handleButtonClick} />
        </div>
    </div>

    );
}

export default Login;
