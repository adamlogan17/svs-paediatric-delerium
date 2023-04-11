import BasicNavBar from '../../components/NavBar/NavBar';
import PButton from '../../components/PButton/PButton';
import React, { useRef } from 'react';

import '../../shared/layout.css';
import './login.css';

function Login() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        console.log(`Username: ${username}, Password: ${password}`);
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
