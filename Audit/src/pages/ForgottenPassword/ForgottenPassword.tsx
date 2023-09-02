import axios from 'axios';
import { Autocomplete, Avatar, Box, Button, Container, TextField, Typography } from '@mui/material';
import PasswordIcon from '@mui/icons-material/Password';

import PageLoad from '../../components/Loading/PageLoad';
import { useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { getStringValue, checkAndSetError } from '../../utility/form';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';

/**
 * `AddPicu` is a React functional component responsible for rendering a form to add a new PICU (Paediatric Intensive Care Unit) user.
 * The form captures details such as the hospital name, ward name, role, auditor, and password.
 * Once submitted, the form performs a series of validations to ensure the provided data is correct before proceeding.
 * Successful submission results in the addition of a new PICU user.
 * 
 * @function AddPicu
 * @author Adam Logan
 * @component
 * 
 */
/**
 * React component that provides an interface for resetting the password of a specific PICU.
 * It offers a form where users can input the PICU ID, and the new password. 
 * After validation, it presents a confirmation dialog. On confirmation, an HTTP request 
 * is made to reset the password.
 *
 * @component
 * @function ForgottenPassword
 * 
 * @author Adam Logan
 * @returns {JSX.Element} The rendered component
 */
export default function ForgottenPassword() {
  // Page loading
  const [isLoading, setIsLoading] = useState(false);
  
  // Error messages
  const [idError, setIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [checkPasswordError, setCheckPasswordError] = useState("");
  const [error, setError] = useState(false);
  
  // Confirm dialog
  const [isOpen, setIsOpen] = useState(false);
  const [resetDetails, setResetDetails] = useState({password:"", id:""});
  const [dialogError, setDialogError] = useState("");

  const [idOptions, setIdOptions] = useState<RoleAutoComplete[]>([]);

  useEffect(() => {
    const configuration = {
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/getPicuIds`,
      headers: { 'Authorization': "Bearer " + sessionStorage.getItem('TOKEN') } 
    };

    axios(configuration)
      .then((result) => {
        const allIds = result.data.map((element:{picu_id:string}) => (element.picu_id.toString()));
        allIds.sort((a:string, b:string) => (parseInt(a) - parseInt(b)));
        setIdOptions(allIds);
      })
      .catch((error) => enqueueSnackbar(error.message, { variant: 'error' }));
  }, []);
  
  
  if(dialogError !== "") {
    setError(true);
    setPasswordError(dialogError);
    setDialogError("");
    setIsLoading(false);
  } else if (isLoading && !isOpen) {
    setIsLoading(false);
  }

  /**
   * Callback function to handle form submission
   * Validates provided input, and if valid, opens the confirmation dialog
   * 
   * @param {React.FormEvent<HTMLFormElement>} event The form event
   */
  async function handleSubmit(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    let error:boolean = false;

    // gets the values from the form
    const data = new FormData(event.currentTarget);
    const id:string = getStringValue('id', data);
    const password:string = getStringValue('password', data);
    const check_password:string = getStringValue('check_password', data);

    // checks the values and sets the error messages
    error = checkAndSetError(id === "", setIdError, "ID is required", setIsLoading) || error;
    error = checkAndSetError(password === "", setPasswordError, "Password is required", setIsLoading) || error;
    error = checkAndSetError(check_password === "" || password !== check_password, setCheckPasswordError, "Required and must match password", setIsLoading) || error;

    setError(error);
    if (!error) {
      setIsLoading(false);
      setIsOpen(true);
      setResetDetails({password:password, id:id})
    }
  }

  /**
 * Sends a request to reset the password for a given PICU ID.
 * 
 * @param {string} id - The PICU ID for which the password needs to be reset.
 * @param {string} password - The new password for the PICU ID.
 */
  function resetPassword(id:string, password:string) {
    const configuration = {
      method: "put",
      url: `${process.env.REACT_APP_API_URL}/updatePicuPassword`,
      headers: { 'Authorization': `Bearer ${sessionStorage.getItem('TOKEN')}` },
      data: {
        "picu_id": id,
        "newPassword": password
      }
    };

    alert(password);
    
    axios(configuration)
      .then((result) => {
        enqueueSnackbar("Password has been reset", { variant: 'success' });
      })
      .catch((error) => {
        if(error.response.data.includes("Password")) {
          setPasswordError(error.response.data.replace("ERROR: ", ""));
        } else {
          enqueueSnackbar(error.response.data, { variant: 'error' });
        }
      });
  }

  return (
    <Container  maxWidth="xl">
      <PageLoad loading={isLoading} />
      <ConfirmDialog open={isOpen} title='Reset Password' description={<>Are you sure you would like to reset the password for PICU {resetDetails.id}?</>} handleClose={() => { setIsOpen(false)}} handleConfirm={() => resetPassword(resetDetails.id, resetDetails.password)} />

      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >

        <Avatar sx={{ m: 1, bgcolor: error ? 'error.main' : 'primary.main' }}>
          <PasswordIcon />
        </Avatar>

        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        <Box component="form" onSubmit={(event) => handleSubmit(event)} noValidate sx={{ mt: 1 }}>
          <Autocomplete
            disablePortal
            id="id"
            autoComplete
            autoHighlight
            isOptionEqualToValue = {(option:RoleAutoComplete, value:RoleAutoComplete) => option.label === value.label}
            options={idOptions}
            renderInput={(params:any) => <TextField {...params} required margin="normal" name="id" label="id" error={idError !== ""} helperText={idError} />}
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
            error = {passwordError !== ""}
            helperText = {passwordError}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="check_password"
            label="Retype Password"
            type="password"
            id="check_password"
            autoComplete="current-password"
            error = {checkPasswordError !== ""}
            helperText = {checkPasswordError}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color = {error ? "error" : "primary"}
            sx={{ mt: 3, mb: 2 }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Container>
  );
}