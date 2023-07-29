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


/**
 * This is the 'SignIn' template from {@link https://mui.com/material-ui/getting-started/templates/}[here]
 * 
 * @author Adam Logan
 * @component
 * @function SignIn
 * @returns {JSX.Element} - Rendered component.
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
    setIsLoading(true);
    const data = new FormData(event.currentTarget);
    const username = data.get('username');
    const password = data.get('password');

    const configuration = {
      method: "post",
      url: "https://localhost:8000/login", 
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
          setIncorrectDetails(true);
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
        setIsLoading(false);
      })
      .catch((error) => error = new Error());
  }

  return (
      <Container  maxWidth="xl">
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
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="PICU ID"
              name="username"
              error = {incorrectDetails}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              error = {incorrectDetails}
              helperText = {incorrectDetails ? "Incorrect Username or Password" : "" }
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