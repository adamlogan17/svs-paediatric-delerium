import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

/**
 * A functional component that renders a confirmation dialog using Material-UI's Dialog component.
 * The dialog displays a title, a description, and provides options to either confirm or cancel.
 * 
 * @function ConfirmDialog
 * @author Adam Logan
 * @component
 * 
 * @param {boolean} open - Boolean determining if the dialog should be open or closed.
 * @param {() => void} handleClose - Callback function to close the dialog.
 * @param {string} title - The title of the dialog.
 * @param {JSX.Element} description - The descriptive text or component to be displayed in the dialog.
 * @param {() => void} handleConfirm - Callback function executed when the "Confirm" button is clicked.
 * @returns {JSX.Element} A Material-UI dialog component.
 * 
 * TODO Maybe change the type of the callback functions to Function
 */
export default function ConfirmDialog(props:{open:boolean, handleClose:() => void, title:string, description:JSX.Element, handleConfirm:() => void}) {
  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle>
        {props.title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {props.description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose}>Cancel</Button>
        <Button onClick={() => {
          props.handleConfirm();
          props.handleClose();
        }}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}