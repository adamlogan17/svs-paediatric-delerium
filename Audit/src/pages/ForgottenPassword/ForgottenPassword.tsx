import axios from 'axios';
import { Box, Button } from '@mui/material';
import PasswordIcon from '@mui/icons-material/Password';
import { useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { getStringValue, checkAndSetError } from '../../utility/form';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import PasswordTextField from '../../components/PasswordTextField/PasswordTextField';
import PicuDropDown from '../../components/PicuDropDown/PicuDropDown';
import PageContainer from '../../components/PageContainer/PageContainer';

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
    <PageContainer title="Reset Password" icon={<PasswordIcon />} loading={isLoading}>
      <ConfirmDialog open={isOpen} 
        title='Reset Password' 
        description={<>Are you sure you would like to reset the password for PICU {resetDetails.id}?</>} 
        handleClose={() => { setIsOpen(false)}} 
        handleConfirm={() => resetPassword(resetDetails.id, resetDetails.password)} 
      />
      <Box component="form" onSubmit={(event) => handleSubmit(event)} noValidate sx={{ mt: 1 }}>

        <PicuDropDown error={idError !== ""} helperText={idError} id={'id'} />

        <PasswordTextField id="password" error={passwordError !== ""} helperText={passwordError} label="Password" />

        <PasswordTextField id="check_password" error={checkPasswordError !== ""} helperText={checkPasswordError} label="Password" />
        
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
    </PageContainer>
  );
}