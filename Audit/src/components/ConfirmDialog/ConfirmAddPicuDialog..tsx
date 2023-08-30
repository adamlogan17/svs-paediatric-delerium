import axios from "axios";
import { enqueueSnackbar } from "notistack";
import ConfirmDialog from "./ConfirmDialog";

/**
 * Sends a request to add a new PICU (Paediatric Intensive Care Unit) entry to the backend.
 * If an error occurs during the request, especially one related to password issues, it's handled by 
 * invoking the setPasswordError callback. All other errors are displayed as error notifications.
 *
 * @function addPicu
 * @author Adam Logan
 * 
 * @param {Picu} details - Object containing the details of the PICU to be added.
 * @param {Function} setPasswordError - Callback function to handle password-related errors.
 */
function addPicu(details:Picu, setPasswordError:Function) : void {
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

/**
 * A dialog component to confirm the addition of a new PICU user.
 * 
 * It renders the `ConfirmDialog` component, passing in the details of the PICU user to be added.
 * Before the confirmation, it transforms the `picu_role` from a label to the corresponding role.
 * 
 * @function ConfirmAddPicuDialog
 * @author Adam Logan
 * @component
 * 
 * @param {boolean} open - Indicates if the dialog is open.
 * @param {Function} handleClose - Function to close the dialog.
 * @param {Picu} picuDetails - Details of the PICU user to be added.
 * @param {RoleAutoComplete[]} roleOptions - Array of role options for mapping label to role.
 * @param {Function} handlePasswordError - Function to handle password-related errors.
 * 
 * @returns {JSX.Element} A dialog element to confirm the addition of the PICU user.
 */
export default function ConfirmAddPicuDialog(props:{open:boolean, handleClose:() => void, picuDetails:Picu, roleOptions:RoleAutoComplete[], handlePasswordError:Function}) {
  const role:string = props.roleOptions.find((role) => role.label === props.picuDetails.picu_role)?.role || "";

  const roleLabel = props.picuDetails.picu_role;

  props.picuDetails.picu_role = role;

  return (
    <ConfirmDialog 
      open={props.open} 
      handleClose={props.handleClose} 
      title={"Confirm User Details"} 
      description={
        <>
          <p>Would you like to and the user with the following details?</p>
          <ul>
            {props.picuDetails.picu_id && (<li>Username: {props.picuDetails.picu_id}</li>)}
            <li>Hospital Name: {props.picuDetails.hospital_name}</li>
            <li>Ward Name: {props.picuDetails.ward_name}</li>
            <li>Role: {roleLabel}</li>
            <li>Auditor: {props.picuDetails.auditor}</li>
          </ul>
        </>
      } 
      handleConfirm={() => addPicu(props.picuDetails, props.handlePasswordError)} 
    />
  );
}