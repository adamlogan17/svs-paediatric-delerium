import { ReactNode } from "react";
import "./LoadingBox.css";
import CircularProgress from "@mui/material/CircularProgress";

/**
 * Represents a loading box component that displays a spinner when loading is in progress.
 *
 * @author Adam Logan
 * @component
 * @function LoadingBox
 * @param {Object} props - The properties of the LoadingBox component.
 * @param {boolean} props.loading - A boolean value indicating whether loading is in progress or not.
 * @param {ReactNode} props.children - The content to be displayed when loading is not in progress.
 * @returns {JSX.Element} The LoadingBox component.
 */
export default function LoadingBox(props:{loading:boolean, children:ReactNode}) {
  return (
    <>
      {props.loading ? (
        <div className="spinner-container">
          <CircularProgress color="primary"/>
        </div>
      ) : props.children}
    </>
  );
}