import { Link } from 'react-router-dom';
import BasicNavBar from '../../components/NavBar/NavBar';
import PButton from '../../components/PButton/PButton';
import TypeDropDown from '../../components/TypeDropDown/TypeDropDown';
import { useRef } from 'react';

import '../../shared/layout.css';
import './Admin.css';

function AdminPassword() {
    const passwordRef = useRef<HTMLInputElement>(null);
    const repasswordRef = useRef<HTMLInputElement>(null);

    function handleButtonClick(): void {
        const password = passwordRef.current?.value;
        const repassword = repasswordRef.current?.value;

        console.log("Password: ", password);
        console.log("Re-entered Password: ", repassword);
    }

    return (
        <div id='admin' className='wrapper'>
            <BasicNavBar />
            <div className='content'>
                <h1>Password Reset</h1>
                <div className='select-container'>
                    <h5>Select your PICU number from this list: </h5>
                    <TypeDropDown
                        text='Site Number'
                        primaryColour='#025858'
                        secondaryColour='#013e3e'
                        options={Array.from({ length: 29 }, (_, i) => ('s' + (i + 1)).toString())}
                    />
                </div>

                <div className='data-input'>
                    <label htmlFor='username'>Password:</label>
                    <input id='username' className='entry' type='text' name='username' ref={passwordRef} />
                    <br />

                    <label htmlFor='password'>Re-enter password:</label>
                    <input id='password' className='entry' type='password' name='password' ref={repasswordRef} />
                    <br />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <PButton text='Reset Password' primaryColour='#025858' secondaryColour='#013e3e' width='200px' onButtonClick={handleButtonClick} />
                    <Link to='/'>
                        <PButton text='Home' primaryColour='#025858' secondaryColour='#013e3e' width='200px' />
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default AdminPassword;
