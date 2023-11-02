import { useEffect, useState } from 'react';
import EditTable from '../../components/EditTable/EditTable';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { Avatar, Box, Typography } from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import PageLoad from '../../components/Loading/PageLoad';

const customInputFields:any[] = [
  {
    key:"picu_role",
    type:"autocomplete",
    options: [{label:'PICU', value:'picu'}, {label:'Admin', value:'admin'}, {label:'Field Engineer', value:'field_engineer'}]
  }
]

const noEditFields:string[] = ["picu_id", "overall_compliance"];

const uniqueIdName:string = "picu_id";

const columnNameMap:any = {
  picu_id: "PICU ID",
  ward_name: "Ward Name",
  hospital_name: "Hospital Name",
  auditor: "Auditor",
  picu_role: "PICU Role",
  overall_compliance: "Overall Compliance"
}

function validateData(data:any) {
  return Object.entries(data).filter(([key, value]) => value === "").map(([key]) => key);
}

function deletePicu(picuIds:number[]) {
  axios.delete(`${process.env.REACT_APP_API_URL}/deletePicu`, {
    headers: { 'Authorization': `Bearer ${sessionStorage.getItem('TOKEN')}` },
    data: {
      picu_ids: picuIds
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

function updatePicu(picuToUpdate:Picu) {
  const modifiedPicu:Picu = {...picuToUpdate};
  // convert the picuToUpdate.picu_id to a string, it is currently a number
  if (modifiedPicu.picu_id !== undefined && modifiedPicu.picu_id !== null) {
    modifiedPicu.picu_id = modifiedPicu.picu_id.toString();
  }

  delete modifiedPicu.overall_compliance;

  axios.put(`${process.env.REACT_APP_API_URL}/updatePicu`, picuToUpdate, {
    headers: { 'Authorization': `Bearer ${sessionStorage.getItem('TOKEN')}` }
  })
    .then((response:any) => {
      enqueueSnackbar(`PICU ${picuToUpdate.picu_id} has been updated.`, { variant: "success" });
    })
    .catch((error:any) => {
      console.log(error);
      enqueueSnackbar("System Error", { variant: "error" });
    }
  );
}

export default function EditPicus() {
  const [data, setData] = useState<Picu[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/audit/getall/picu`)
      .then((response:any) => {
        const picus:Picu[] = [];
        for (let picu of response.data.allData) {
          picus.push({
            picu_id: picu.picu_id,
            ward_name: picu.ward_name,
            hospital_name: picu.hospital_name,
            auditor: picu.auditor,
            picu_role: picu.picu_role,
            overall_compliance: picu.overall_compliance === null ? 0 : Math.round(picu.overall_compliance * 100) / 100
          });
        }
        setData(picus.sort((a, b) => Number(a.picu_id) - Number(b.picu_id)));
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
        Edit PICUs
      </Typography>

      <br />

      <div style={{width:'90%', margin:'auto'}}>
        {data.length > 0 && 
        <EditTable
          title='PICUs'
          deleteData={deletePicu}
          initialData={data}
          uniqueIdName={uniqueIdName}
          columnNameMap={columnNameMap}
          customInputFields={customInputFields}
          noEditFields={noEditFields}
          validateData={validateData}
          updateData={updatePicu}
          disableDelete={[Number(sessionStorage.getItem('USERNAME'))]}
        />}
      </div>
    </Box>
  );
}
