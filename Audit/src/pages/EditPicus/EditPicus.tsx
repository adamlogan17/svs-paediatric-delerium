import { useEffect, useState } from 'react';
import EditTable from '../../components/EditTable/EditTable';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import { Typography } from '@mui/material';


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

export default function EditPicus() {
  const [data, setData] = useState<Picu[]>([]);
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/audit/getall/picu`)
      .then((response:any) => {
        const picus:Picu[] = [];
        console.log(response.data.allData);
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
        console.log(picus);
        setData(picus.sort((a, b) => Number(a.picu_id) - Number(b.picu_id)));
      })
      .catch((error:any) => {
        enqueueSnackbar("System Error", { variant: "error" });
      });
  }, []);
  
  return (
    <>
      <Typography component="h1" variant="h5">
        Edit PICUs
      </Typography>

      <div style={{width:'90%', margin:'auto'}}>
        <EditTable
          deleteData={deletePicu}
          initialData={data}
          uniqueIdName={uniqueIdName}
          columnNameMap={columnNameMap}
          customInputFields={customInputFields}
          noEditFields={noEditFields}
          validateData={validateData}
        />
      </div>
    </>
  );
}
