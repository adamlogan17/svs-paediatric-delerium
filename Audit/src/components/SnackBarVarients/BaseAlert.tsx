import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from "@mui/icons-material/Close";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";

/**
 * Converts a string to its corresponding `Severity` type.
 * If the input string doesn't match any of the severity types, it returns undefined.
 * 
 * @author Adam Logan
 * @function toSeverity
 * 
 * @param {string} severity - The input string representing the severity.
 * @returns {Severity} - The corresponding `Severity` type or undefined if not matching.
 */
function toSeverity(severity:string):Severity {
  switch (severity) {
    case "error":
      return "error";
    case "success":
      return "success";
    case "info":
      return "info";
    case "warning":
      return "warning";
    default:
      return undefined;
  }
}

/**
 * Renders a base alert component which can either be a simple card or a more specialized alert based on the provided severity.
 * 
 * @author Adam Logan
 * @function BaseAlert
 * 
 * @param {BaseAlertProps} props - The properties for the BaseAlert component.
 * @returns {React.ReactNode} - The rendered alert component.
 */
export default function BaseAlert(props:BaseAlertProps) {
  // Convert the string severity to its corresponding type.
  const severity = toSeverity(props.severity);

  return (
    <>
      {(severity === undefined ? (
        // If no severity specified, render a simple card with the message.
        <Card sx={{ width:'100%' }}>
          <CardActions sx={{ padding: "8px 8px 8px 16px" }}>
            <div>
              {props.message}
            </div>

            <div style={{ marginLeft: 'auto' }}>
              <IconButton
                size="small"
                onClick={() => props.closeAction()}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </div>
          </CardActions>
        </Card>
      ) 
      :
      (
        // If severity is specified, render a specialized alert.
        <Alert
          variant="filled"
          severity={toSeverity(props.severity)}
          icon={props.icon}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => props.closeAction()}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
          sx={{ width: '100%' }}
        >
          {props.message}
        </Alert>
      ))}
    </>
    
  );
}
