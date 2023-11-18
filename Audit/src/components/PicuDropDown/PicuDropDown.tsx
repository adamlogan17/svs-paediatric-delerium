import { Autocomplete, TextField } from '@mui/material';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useState, useEffect } from 'react';
import PageLoad from '../Loading/PageLoad';

/**
 * @typedef PicuIDRole
 * 
 * Represents the combination of PICU ID and Role.
 * 
 * @property {string} picu_id - The identifier for a PICU.
 * @property {Role} picu_role - The role associated with the PICU.
 */
type PicuIDRole = {
  picu_id: string,
  picu_role: Role
}

/**
 * @author Adam Logan
 * @function PicuDropDown
 * @component
 * 
 * A dropdown component for selecting PICU IDs based on roles.
 * 
 * @param {Object} props - The props for the PicuDropDown component.
 * @param {string} props.id - The ID for the Autocomplete component.
 * @param {string} [props.helperText] - Helper text to be displayed below the input (optional).
 * @param {boolean} [props.error] - Indicates whether there is an error with the input (optional).
 * @param {Role[]} [props.roles] - An array of roles to filter the available PICU IDs (optional).
 * @param {boolean} [props.required] - Indicates whether the input is required (optional).
 */
export default function PicuDropDown(props:{helperText?:string, error?:boolean, id:string, roles?:Role[], required?:boolean}) {
  const [idOptions, setIdOptions] = useState<RoleAutoComplete[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const configuration = {
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/getPicuIds`,
      headers: { 'Authorization': "Bearer " + sessionStorage.getItem('TOKEN') } 
    };

    axios(configuration)
      .then((result) => {
        const allIds = result.data
          .filter((element:PicuIDRole) => props.roles?.includes(element.picu_role))
          .map((filteredElement:PicuIDRole) => filteredElement.picu_id.toString());

        allIds.sort((a:string, b:string) => (parseInt(a) - parseInt(b)));
        setIdOptions(allIds);
      })
      .catch((error) => enqueueSnackbar(error.message, { variant: 'error' }))
      .finally(() => setIsLoading(false));
  }, [props.roles]);

  return (
    <>
      <PageLoad loading={isLoading} />

      <Autocomplete
        disablePortal
        id={props.id}
        autoComplete
        autoHighlight
        isOptionEqualToValue = {(option:RoleAutoComplete, value:RoleAutoComplete) => option.label === value.label}
        options={idOptions}
        renderInput={(params:any) => <TextField {...params} required={props.required === undefined || props.required} label="PICU ID" margin="normal" name={props.id} error={props.error} helperText={props.helperText} />}
      />
    </>
  );
};