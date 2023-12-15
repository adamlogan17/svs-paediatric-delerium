import { useEffect, useState } from 'react';
import EditTable from '../../components/Tables/EditTable';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import PageContainer from '../../components/PageContainer/PageContainer';

const customInputFields:any[] = [
  {
    key:"picu_role",
    type:"autocomplete",
    options: [{label:'PICU', value:'picu'}, {label:'Admin', value:'admin'}, {label:'Field Engineer', value:'field_engineer'}]
  }
]

const noEditFields:string[] = ["picu_id", "overall_compliance", "delirium_positive_patients"];

const uniqueIdName:string = "picu_id";

const columnNameMap:any = {
  picu_id: "PICU ID",
  ward_name: "Ward Name",
  hospital_name: "Hospital Name",
  auditor: "Auditor",
  picu_role: "PICU Role",
  overall_compliance: "Overall Compliance",
  delirium_positive_patients:"Delirium Positive Patients"
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
      enqueueSnackbar("System Error" , { variant: "error" });
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
    console.log(`${process.env.REACT_APP_API_URL}/get-all-picu`);
    axios.get(`${process.env.REACT_APP_API_URL}/get-all-picu`, { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('TOKEN')}` } })
      .then((response:any) => {
        const picus:Picu[] = [];
        for (let picu of response.data.allData) {
          picus.push({
            picu_id: picu.picu_id,
            ward_name: picu.ward_name,
            hospital_name: picu.hospital_name,
            auditor: picu.auditor,
            picu_role: picu.picu_role,
            overall_compliance: picu.overall_compliance === null ? 0 : Math.round(picu.overall_compliance * 100) / 100,
            delirium_positive_patients: picu.delirium_positive_patients === null ? 0 : Math.round(picu.delirium_positive_patients * 100) / 100,
          });
        }
        setData(picus.sort((a, b) => Number(a.picu_id) - Number(b.picu_id)));
      })
      .catch((error:any) => {
        console.log(error);
        enqueueSnackbar(error.message, { variant: "error" });
      });
      setIsLoading(false);
  }, []);
  
  return (
    <PageContainer title="Edit PICUs" icon={<BorderColorIcon />} loading={isLoading}>
      <div style={{width:'90%', margin:'auto', marginTop:'25px'}}>
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
    </PageContainer>
  );
}
