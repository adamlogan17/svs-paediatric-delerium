import { ReactNode } from "react";
import Backdrop from '@mui/material/Backdrop';

/**
 * Renders a popup component that displays its children, in the foreground of a transparent background.
 * This disables all of the components behind the popup.
 *
 * @author Adam Logan
 * @component
 * @function PopUp
 * @param {Object} props - The component props.
 * @param {boolean} props.isOpen - Indicates whether the popup is open or not.
 * @param {ReactNode} props.children - The content to be displayed within the popup.
 * @returns {JSX.Element} The PopUp component.
 */
export default function PopUp(props: {isOpen:boolean, children:ReactNode}) {
  return (
    <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={props.isOpen}>
        {props.children}
    </Backdrop>
  );
}