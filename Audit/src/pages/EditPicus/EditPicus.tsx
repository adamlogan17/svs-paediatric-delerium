import EditTable from '../../components/EditTable/EditTable';


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

export default function EditPicus() {
  return (
    <>
      <h1>Test</h1>

      <EditTable
        initialData={[{hello:"hello"}]}
        uniqueIdName={uniqueIdName}
        columnNameMap={columnNameMap}
        customInputFields={customInputFields}
        noEditFields={noEditFields}
        validateData={validateData}
      />

    </>
  );
}
