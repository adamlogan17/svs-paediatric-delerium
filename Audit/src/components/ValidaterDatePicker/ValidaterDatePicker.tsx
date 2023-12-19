import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import { useState } from "react";
import { SxProps, useTheme } from "@mui/material";

/**
 * Type for the props of the ValidaterDatePicker component.
 * 
 * @author Adam Logan
 * 
 * @typedef {Object} ValidaterDatePickerProps
 * @property {string} dateFormat - The format of the date.
 * @property {(newDate:Date) => boolean} [onChange] - The function to call when the date changes.
 * @property {Date} startDate - The initial date.
 * @property {SxProps} [sx] - The styles to apply to the DatePicker.
 */
type ValidaterDatePickerProps = {
  dateFormat:string,
  onChange?:(newDate:Date) => boolean,
  startDate:Date,
  sx?:SxProps
};

/**
 * ValidaterDatePicker component.
 * 
 * @author Adam Logan
 * 
 * @param {ValidaterDatePickerProps} props - The props of the ValidaterDatePicker component.
 * @returns {JSX.Element} The ValidaterDatePicker component.
 */
export default function ValidaterDatePicker(props:ValidaterDatePickerProps) {
  const theme = useTheme();
  const [error, setError] = useState<boolean>(false);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker 
        sx={{
          ...props.sx,
          '& .MuiInputBase-input': {
            color: error ? theme.palette.error.main : undefined,
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: error ? theme.palette.error.main : undefined,
            },
            '&:hover fieldset': {
              borderColor: error ? theme.palette.error.main : undefined,
            },
            '&.Mui-focused fieldset': {
              borderColor: error ? theme.palette.error.main : undefined,
            },
          },
        }}
        value={dayjs(props.startDate)} 
        format={props.dateFormat}
        onChange={(newDate:any) => { if(props.onChange) setError(!props.onChange(newDate)); }}
      />
    </LocalizationProvider>
  );
};