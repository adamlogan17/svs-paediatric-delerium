import AddIcon from '@mui/icons-material/Add';

import axios, { AxiosResponse } from 'axios';
import { Autocomplete, Avatar, Box, Button, Container, TextField, Typography } from '@mui/material';
import PageLoad from '../../components/Loading/PageLoad';
import { useState } from 'react';
import ConfirmAddPicuDialog from '../../components/ConfirmDialog/ConfirmAddPicuDialog.';
import { enqueueSnackbar } from 'notistack';
import { getStringValue, checkAndSetError } from '../../utility/form';

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
 * @returns {JSX.Element} The rendered component
 * 
 * TODO Separate the avatar and title into its own component
 * TODO Separate the form button into its own component
 * TODO Maybe separate the text-fields into their own component, but there may be no point in doing so
 */
export default function AddPicu() {
  // Page loading
  const [isLoading, setIsLoading] = useState(false);
  
  // Error messages
  const [hospitalError, setHospitalError] = useState("");
  const [wardError, setWardError] = useState("");
  const [roleError, setRoleError] = useState("");
  const [auditorError, setAuditorError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [checkPasswordError, setCheckPasswordError] = useState("");
  const [error, setError] = useState(false);
  
  // Confirm dialog
  const [isOpen, setIsOpen] = useState(false);
  const [picuDetails, setPicuDetails] = useState<Picu>({hospital_name:"", ward_name:"", picu_role:"", auditor:"", password:"", picu_id:""});
  const [dialogError, setDialogError] = useState("");

  const roleOptions:RoleAutoComplete[] = [{label:'PICU', role:'picu'}, {label:'Admin', role:'admin'}, {label:'Field Engineer', role:'field_engineer'}];
  
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
   * Validates provided input, makes an API call to fetch the next available PICU ID, 
   * and sets the required details to be used by the confirmation dialog.
   * 
   * @param {React.FormEvent<HTMLFormElement>} event The form event
   */
  async function handleSubmit(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    let error:boolean = false;

    // gets the values from the form
    const data = new FormData(event.currentTarget);
    const hospital_name:string = getStringValue('hospital_name', data);
    const ward_name:string = getStringValue('ward_name', data);
    const roleLabel:string = getStringValue('role', data);
    const auditor:string = getStringValue('auditor', data);
    const password:string = getStringValue('password', data);
    const check_password:string = getStringValue('check_password', data);

    // checks the values and sets the error messages
    error = checkAndSetError(hospital_name === "", setHospitalError, "Hospital name is required", setIsLoading) || error;
    error = checkAndSetError(ward_name === "", setWardError, "Ward name is required", setIsLoading) || error;
    error = checkAndSetError(roleLabel === "", setRoleError, "Role is required", setIsLoading) || error;
    error = checkAndSetError(auditor === "", setAuditorError, "Auditor is required", setIsLoading) || error;
    error = checkAndSetError(password === "", setPasswordError, "Password is required", setIsLoading) || error;
    error = checkAndSetError(check_password === "" || password !== check_password, setCheckPasswordError, "Required and must match password", setIsLoading) || error;

    setError(error);
    if (!error) {
      // makes the API call to get the next available PICU ID
      const configuration = {
        method: "get",
        url: `${process.env.REACT_APP_API_URL}/getNextPicu`,
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('TOKEN')}` },
      };
      
      const id:AxiosResponse<any, any>|void = await axios(configuration)
        .then((result) => {
          return result;
        })
        .catch((error) => {
          console.log(error);
          enqueueSnackbar(error.message, { variant: 'error' });
        });

      setIsOpen(true);
      setPicuDetails({hospital_name, ward_name, picu_role:roleLabel, auditor, password, picu_id:id ? id.data.toString() : '0'});
    }
  }

  return (
    <Container  maxWidth="xl">
      <PageLoad loading={isLoading} />
      <ConfirmAddPicuDialog open={isOpen} handleClose={() => { setIsOpen(false)}} picuDetails={picuDetails} roleOptions={roleOptions} handlePasswordError={setDialogError}/>

      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >

        <Avatar sx={{ m: 1, bgcolor: error ? 'error.main' : 'primary.main' }}>
          <AddIcon />
        </Avatar>

        <Typography component="h1" variant="h5">
          Add PICU
        </Typography>
        <Box component="form" onSubmit={(event) => handleSubmit(event)} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="hospital_name"
            label="Hospital Name"
            name="hospital_name"
            error = {hospitalError !== ""}
            helperText = {hospitalError}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="ward_name"
            label="Ward Name"
            id="ward_name"
            error = {wardError !== ""}
            helperText = {wardError}
          />
          <Autocomplete
            disablePortal
            id="role"
            autoComplete
            autoHighlight
            isOptionEqualToValue = {(option:RoleAutoComplete, value:RoleAutoComplete) => option.label === value.label}
            options={roleOptions}
            renderInput={(params:any) => <TextField {...params} required margin="normal" name="role" label="Role" error={roleError !== ""} helperText={roleError} />}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="auditor"
            label="Auditor"
            id="auditor"
            error = {auditorError !== ""}
            helperText = {auditorError}
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