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
 * @typedef {Object} ValidatorDatePickerProps
 * @property {string} dateFormat - The format of the date.
 * @property {(newDate:Date) => boolean} [onChange] - The function to call when the date changes.
 * @property {Date} startDate - The initial date.
 * @property {SxProps} [sx] - The styles to apply to the DatePicker.
 */
type ValidatorDatePickerProps = {
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
 * @param {ValidatorDatePickerProps} props - The props of the ValidatorDatePicker component.
 * @returns {JSX.Element} The ValidatorDatePicker component.
 */
export default function ValidatorDatePicker(props:ValidatorDatePickerProps) {
  const theme = useTheme();
  const [error, setError] = useState<boolean>(false);
  const [date, setDate] = useState<Date>(props.startDate);

  const mainColor = error ? theme.palette.error.main : undefined;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker 
        sx={{
          ...props.sx,
          '& .MuiInputBase-input': {
            color: mainColor,
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: mainColor,
            },
            '&:hover fieldset': {
              borderColor: mainColor,
            },
            '&.Mui-focused fieldset': {
              borderColor: mainColor,
            },
          },
        }}
        value={dayjs(date)} 
        format={props.dateFormat}
        onChange={(newDate:any) => { 
          setDate(newDate);
          if(props.onChange) setError(!props.onChange(newDate)); 
        }}
      />
    </LocalizationProvider>
  );
};