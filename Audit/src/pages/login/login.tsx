import BasicNavBar from '../../components/NavBar/NavBar';
import PButton from '../../components/PButton/PButton';
import axios from 'axios';

import '../../shared/layout.css';
import './login.css';
import { useRef } from 'react';

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
                if(result.data.username === "24") {
                    window.location.href = "/admin"
                }//else if (result.data.username = 25) {

                //}
                else {
                    window.location.href = "/"
                }

            }
        })
        .catch((error) => error = new Error());
}


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
            <PButton text='Start' primaryColour='#025858' secondaryColour='#013e3e' onButtonClick={handleButtonClick} />
        </div>
    </div>

    );
}

export default Login;
