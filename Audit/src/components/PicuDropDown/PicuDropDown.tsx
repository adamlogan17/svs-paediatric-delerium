import { Autocomplete, TextField } from '@mui/material';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useState, useEffect } from 'react';

type PicuIDRole = {
  picu_id: string,
  picu_role: Role
}

function PicuDropDown(props:{helperText?:string, error?:boolean, id:string, roles?:Role[]}) {
  const [idOptions, setIdOptions] = useState<RoleAutoComplete[]>([]);

  useEffect(() => {
    const configuration = {
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/getPicuIds`,
      headers: { 'Authorization': "Bearer " + sessionStorage.getItem('TOKEN') } 
    };

    axios(configuration)
      .then((result) => {
        console.log(result.data);
        const allIds = result.data
          .filter((element:PicuIDRole) => props.roles?.includes(element.picu_role))
          .map((filteredElement:PicuIDRole) => filteredElement.picu_id.toString());

        allIds.sort((a:string, b:string) => (parseInt(a) - parseInt(b)));
        setIdOptions(allIds);
      })
      .catch((error) => enqueueSnackbar(error.message, { variant: 'error' }));
  }, [props.roles]);

  return (
    <Autocomplete
      disablePortal
      id={props.id}
      autoComplete
      autoHighlight
      isOptionEqualToValue = {(option:RoleAutoComplete, value:RoleAutoComplete) => option.label === value.label}
      options={idOptions}
      renderInput={(params:any) => <TextField {...params} required margin="normal" name="id" label="id" error={props.error} helperText={props.helperText} />}
    />
  );
};

export default PicuDropDown;
