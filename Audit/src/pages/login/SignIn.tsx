import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from 'axios';
import PageLoad from '../../components/Loading/PageLoad';
import { enqueueSnackbar } from 'notistack';
import PasswordTextField from '../../components/PasswordTextField/PasswordTextField';


/**
 * This is the 'SignIn' template from {@link https://mui.com/material-ui/getting-started/templates/}[here]
 * 
 * @author Adam Logan
 * @component
 * @function SignIn
 * 
 * @returns {JSX.Element} - Rendered component.
 * 
 * TODO Add a media query to the Box component to make the TextFields the same size, no matter how many is in them.
 */
export default function SignIn() {
  const navigate = useNavigate();
  const [incorrectDetails, setIncorrectDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles form submission.
   * Sends a POST request with user credentials for authentication.
   * Navigates to the MFA login page if authenticated, otherwise displays an error alert.
   */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // setIsLoading(true);
    const data = new FormData(event.currentTarget);
    const username = data.get('username');
    const password = data.get('password');

    console.log("password", password);
    console.log("username", username);


    const configuration = {
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/login`, 
      data: {
        username: username,
        password: password
      }
    };
    
    axios(configuration)
      .then((result) => {
        // sets the cookies
        sessionStorage.setItem("TOKEN", result.data.token);
        sessionStorage.setItem("ROLE", result.data.role);
        sessionStorage.setItem("SITE", result.data.username);

        if(result.data.token === undefined) {
          setIncorrectDetails(true);
        } else {
          // redirects the user depending on role
          if(result.data.role === "admin") {
            navigate("/admin");
            navigate(0);
          } else if (result.data.role === "field_engineer") {
            navigate("/fieldengineer");
            navigate(0);
          }
          else if (result.data.role === "picu") {
            navigate("/");
            navigate(0);
          }
        }
        setIsLoading(false);
      })
      .catch((error) => enqueueSnackbar(error.message, { variant: "error" }));
  }

  return (
    <Container component="main" maxWidth="xl" sx={{backgroundColor:'aqua'}}>
      <PageLoad loading={isLoading} />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor:'brown'
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
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/test-sign-up" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}