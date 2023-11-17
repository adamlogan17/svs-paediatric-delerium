import { RadioGroup, FormControl, FormControlLabel, FormLabel, Radio, Button, TextField, Box, FormHelperText } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { useLocation } from 'react-router-dom';
import PageContainer from '../../components/PageContainer/PageContainer';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';



export default function ComplianceForm() {
  const location = useLocation();
  const [errorFields, setErrorFields] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [compDataToAdd, setCompDataToAdd] = useState<ComplianceData>();

  // defaults to SOSPD if no method is passed in
  const method = location.state.method == null ? 'SOSPD' : location.state.method;

  const radioButtonValues:{label:string, uniqueName:string}[] = [
    {
      label:"Patient Details Correct:",
      uniqueName:"correct_details"
    },
    {
      label:"Is Comfort B Score Recorded:",
      uniqueName:"comfort_recorded"
    },
    {
      label:"Is Comfort B score 12 or more:",
      uniqueName:"comfort_above"
    },
    {
      label: method === 'SOSPD' ? 'Delirium Compliance - Audit Form (SOS-PD)' : 'Delirium Compliance - Audit Form (CAPD)',
      uniqueName:"all_params_scored"
    },
    {
      label:method === 'SOSPD' ? 'Has the SOSPD been totalled correctly:' : 'Has CAPD been totalled correctly:',
      uniqueName:"totalled_correctly"
    },
    {
      label: method === 'SOSPD' ? 'Do parents NOT recognise their child’s behaviour AND/OR SOS-PD score is ≥ 4 OR symptom with * is positive?' : 'Is CAPD score 9 or more:',
      uniqueName:"in_score_range"
    },
    {
      label: "Has the chart been initialled:",
      uniqueName:"observer_name"
    }
  ]

  function insertData(data: ComplianceData|undefined): void {
    const configuration = {
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/add-compliance`,
      headers: { 'Authorization': `Bearer ${sessionStorage.getItem('TOKEN')}` },
      data: data   
    };
    
    axios(configuration)
      .then((result) => {
        enqueueSnackbar(`Successfully added compliance data with ID ${result.data.comp_id}`, { variant: 'success' });
      })
      .catch((error) => {
        enqueueSnackbar("System Error", { variant: "error" });
      })
      .finally (() => {
        setIsLoading(false);
      });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    // setIsLoading(true);
    setErrorFields([]);
    const data = new FormData(event.currentTarget);
    let newCompData:ComplianceData = {
      method: 'SOSPD',
      bed_number: 0,
      correct_details: false,
      comfort_recorded: false,
      comfort_above: false,
      all_params_scored: false,
      totalled_correctly: false,
      in_score_range: false,
      observer_name: false,
      picu_id: data.get("picu-id") === null ? Number(sessionStorage.getItem('USERNAME')) : Number(data.get("picu-id"))
    };

    // validates the bed number input
    const bedNumber:number = Number(data.get("bed-number"));
    if(data.get("bed-number") === "" || isNaN(bedNumber) || bedNumber < 0 || bedNumber === Math.floor(bedNumber)) {
      setErrorFields([...errorFields, "bed-number"]);
    } else {
      newCompData.bed_number = bedNumber;

    }

    for(let radioButton of radioButtonValues) {
      if(data.get(radioButton.uniqueName) === null) {
        setErrorFields((prevFields) => [...prevFields, radioButton.uniqueName]);
      } else {
        newCompData[radioButton.uniqueName] = data.get(radioButton.uniqueName) === "true";
      }
    }

    console.log(errorFields);

    if (errorFields.length === 0) {
      setCompDataToAdd(newCompData);
      setIsDialogOpen(true)
    }
  };

  return (
    <PageContainer title={method === 'SOSPD' ? 'Delirium Compliance - Audit Form (SOS-PD)' : 'Delirium Compliance - Audit Form (CAPD)'} icon={<AddIcon />} loading={isLoading} >
      <ConfirmDialog 
        open={isDialogOpen} 
        handleClose={() => { setIsDialogOpen(false)}} 
        handleConfirm={() => insertData(compDataToAdd)} 
        title='Confirm Compliance Data Details' 
        description={
          <>
            Would you like to insert the compliance data with the following details?
            <br />
            <ul>
              <li>Bed Number = {compDataToAdd?.bed_number}</li>
              {radioButtonValues.map((radioButton, index) => <li key={index}>{radioButton.label} = {compDataToAdd === undefined ? "ERROR" : compDataToAdd[radioButton.uniqueName] ? "Yes" : "No"}</li>)}
            </ul>
          </>
        } 
      />
      
      <br />
      <Box component="form" onSubmit={(event) => handleSubmit(event)} noValidate sx={{ mt: 1 }}>
        <TextField
          label="Enter the Bed number"
          variant="outlined"
          fullWidth
          name="bed-number"
          error={errorFields.includes("bed-number")}
          helperText={errorFields.includes("bed-number") ? "This must be a number larger than 0" : ""}
        />

        {radioButtonValues.map((radioButton, index) => (
          <div style={{marginTop:'10px'}} key={index}>
            <FormControl error={errorFields.includes(radioButton.uniqueName)}>
              <FormLabel>
                {radioButton.label}
              </FormLabel>
              <RadioGroup row name={radioButton.uniqueName}>
                <FormControlLabel value={true} control={<Radio />} label="Yes" />
                <FormControlLabel value={false} control={<Radio />} label="No" />
              </RadioGroup>
              <FormHelperText>{errorFields.includes(radioButton.uniqueName) ? "This field is required" : ""}</FormHelperText>
            </FormControl>
          </div>
        ))}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Submit
        </Button>
      </Box>
    </PageContainer>
  );
}