import { Autocomplete, SxProps, TextField } from '@mui/material';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useState, useEffect } from 'react';
import PageLoad from '../Loading/PageLoad';

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
 * 
 * @todo Maybe make an 'didComponentMount' because it's called every time state is changed, which is not ideal
 * @todo Always keeps the value of the first element in the array, even if the array changes
 */
export default function PicuDropDown(props:{helperText?:string, error?:boolean, id:string, roles?:Role[], required?:boolean, onChange?:(newPicuId:number) => void, sx?:SxProps, defaultValue?:boolean}) {
  const [idOptions, setIdOptions] = useState<LabelValuePair[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [picuId, setPicuId] = useState<LabelValuePair>();

  useEffect(() => {
    const configuration = {
      method: "get",
      url: `${process.env.REACT_APP_API_URL}/getPicuIds`,
      headers: { 'Authorization': "Bearer " + sessionStorage.getItem('TOKEN') } 
    };

    axios(configuration)
      .then((result) => {
        const roleOfIds:Role[] = props.roles ?? ['picu', 'field_engineer', 'admin'];
        const allIds = result.data
          .filter((element:PicuIDRole) => roleOfIds.includes(element.picu_role))
          .map((filteredElement:PicuIDRole) => filteredElement.picu_id.toString());

        allIds.sort((a:string, b:string) => (parseInt(a) - parseInt(b)));
        setIdOptions(allIds);
        // Only set picuId if it has not been set yet
        if (!picuId) {
          setPicuId(allIds[0]);
        }
      })
      .catch((error) => enqueueSnackbar(error.message, { variant: 'error' }))
      .finally(() => setIsLoading(false));
  }, [props.roles, picuId]);

  // console.log(props.defaultValue ? picuId || "no picu but default" : "no default");

  return (
    <>
      <PageLoad loading={isLoading} />

      <Autocomplete
        value={props.defaultValue ? picuId || null : picuId}
        sx={props.sx}
        disablePortal
        id={props.id}
        autoComplete
        autoHighlight
        isOptionEqualToValue = {(option:LabelValuePair, value:LabelValuePair) => option.label === value.label}
        options={idOptions}        
        renderInput={(params:any) => <TextField {...params} required={props.required === undefined || props.required} label="PICU ID" margin="normal" name={props.id} error={props.error} helperText={props.helperText}  />}
        onChange={(event:any, newValue:any) => { setPicuId(newValue); if(props.onChange !== undefined) props.onChange(newValue) }}
      />
    </>
  );
};