import { ReactNode } from "react";

/**
 * @author Adam Logan
 * @function Redirect
 * @component
 * 
 * Redirects the user to a specified URL based on a condition.
 * 
 * @param {object} props - The properties passed to the component.
 * @param {string} props.to - The URL to redirect to.
 * @param {boolean} props.condition - The condition to determine if redirection is needed.
 * @param {ReactNode} props.children - The children components to be rendered, if not redirect occurs.
 * 
 * @returns {ReactNode} - The rendered component.
 */
export default function Redirect(props:{to:string, condition:boolean,children:ReactNode}) {
  if(props.condition) window.location.href = props.to;
  
  return (
    <>
      {props.children}
    </>
  )
}