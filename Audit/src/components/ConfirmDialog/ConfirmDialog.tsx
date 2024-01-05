import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

/**
 * Represents the props for the ConfirmDialog component.
 * 
 * @author Adam Logan
 * 
 * @typedef {Object} ConfirmDialogProps
 * @property {boolean} open - Boolean determining if the dialog should be open or closed.
 * @property {() => void} handleClose - Callback function to close the dialog.
 * @property {string} title - The title of the dialog.
 * @property {JSX.Element} description - The descriptive text or component to be displayed in the dialog.
 * @property {Function} handleConfirm - Callback function executed when the "Confirm" button is clicked.
 */
type ConfirmDialogProps = {
  open:boolean, 
  handleClose:() => void, 
  title:string, 
  description:JSX.Element, 
  handleConfirm:Function
}

/**
 * A functional component that renders a confirmation dialog using Material-UI's Dialog component.
 * The dialog displays a title, a description, and provides options to either confirm or cancel.
 * 
 * @author Adam Logan
 * 
 * @param {ConfirmDialogProps} props - The props for the ConfirmDialog component.
 * @returns {JSX.Element} A Material-UI dialog component. 
 */
export default function ConfirmDialog(props:ConfirmDialogProps) {
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
        {props.description}
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