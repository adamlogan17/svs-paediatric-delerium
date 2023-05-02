import BasicNavBar from '../../components/NavBar/NavBar';
import PButton from '../../components/PButton/PButton';
import RadioButton from '../../components/RadioButton/RadioButton';

import '../../shared/layout.css';
import './form.css'
import { useRef, useState } from 'react';
import axios from 'axios';

function insertData(data:any[]):void {
  const configuration = {
    method: "post",
    url: "http://localhost:8000/compData", 
    headers: { 'Authorization': "bearer " + sessionStorage.getItem('TOKEN') },
    data: {
        table:"compliance_data",
        data: data
      }
  };

  // make the API call
  axios(configuration)
      .then((result) => {
          alert("Data inserted!");
          window.location.href = "/auditGraphs"
      })
      .catch((error) => error = new Error());
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
    
    function handleSubmit():void { //this just prints all the values once the buttons printed
        const sumvalue = sumvalueRef.current?.value;
        const userID = userIDRef.current?.value;
        const bedNo = bedNoRef.current?.value;
        console.log('Summary Value:',sumvalue);
        console.log('User ID:',userID);
        console.log('Bed number:',bedNo);

        let userData:string[] = [ patientDetails, isComfortBRecorded, isComfortBScore12OrMore, isComfortBScore12OrMoreIn24Hrs, isCAPDTotalledCorrectly, isCAPDScore9OrMore, isChartInitialled ];

        let convertedData:any[] = userData.map((data:string) => data === "Yes" ? true:false);

        convertedData.push(bedNo);
        convertedData.push("CAPD");

        insertData(convertedData);
    };

  return (
    <div id='form' className='wrapper'>
      <BasicNavBar />
      <div className='content'>
        <h1>Delirium Compliance - Audit Form</h1>
        <br />
        <form onSubmit={handleSubmit}>
          <div className='data-input'>
            {/* <h5>Select your PICU number from this list: </h5>
            <TypeDropDown
              text='Site Number'
              primaryColour='#025858'
              secondaryColour='#013e3e'
              options={Array.from({ length: 29 }, (_, i) => ('s' + (i + 1)).toString())}
            />
            <br />
            <h5>Enter your summary value this is an integer in the range 0 to 100 (no spaces): </h5>
            <input id='summary value' className='entry' type='text' name='summary value' ref={sumvalueRef} />
  
            <h5>Enter your user id: </h5>
            <input id='user id' className='entry' type='text' name='user id' ref={userIDRef} /> */}

            <h5>Enter the Bed number: </h5>
            <input id='bed number' className='entry' type='number' name='bed number' ref={bedNoRef} />

            <h5>Patient Details Correct: </h5>
            <RadioButton
              options={['Yes', 'No']}
              onSelect={(option: string) => setPatientDetails(option)} 
              selectedOption={patientDetails}
            />
            <br></br>

            <h5>is Comfort B Score Recorded:? </h5>
              <RadioButton
                options={['Yes', 'No']}
                onSelect={(option: string) => setIsComfortBRecorded(option)} 
                selectedOption={isComfortBRecorded}
              />
              <br></br>

            <h5>Is Comfort B score 12 or more?: </h5>
              <RadioButton
                options={['Yes', 'No']}
                onSelect={(option: string) => setIsComfortBScore12OrMore(option)} 
                selectedOption={isComfortBScore12OrMore}
            />
            <br></br>

            <h5>Has the Comfort B is 12 or more in the last 24 hours and ALL CAPD parameters 1-8 scored?: </h5>
              <RadioButton
                options={['Yes', 'No']}
                onSelect={(option: string) => setIsComfortBScore12OrMoreIn24Hrs(option)} 
                selectedOption={isComfortBScore12OrMoreIn24Hrs}
            />
            <br></br>

            <h5>Has CAPD  been totalled correctly?:</h5>
              <RadioButton
                options={['Yes', 'No']}
                onSelect={(option: string) => setIsCAPDTotalledCorrectly(option)} 
                selectedOption={isCAPDTotalledCorrectly} 
            />
            <br></br>

            <h5>Is CAPD score 9 or more?:</h5>
              <RadioButton
                options={['Yes', 'No']}
                onSelect={(option: string) => setIsCAPDScore9OrMore(option)} 
                selectedOption={isCAPDScore9OrMore}
            />
            <br></br>

            <h5>Has the chart been initialled?:</h5>
              <RadioButton
                options={['Yes', 'No']}
                onSelect={(option: string) => setIsChartInitialled(option)} 
                selectedOption={isChartInitialled}
            />
            <br></br>
          </div>
          <PButton text='Submit' onButtonClick={handleSubmit} primaryColour='#025858' secondaryColour='#013e3e' />
        </form>
      </div>
    </div>
  );
}

export default Form;
