import Button from '@mui/material/Button';
import { VariantType, useSnackbar } from 'notistack';
import EditTable from '../../components/EditTable/EditTable';

import { CSVLink, CSVDownload } from "react-csv";
import { Toolbar, Tooltip, IconButton, Typography } from "@mui/material";
import FileDownloadIcon from '@mui/icons-material/FileDownload';


const initialData: Picu[] = [
  {
    picu_id: 3,
    ward_name: "Maseru",
    hospital_name: "Lesotho",
    auditor: "Sam Matekane",
    picu_role: "picu",
    overall_compliance: 12
  },
  {
    picu_id: 4,
    ward_name: "Rabat",
    hospital_name: "Morocco",
    auditor: "Aziz Akhannouch",
    picu_role: "picu",
    overall_compliance: 12
  },
  {
    picu_id: 4,
    ward_name: "Rabat",
    hospital_name: "Morocco",
    auditor: "Aziz Akhannouch",
    picu_role: "picu",
    overall_compliance: 12
  },
  {
    picu_id: 4,
    ward_name: "Rabat",
    hospital_name: "Morocco",
    auditor: "Aziz Akhannouch",
    picu_role: "picu",
    overall_compliance: 12
  },
  {
    picu_id: 4,
    ward_name: "Rabat",
    hospital_name: "Morocco",
    auditor: "Aziz Akhannouch",
    picu_role: "picu",
    overall_compliance: 12
  },
  {
    picu_id: 4,
    ward_name: "Rabat",
    hospital_name: "Morocco",
    auditor: "Aziz Akhannouch",
    picu_role: "picu",
    overall_compliance: 12
  },
  {
    picu_id: 4,
    ward_name: "Rabat",
    hospital_name: "Morocco",
    auditor: "Aziz Akhannouch",
    picu_role: "picu",
    overall_compliance: 12
  },
  {
    picu_id: 4,
    ward_name: "Rabat",
    hospital_name: "Morocco",
    auditor: "Aziz Akhannouch",
    picu_role: "picu",
    overall_compliance: 12
  },
  {
    picu_id: 4,
    ward_name: "Rabat",
    hospital_name: "Morocco",
    auditor: "Aziz Akhannouch",
    picu_role: "picu",
    overall_compliance: 12
  }
];

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

const csvData = [
  ["firstname", "lastname", "email"],
  ["Ahmed", "Tomi", "ah@smthing.co.com"],
  ["Raed", "Labes", "rl@smthing.co.com"],
  ["Yezzi", "Min l3b", "ymin@cocococo.com"]
];

const headers = [
  { label: 'PICU ID', key: 'picu_id' },
  { label: 'Ward Name', key: 'ward_name' },
  { label: 'Hospital Name', key: 'hospital_name' },
  { label: 'Auditor', key: 'auditor' },
  { label: 'PICU Role', key: 'picu_role' },
  { label: 'Overall Compliance', key: 'overall_compliance' },
];

export default function Sandbox(props:any) {
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = () => {
    enqueueSnackbar("You're report is ready");
  };

  const handleClickVariant = (variant: VariantType) => () => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar("lorem impsum", { variant: variant });
    // enqueueSnackbar('This is a success message!', { variant });
  };

  return (
    <div>
      {/* <Button onClick={handleClick}>Show snackbar</Button>
      <Button onClick={handleClickVariant('success')}>Show success snackbar</Button>
      <Button onClick={handleClickVariant('error')}>Show success default</Button> */}
      {/* <CSVDownload data={csvData} target="_blank" /> */}

      <Tooltip title="Download">
        <IconButton>
          <CSVLink data={initialData} headers={headers} filename={'Audit'} style={{  color:'inherit' }}>
            <FileDownloadIcon />
          </CSVLink>
        </IconButton>
      </Tooltip>
      <br />
      <br />
    </div>
  );
}
