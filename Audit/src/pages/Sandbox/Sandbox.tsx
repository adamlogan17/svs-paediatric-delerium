import { Autocomplete, TextField } from '@mui/material';
import { useState } from 'react';


export default function Sandbox(props:any) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleChange = (event: any, value: any) => {
    setSelectedOption(value);
    console.log(value);
    // alert(`You selected ${value}`);
  };

  const options = [
    { label: "Contrast", value: "contrast" },
    { label: "Dark", value: "dark" },
    { label: "Light", value: "light" },
  ];

  return (
    <div>
      <Autocomplete
        options={options}
        onChange={(e, newValue) => handleChange(e, newValue ?? "none")}
        getOptionLabel={(option) => option.label}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select an option"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              style: { textTransform: "capitalize" },
            }}
          />
        )}
      />

      <br />
      <br />
    </div>
  );
}
