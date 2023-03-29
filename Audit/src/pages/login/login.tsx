import BasicNavBar from '../../components/NavBar/NavBar';
import HeadingText from '../../components/HeadingText/HeadingText'
import BodyText from '../../components/BodyText/BodyText'
import PButton from '../../components/PButton/PButton'
import ContactInfo from '../../components/ContactInfo/ContactInfo'

function Login() {
  return (
        <div className='wrapper'>
            <BasicNavBar />
            
            <div className = 'content'>
                <h1>Login</h1>
            </div>
        </div>
  );
}

export default Login;
