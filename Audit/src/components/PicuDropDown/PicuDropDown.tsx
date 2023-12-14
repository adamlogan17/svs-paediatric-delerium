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
 */
export default function PicuDropDown(props:{helperText?:string, error?:boolean, id:string, roles?:Role[], required?:boolean, onChange?:(newPicuId:number) => void, sx?:SxProps}) {
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
        setPicuId(allIds[0]);
      })
      .catch((error) => enqueueSnackbar(error.message, { variant: 'error' }))
      .finally(() => setIsLoading(false));
  }, [props.roles]);

  return (
    <>
      <PageLoad loading={isLoading} />

      <Autocomplete
        value={picuId || null}
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