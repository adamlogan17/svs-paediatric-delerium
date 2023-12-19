import AddIcon from '@mui/icons-material/Add';

import axios, { AxiosResponse } from 'axios';
import { Autocomplete, Box, Button, TextField } from '@mui/material';
import { useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { getStringValue, checkAndSetError } from '../../utility/form';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import PasswordTextField from '../../components/PasswordTextField/PasswordTextField';
import PageContainer from '../../components/PageContainer/PageContainer';

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
 * @todo Change error handling to that of 'ComplianceForm.tsx'
 * @todo Separate the form button into its own component
 * @todo Maybe separate the text-fields into their own component, but there may be no point in doing so
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
  const [picuDetails, setPicuDetails] = useState<Picu>({hospital_name:"", ward_name:"", picu_role:"picu", auditor:"", password:"", picu_id:""});
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
      const role:Role = roleOptions.find((role:RoleAutoComplete) => role.label === roleLabel)?.role || "picu";

      setPicuDetails({hospital_name, ward_name, picu_role:role, auditor, password, picu_id:id ? id.data.toString() : '0'});
    }
  }


  /**
   * Sends a request to add a new PICU (Paediatric Intensive Care Unit) entry to the backend.
   * If an error occurs during the request, especially one related to password issues, it's handled by 
   * invoking the setPasswordError function. All other errors are displayed as error notifications.
   *
   * @function addPicu
   * @author Adam Logan
   * 
   * @param {Picu} details - Object containing the details of the PICU to be added.
   */
  function addPicu(details:Picu) : void {
    const configuration = {
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/addPicu`,
      headers: { 'Authorization': `Bearer ${sessionStorage.getItem('TOKEN')}` },
      data: details   
    };
    
    axios(configuration)
      .then((result) => {
        enqueueSnackbar("PICU added successfully", { variant: 'success' });
      })
      .catch((error) => {
        if(error.response.data.includes("Password")) {
          setPasswordError(error.response.data.replace("ERROR: ", ""));
        } else {
          enqueueSnackbar(error.response.data, { variant: 'error' });
        }
      });
  }

  const chosenRoleLabel = roleOptions.filter((role:RoleAutoComplete) => role.role === picuDetails.picu_role);

  return (
    <PageContainer title="Add PICU" loading={isLoading} icon={<AddIcon />}>
      <ConfirmDialog 
        open={isOpen} 
        handleClose={() => { setIsOpen(false)}} 
        handleConfirm={() => addPicu(picuDetails)} 
        title='Confrim User Details' 
        description={
          <>
            Would you like to and the user with the following details?
            <br />
            <ul>
              {picuDetails.picu_id && (<li>Username: {picuDetails.picu_id}</li>)}
              <li>Hospital Name: {picuDetails.hospital_name}</li>
              <li>Ward Name: {picuDetails.ward_name}</li>
              <li>Role: {chosenRoleLabel.length === 1 ? chosenRoleLabel[0].label : ""}</li>
              <li>Auditor: {picuDetails.auditor}</li>
            </ul>
          </>
        } 
      />

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