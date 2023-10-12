import { useEffect, useRef } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useState } from "react";
import axios from 'axios';
import PageLoad from '../../components/Loading/PageLoad';
import { enqueueSnackbar } from 'notistack';
import PasswordTextField from '../../components/PasswordTextField/PasswordTextField';
import ReCAPTCHA from "react-google-recaptcha";


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

    if(captchaRef === null || captchaRef.current === undefined) {
      enqueueSnackbar("no login in!", { variant: "error" });
      setIsLoading(false);
      return;
    }

    const token = captchaRef.current.getValue();
    captchaRef.current.reset();

    const capcthaConfig = {
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/verify-captcha`, 
      data: {
        token: token
      }
    }

    // using the await keyword, ensures this is called before the next request
    try {
      const captchaResult = await axios(capcthaConfig);
      if(!captchaResult.data.success) {
        enqueueSnackbar("Please complete the captcha", { variant: "error" });
        setIsLoading(false);
        return;
      }
    } catch (error) {
      // the type cannot be set within 'catch' and therefore is cast here
      enqueueSnackbar((error as Error).message, { variant: "error" })
      return;
    }
    

    const loginConfig = {
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/login`, 
      data: {
        username: username,
        password: password
      }
    };

    try {
      const loginResult = await axios(loginConfig);
      // sets the cookies
      sessionStorage.setItem("TOKEN", loginResult.data.token);
      sessionStorage.setItem("ROLE", loginResult.data.role);
      sessionStorage.setItem("USERNAME", loginResult.data.username);
      if(loginResult.data.token === undefined) {
        setIncorrectDetails(true);
      } else {
        // redirects the user depending on role
        if(loginResult.data.role === "admin") {
          window.location.href = "/admin";
        } else if (loginResult.data.role === "field_engineer") {
          window.location.href = "/fieldengineer";
        }
        else if (loginResult.data.role === "picu") {
          window.location.href = "/";
        }
      }
      setIsLoading(false);
    } catch (error) {
      enqueueSnackbar((error as Error).message, { variant: "error" })
    }
  }

  return (
    <Container component="main" maxWidth="xl">
      <PageLoad loading={isLoading} />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >

        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>

        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
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

          {/* @see {@link https://stackoverflow.com/questions/57639200/google-recaptcha-component-with-dynamic-theme-value-next-js} on how to change the theme without refreshing the page */}
          <ReCAPTCHA
            sitekey={process.env.REACT_APP_CAPTCHA_SITE_KEY ? process.env.REACT_APP_CAPTCHA_SITE_KEY : ""}
            ref={captchaRef}
            // onChange={(value) => {console.log("val", value)} }  // this can also be used, instead of using ref, although a state, will need to be added as well as the disadvantage of not being able to reset the captcha
          />
          
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
      </Box>
    </Container>
  );
}