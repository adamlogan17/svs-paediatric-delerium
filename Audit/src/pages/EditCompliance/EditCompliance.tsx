import { useEffect, useState } from 'react';
import EditTable from '../../components/EditTable/EditTable';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import PageContainer from '../../components/PageContainer/PageContainer';

const booleanValues:{label:string, value:boolean}[] = [{label:'Yes', value:true}, {label:'No', value:false}];

const customInputFields:any[] = [
  {
    key:"method",
    type:"autocomplete",
    options: [{label:'CAPD', value:'CAPD'}, {label:'SOSPD', value:'SOSPD'}]
  },
  {
    key:"correct_details",
    type:"autocomplete",
    options: booleanValues
  },
  {
    key:"comfort_recorded",
    type:"autocomplete",
    options: booleanValues
  },
  {
    key:"comfort_above",
    type:"autocomplete",
    options: booleanValues
  },
  {
    key:"all_params_scored",
    type:"autocomplete",
    options: booleanValues
  },
  {
    key:"totalled_correctly",
    type:"autocomplete",
    options: booleanValues
  },
  {
    key:"in_score_range",
    type:"autocomplete",
    options: booleanValues
  },
  {
    key:"observer_name",
    type:"autocomplete",
    options: booleanValues
  }
]

const noEditFields:string[] = ["comp_id", "score", "picu_id", "entry_date"];

const uniqueIdName:string = "comp_id";

const columnNameMap:any = {
  comp_id: "Compliance ID",
  entry_date: "Entry Date",
  method: "Method",
  bed_number: "Bed Number",
  correct_details: "Correct Details?",
  comfort_recorded: "Comfort Recorded?",
  comfort_above: "Comfort Above Score?",
  all_params_scored: "All Parameters Scored?",
  totalled_correctly: "Totalled Correctly?",
  in_score_range: "In Score Range?",
  observer_name: "Observer Name Recorded?",
  score: "Score",
  picu_id: "PICU ID"
}

/**
 * Validates the provided compliance data object and returns an array of keys
 * for fields that have empty values.
 * 
 * @author Adam Logan
 * @function validateData
 * @param {ComplianceData} data - The compliance data to validate.
 * @returns {string[]} - An array of field names that have empty values.
 */
function validateData(data:ComplianceData) {
  return Object.entries(data).filter(([key, value]) => value === "").map(([key]) => key);
}

/**
 * Sends a delete request to remove specified compliance records.
 * 
 * @author Adam Logan
 * @function deleteCompliance
 * @param {number[]} compIds - An array of compliance record IDs to delete.
 */
function deleteCompliance(compIds:number[]) {
  console.log(compIds);
  axios.delete(`${process.env.REACT_APP_API_URL}/delete-compliance`, {
    headers: { 'Authorization': `Bearer ${sessionStorage.getItem('TOKEN')}` },
    data: {
      comp_ids: compIds
    }
  })
    .then((response:any) => {
      enqueueSnackbar("The data has been deleted", { variant: "success" });
    })
    .catch((error:any) => {
      enqueueSnackbar("System Error", { variant: "error" });
    }
  );
}

/**
 * Updates a specified compliance record.
 * 
 * @author Adam Logan
 * @function updateCompliance
 * @param {ComplianceData} compToUpdate - The compliance data to update.
 * @returns {Promise<ComplianceData[]>} - A promise that resolves to the updated set of compliance data.
 */
async function updateCompliance(compToUpdate: ComplianceData): Promise<ComplianceData[]> {
  try {
    await axios.put(`${process.env.REACT_APP_API_URL}/update-compliance`, compToUpdate, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("TOKEN")}` },
    });

    enqueueSnackbar(`PICU ${compToUpdate.comp_id} has been updated.`, {
      variant: "success",
    });

    return await getCompData();

  } catch (error) {
    console.log(error);
    enqueueSnackbar("System Error", { variant: "error" });
    return [];
  }
}

/**
 * Fetches all compliance data records.
 * 
 * @author Adam Logan
 * @function getCompData
 * @returns {Promise<ComplianceData[]>} - A promise that resolves to an array of compliance data records.
 */
function getCompData():Promise<ComplianceData[]> {
  return axios.get(`${process.env.REACT_APP_API_URL}/audit/getall/compliance_data`)
    .then((response:any) => {
      const compData:any[] = [];
      for (let singleScore of response.data.allData) {
        // rounds the score to 2 decimal places
        singleScore.score = Math.round(singleScore.score * 100) / 100;
        // removes the time from the date
        singleScore.entry_date = singleScore.entry_date.split("T")[0];
        compData.push(singleScore);
      }
      return compData.sort((a, b) => Number(a.comp_id) - Number(b.comp_id));
    })
    .catch((error:any) => {
      enqueueSnackbar(error.message, { variant: "error" });
      return [];
    });
}

/**
 * A component that allows users to edit compliance scores.
 * 
 * @component EditCompliance
 * @author Adam Logan
 */
export default function EditCompliance() {
  const [data, setData] = useState<ComplianceData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getCompData().then((compData:ComplianceData[]) => {
      setData(compData);
      setIsLoading(false);
    });
  }, []);
  
  return (
    <PageContainer title="Edit Compliance Scores" icon={<BorderColorIcon />} loading={isLoading}>
      <div style={{width:'90%', margin:'auto', marginTop:'25px'}}>
        {data.length > 0 && 
          <EditTable
            title='Compliance Scores'
            deleteData={deleteCompliance}
            initialData={data}
            uniqueIdName={uniqueIdName}
            columnNameMap={columnNameMap}
            customInputFields={customInputFields}
            noEditFields={noEditFields}
            validateData={validateData}
            updateData={updateCompliance}
          />
        }
      </div>
    </PageContainer>
  );
}
