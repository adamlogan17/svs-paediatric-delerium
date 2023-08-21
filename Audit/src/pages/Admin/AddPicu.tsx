import { useNavigate } from 'react-router-dom';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import '../../shared/layout.css';
import '../../shared/landing.css';
import axios from 'axios';
import { Autocomplete, Avatar, Box, Button, Container, TextField, Typography } from '@mui/material';
import PageLoad from '../../components/Loading/PageLoad';
import { useState } from 'react';
import ConfirmDialog from '../../components/ConfirmAddPicuDialog/ConfirmAddPicuDialog';

type RoleAutoComplete = {
  label: 'PICU'|'Admin'|'Field Engineer';
  role: 'picu'|'admin'|'field_engineer';
}

function getStringValue(key: string, data:FormData):string {
  let value = data.get(key);
  value = value ? value.toString().trim() : "";
  return value;
}

function checkAndSetError(condition:boolean, setErrorFunction:Function, errorMessage:string, setIsLoading:Function) {
  if (condition) {
    setErrorFunction(errorMessage);
    setIsLoading(false);
  } else {
    setErrorFunction("");
  }
  return condition;
}

/**
 * TODO Add the picu first and the change the dialog box to include the ID, and then if the user hits cancel, delete the picu
 * TODO Separate the avatar and title into its own component
 * TODO Separate the form button into its own component
 * TODO Maybe separate the text-fields into their own component, but there may no point in doing so
 */
export default function AddPicu() {
  const navigate = useNavigate();

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
  const [confirmFoo, setConfirmFoo] = useState(():void => {});
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDescription, setConfirmDescription] = useState("");

  const roleOptions:RoleAutoComplete[] = [{label:'PICU', role:'picu'}, {label:'Admin', role:'admin'}, {label:'Field Engineer', role:'field_engineer'}];
  

  function handleSubmit(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // setIsLoading(true);
    let error:boolean = false;

    const data = new FormData(event.currentTarget);
    const hospital_name:string = getStringValue('hospital_name', data);
    const ward_name:string = getStringValue('ward_name', data);
    const roleLabel:string = getStringValue('role', data);
    const auditor:string = getStringValue('auditor', data);
    const password:string = getStringValue('password', data);
    const check_password:string = getStringValue('check_password', data);

    const role:string = roleOptions.find((role) => role.label === roleLabel)?.role || "";

    error = checkAndSetError(hospital_name === "", setHospitalError, "Hospital name is required", setIsLoading) || error;
    error = checkAndSetError(ward_name === "", setWardError, "Ward name is required", setIsLoading) || error;
    error = checkAndSetError(roleLabel === "", setRoleError, "Role is required", setIsLoading) || error;
    error = checkAndSetError(auditor === "", setAuditorError, "Auditor is required", setIsLoading) || error;
    error = checkAndSetError(password === "", setPasswordError, "Password is required", setIsLoading) || error;
    error = checkAndSetError(check_password === "" || password !== check_password, setCheckPasswordError, "Required and must match password", setIsLoading) || error;

    setError(error);
    if (!error) {
      setConfirmTitle("Confirm User Details");
      setConfirmDescription(`Would you like to and the user with the following details?\nHospital Name: ${hospital_name}\nWard Name: ${ward_name}\nRole: ${roleLabel}\nAuditor: ${auditor}\nPassword: ${password}`);

      setIsOpen(true);
      setConfirmFoo(() => addPicu(hospital_name, ward_name, role, auditor, password));
    }
  }

  function addPicu(hospital_name:string, ward_name:string, picu_role:string, auditor:string, password:string) : void {
    alert("add");
    const configuration = {
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/addPicu`,
      headers: { 'Authorization': `Bearer ${sessionStorage.getItem('TOKEN')}` },
      data: {
        hospital_name: hospital_name,
        ward_name: ward_name,
        picu_role: picu_role,
        auditor: auditor,
        password: password
      }   
    };
    
    axios(configuration)
      .then((result) => {
        alert(result.data);
        return false;
      })
      .catch((error) => {
        console.log(error.response.data);
        if(error.response.data.includes("Password")) {
          setPasswordError(error.response.data.replace("ERROR: ", ""));
          setError(true);
        }
        setIsLoading(false);
      });
  }

  return (
    <Container  maxWidth="xl">
      <PageLoad loading={isLoading} />
      <ConfirmDialog open={isOpen} handleClose={() => setIsOpen(false)} title={confirmTitle} description={confirmDescription} handleConfirm={() => confirmFoo} />


      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >

        <Avatar sx={{ m: 1, bgcolor: error ? 'error.main' : 'primary.main' }}>
          <LockOutlinedIcon />
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