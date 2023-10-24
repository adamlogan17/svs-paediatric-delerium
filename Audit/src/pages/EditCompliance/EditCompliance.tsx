import { useEffect, useState } from 'react';
import EditTable from '../../components/EditTable/EditTable';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { Avatar, Box, Typography } from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import PageLoad from '../../components/Loading/PageLoad';

const booleanValues = [{label:'Yes', value:true}, {label:'No', value:false}];

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

const noEditFields:string[] = ["comp_id", "score", "picu_id"];

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

function validateData(data:any) {
  return Object.entries(data).filter(([key, value]) => value === "").map(([key]) => key);
}

function deleteCompliance(picuIds:number[]) {
  // axios.delete(`${process.env.REACT_APP_API_URL}/deletePicu`, {
  //   headers: { 'Authorization': `Bearer ${sessionStorage.getItem('TOKEN')}` },
  //   data: {
  //     picu_ids: picuIds
  //   }
  // })
  //   .then((response:any) => {
  //     enqueueSnackbar("The data has been deleted", { variant: "success" });
  //   })
  //   .catch((error:any) => {
  //     enqueueSnackbar("System Error", { variant: "error" });
  //   }
  // );
}

function updateCompliance(picuToUpdate:Picu) {
  // const modifiedPicu:Picu = {...picuToUpdate};
  // // convert the picuToUpdate.picu_id to a string, it is currently a number
  // if (modifiedPicu.picu_id !== undefined && modifiedPicu.picu_id !== null) {
  //   modifiedPicu.picu_id = modifiedPicu.picu_id.toString();
  // }

  // delete modifiedPicu.overall_compliance;

  // axios.put(`${process.env.REACT_APP_API_URL}/updatePicu`, picuToUpdate, {
  //   headers: { 'Authorization': `Bearer ${sessionStorage.getItem('TOKEN')}` }
  // })
  //   .then((response:any) => {
  //     enqueueSnackbar(`PICU ${picuToUpdate.picu_id} has been updated.`, { variant: "success" });
  //   })
  //   .catch((error:any) => {
  //     console.log(error);
  //     enqueueSnackbar("System Error", { variant: "error" });
  //   }
  // );
}

export default function EditCompliance() {
  const [data, setData] = useState<Picu[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/audit/getall/compliance_data`)
      .then((response:any) => {
        const compData:any[] = [];
        for (let singleScore of response.data.allData) {
          compData.push(singleScore);
        }
        setData(compData.sort((a, b) => Number(a.comp_id) - Number(b.comp_id)));
      })
      .catch((error:any) => {
        enqueueSnackbar(error.message, { variant: "error" });
      });
      setIsLoading(false);
  }, []);
  
  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <PageLoad loading={isLoading} />

      <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
        <BorderColorIcon />
      </Avatar>

      <Typography component="h1" variant="h5">
        Edit Compliance Scores
      </Typography>

      <br />

      <div style={{width:'90%', margin:'auto'}}>
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
        />}
      </div>

    </Box>
  );
}
