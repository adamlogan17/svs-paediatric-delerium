import { useRef } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useState } from "react";
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import PasswordTextField from '../../components/PasswordTextField/PasswordTextField';
import PageContainer from '../../components/PageContainer/PageContainer';
import Captcha from '../../components/Cpatcha/Captcha';

/**
 * Encrypts the text using a Caesar Cipher.
 * 
 * Only used due to the fact that HTTP can only be used on Charles' server, although code to implement HTTPS is present, within the backend code. 
 * 
 * A flag of 'cc' is added to allow the backend to know that the text has been encrypted. 
 * 
 * @author Adam Logan
 * @param {string} plainText - The text to encrypt
 * @returns - The encrypted text
 */
function caesarCipher(plainText:string):string {
  const shift:number = plainText.length % 26 + 1;
  const cipher:string =  plainText.split('').map(char => {
    const charCode = char.charCodeAt(0);
    if (charCode >= 65 && charCode <= 90) {
      // Uppercase letters
      return String.fromCharCode((charCode - 65 + shift + 26) % 26 + 65);
    } else if (charCode >= 97 && charCode <= 122) {
      // Lowercase letters
      return String.fromCharCode((charCode - 97 + shift + 26) % 26 + 97);
    } else {
      // Non-letter characters
      return char;
    }
  }).join('');

  return "cc" + cipher;
}

/**
 * This is the 'SignIn' template from {@link https://mui.com/material-ui/getting-started/templates/}[here]
 * 
 * @author Adam Logan
 * @component
 * @function SignIn
 * 
 * @returns {JSX.Element} - Rendered component.
 * 
 * @todo Add a media query to the Box component to make the TextFields the same size, no matter how many is in them.
 * @todo Change the email, to reset the password
 */
export default function SignIn() {
  const [incorrectDetails, setIncorrectDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const captchaRef = useRef<any>(null); // need to debug issue with type

  function storeUserDetails(username:string, role:string, token:string):void {
    sessionStorage.setItem("TOKEN", token); 
    sessionStorage.setItem("ROLE", role);
    sessionStorage.setItem("USERNAME", username);
  
    // redirects the user depending on role
    if(role === "admin") {
      window.location.href = "/admin";
    } else if (role === "field_engineer") {
      window.location.href = "/field-engineer";
    }
    else if (role === "picu") {
      window.location.href = "/";
    }
  }

  /**
   * Handles form submission.
   * Sends a POST request with user credentials for authentication.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const data:FormData = new FormData(event.currentTarget);
    const username:FormDataEntryValue|null  = data.get('username');
    const password:FormDataEntryValue|null  = data.get('password');

    let validUsername:string = "";
    let role:string = "";
    let jwtToken:string = "";

    if(captchaRef === null || captchaRef.current === undefined) {
      enqueueSnackbar("no login in!", { variant: "error" });
      setIsLoading(false);
      return;
    }

    const token = captchaRef.current.getValue();
    captchaRef.current.reset();

    const loginConfig = {
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/login`, 
      data: {
        username: username,
        password: caesarCipher(String(password)),
      }
    };

    try {
      const loginResult = await axios(loginConfig);
      console.log(loginResult);
      if(loginResult.data.token === undefined) {
        setIncorrectDetails(true);
        setIsLoading(false);
        return;
      } else {
        validUsername = loginResult.data.username;
        role = loginResult.data.role;
        jwtToken = loginResult.data.token;
      }
    } catch (error:any) {
      setIsLoading(false);
      if(error.response.status === 401) {
        setIncorrectDetails(true);
      }
      enqueueSnackbar("System Error", { variant: "error" });
      return;
    }

    const captchaConfig = {
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/verify-captcha`, 
      data: {
        token: token
      }
    }

    // using the await keyword, ensures this is called before the next request
    try {
      const captchaResult = await axios(captchaConfig);
      if(!captchaResult.data.success) {
        enqueueSnackbar("Please complete the captcha", { variant: "error" });
      } else {
        storeUserDetails(validUsername, role, jwtToken);
      }
    } catch (error) {
      // the type cannot be set within 'catch' and therefore is cast here
      enqueueSnackbar("System Error", { variant: "error" })
    } finally {
      setIsLoading(false);
    }

  }

  return (
    <PageContainer title="Sign In" loading={isLoading} icon={<LockOutlinedIcon />}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="PICU ID"
          name="username"
          error = {incorrectDetails}
        />

        <PasswordTextField id="password" error={incorrectDetails} helperText={incorrectDetails ? "Incorrect Username or Password" : "" } label="Password" />

        <br />
        <Captcha captchaRef={captchaRef} />
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In
        </Button>
        <Grid container>
          <Grid item xs>
            <Link href="mailto:alogan20@qub.ac.uk" variant="body2">
              Forgot password? Ask for a reset
            </Link>
          </Grid>
          <Grid item>
            <Link href="mailto:alogan20@qub.ac.uk" variant="body2">
              Email us, to sign up
            </Link>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
}