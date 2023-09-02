import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton/IconButton';
import { useState } from 'react';

/**
 * React component that provides a password input field with the ability to toggle the password visibility.
 *
 * @function AddPicu
 * @component
 * @author Adam Logan
 * 
 * @param {Object} props
 * @param {string} props.id - The identifier for the input field, must be unique within a form.
 * @param {boolean} props.error - Determines if there's an error to display.
 * @param {string} props.helperText - Helper text to display below the input.
 * @param {string} props.label - The label associated with the input field.
 * 
 * @returns {JSX.Element}
 */
export default function AddPicu(props: {id: string, error:boolean, helperText:string, label:string}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      margin="normal"
      required
      fullWidth
      name={props.id}
      label={props.label}
      type={showPassword ? 'text' : 'password'}
      id={props.id}
      autoComplete="current-password"
      error = {props.error}
      helperText = {props.helperText}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              edge="end"
              aria-label="toggle password visibility"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  );
}