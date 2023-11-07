import {
  Container,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  TextField,
} from '@mui/material';


import { useRef, useState } from 'react';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { convert } from 'typedoc/dist/lib/utils/options/declaration';

function insertData(data: any[]): void {
  console.log("ewan", data);
  console.log(sessionStorage.getItem('TOKEN'));


  try {
    axios.post(`${process.env.REACT_APP_API_URL}/add-compliance`, data, {
    headers: { Authorization: `Bearer ${sessionStorage.getItem("TOKEN")}` },
  });
  
} catch (error) {
  console.log(error);
  console.log(error);
  enqueueSnackbar("System Error", { variant: "error" });
  return;
}
} 

function Form() {
  // all the inputs in the form are instantiated here
  const sumvalueRef = useRef<HTMLInputElement>(null);  //these 3 may not need to be included
  const userIDRef = useRef<HTMLInputElement>(null);   // ^^
  const bedNoRef = useRef<HTMLInputElement>(null);    // ^
  let [patientDetails, setPatientDetails] = useState<any>(null);
  let [isComfortBRecorded, setIsComfortBRecorded] = useState<string | null>(null);
  let [isComfortBScore12OrMore, setIsComfortBScore12OrMore] = useState<string | null>(null);
  let [isComfortBScore12OrMoreIn24Hrs, setIsComfortBScore12OrMoreIn24Hrs] = useState<string | null>(null);
  let [isCAPDTotalledCorrectly, setIsCAPDTotalledCorrectly] = useState<string | null>(null);
  let [isCAPDScore9OrMore, setIsCAPDScore9OrMore] = useState<string | null>(null);
  let [isChartInitialled, setIsChartInitialled] = useState<string | null>(null);

  function handleSubmit(): void { //this just prints all the values once the buttons printed
    const sumvalue = sumvalueRef.current?.value;
    const userID = userIDRef.current?.value;
    const bedNo = parseInt(bedNoRef.current?.value || '0');
    console.log('Summary Value:', sumvalue);
    console.log('User ID:', userID);
    console.log('Bed number:', bedNo);

    // const data:any = {
    //   comp_id: 9131,
    //   entry_date: "2023-11-07",
    //   method: "SOSPD",
    //   bed_number: 0,
    //   correct_details: true,
    //   comfort_recorded: true,
    //   comfort_above: true,
    //   all_params_scored: true,
    //   totalled_correctly: true,
    //   in_score_range: true,
    //   observer_name: true,
    //   picu_id: 1
    // }
      
      let userData:string[] = [ patientDetails, isComfortBRecorded, isComfortBScore12OrMore, isComfortBScore12OrMoreIn24Hrs, isCAPDTotalledCorrectly, isCAPDScore9OrMore, isChartInitialled ];
      let convertedData:any[] = userData.map((data:string) => data === "True" ? true:false);

      let today = new Date();
      let dd = String(today.getDate()).padStart(2, '0');
      let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      let yyyy = today.getFullYear();

      let todayFormatted = yyyy + '-' + mm + '-' + dd;

      const data:any = {
        method: "CAPD",
        entry_date: todayFormatted,
        bed_number: bedNo,
        correct_details: convertedData[0],
        comfort_recorded: convertedData[1],
        comfort_above: convertedData[2],
        all_params_scored: convertedData[3],
        totalled_correctly: convertedData[4],
        in_score_range: convertedData[5],
        observer_name: convertedData[6],
        picu_id:  parseInt(sessionStorage.getItem('USERNAME') || '0')
      };

    insertData(data);
  };

  return (
    <Container id="form" className="wrapper">
      <div className="content">
        <Typography variant="h4">Delirium Compliance - Audit Form</Typography>
        <br />
        <form onSubmit={handleSubmit}>
          <div className="data-input" style={{ marginTop: '20px' }}>
            <TextField
              id="bed-number"
              label="Enter the Bed number"
              variant="outlined"
              fullWidth
              inputRef={bedNoRef}
            />

            <Typography variant="subtitle1" style={{ marginTop: '20px' }}>Patient Details Correct:</Typography>
            <RadioGroup
              aria-label="patient-details-correct"
              name="patient-details-correct"
              value={patientDetails}
              onChange={(e) => setPatientDetails(e.target.value)}
            >
              <div className="radio-group">
                <FormControlLabel className="radio-label" value="True" control={<Radio />} label="Yes" />
                <FormControlLabel className="radio-label" value="False" control={<Radio />} label="No" />
              </div>
            </RadioGroup>
            <br />

            <Typography variant="subtitle1">Is Comfort B Score Recorded:</Typography>
            <RadioGroup
              aria-label="comfort-b-score-recorded"
              name="comfort-b-score-recorded"
              value={isComfortBRecorded}
              onChange={(e) => setIsComfortBRecorded(e.target.value)}
            >
              <div className="radio-group">
                <FormControlLabel className="radio-label" value="True" control={<Radio />} label="Yes" />
                <FormControlLabel className="radio-label" value="False" control={<Radio />} label="No" />
              </div>
            </RadioGroup>
            <br />

            <Typography variant="subtitle1">Is Comfort B score 12 or more:</Typography>
            <RadioGroup
              aria-label="comfort-b-score-12-or-more"
              name="comfort-b-score-12-or-more"
              value={isComfortBScore12OrMore}
              onChange={(e) => setIsComfortBScore12OrMore(e.target.value)}
            >              <div className="radio-group">
                <FormControlLabel className="radio-label" value="True" control={<Radio />} label="Yes" />
                <FormControlLabel className="radio-label" value="False" control={<Radio />} label="No" />
              </div>
            </RadioGroup>
            <br />

            <Typography variant="subtitle1">
              Has the Comfort B is 12 or more in the last 24 hours and ALL CAPD parameters 1-8 scored:
            </Typography>
            <RadioGroup
              aria-label="comfort-b-score-12-or-more-24hrs"
              name="comfort-b-score-12-or-more-24hrs"
              value={isComfortBScore12OrMoreIn24Hrs}
              onChange={(e) => setIsComfortBScore12OrMoreIn24Hrs(e.target.value)}
            ><div className="radio-group">
                <FormControlLabel className="radio-label" value="True" control={<Radio />} label="Yes" />
                <FormControlLabel className="radio-label" value="False" control={<Radio />} label="No" />
              </div>
            </RadioGroup>
            <br />

            <Typography variant="subtitle1">Has CAPD been totalled correctly:</Typography>
            <RadioGroup
              aria-label="capd-totalled-correctly"
              name="capd-totalled-correctly"
              value={isCAPDTotalledCorrectly}
              onChange={(e) => setIsCAPDTotalledCorrectly(e.target.value)}
            > <div className="radio-group">
                <FormControlLabel className="radio-label" value="True" control={<Radio />} label="Yes" />
                <FormControlLabel className="radio-label" value="False" control={<Radio />} label="No" />
              </div>
            </RadioGroup>
            <br />

            <Typography variant="subtitle1">Is CAPD score 9 or more:</Typography>
            <RadioGroup
              aria-label="capd-score-9-or-more"
              name="capd-score-9-or-more"
              value={isCAPDScore9OrMore}
              onChange={(e) => setIsCAPDScore9OrMore(e.target.value)}
            > <div className="radio-group">
                <FormControlLabel className="radio-label" value="True" control={<Radio />} label="Yes" />
                <FormControlLabel className="radio-label" value="False" control={<Radio />} label="No" />
              </div>
            </RadioGroup>
            <br />

            <Typography variant="subtitle1">Has the chart been initialled:</Typography>
            <RadioGroup
              aria-label="chart-initialled"
              name="chart-initialled"
              value={isChartInitialled}
              onChange={(e) => setIsChartInitialled(e.target.value)}
            > <div className="radio-group">
                <FormControlLabel className="radio-label" value="True" control={<Radio />} label="Yes" />
                <FormControlLabel className="radio-label" value="False" control={<Radio />} label="No" />
              </div>
            </RadioGroup>
            <br />
          </div>
          <Button variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}>
            Submit
          </Button>
        </form>
      </div>
    </Container>
  );
}

export default Form;