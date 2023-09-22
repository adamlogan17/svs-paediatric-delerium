import { useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField, IconButton, SxProps, Theme, Autocomplete } from '@mui/material';

import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';

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
];

const customInputFields:any[] = [
  {
    key:"picu_role",
    type:"autocomplete",
    options: [{label:'PICU', value:'picu'}, {label:'Admin', value:'admin'}, {label:'Field Engineer', value:'field_engineer'}]
  }
]

const noEditFields:string[] = ["picu_id", "overall_compliance"];

function validateData(data:any) {
  // let error:boolean = false;
  return Object.entries(data).filter(([key, value]) => value === "").map(([key]) => key);
}

/**
 * 
 * @todo Validate the props
 * @todo Add other option for textfield, to be a checkbox for boolean values
 * @todo display the label value for the autocomplete, when not editing
 */
export default function EditTable() {
  const [data, setData] = useState<Picu[]>(initialData);
  const [editId, setEditId] = useState<number | null>(null);
  const [tempData, setTempData] = useState<Picu | null>(null);
  const [error, setError] = useState<string[] | null>(null);

  const startEdit = (id: number, row: Picu) => {
    setEditId(id);
    setTempData({ ...row });
    setError(null);
  };

  const saveEdit = () => {
    if (tempData && (validateData(tempData).length === 0)) {
      setData(prev => prev.map(row => (row.picu_id === editId ? tempData : row)));
      setEditId(null);
      setTempData(null);
    } else {
      setError(validateData(tempData));
    }
  };

  let cellStyle:SxProps<Theme> = {
    width: `${100/Object.keys(data[0]).length + 1}%`
  }

  const handleDelete = (id: number) => {
    setData(prev => prev.filter(row => row.picu_id !== id));
  };

  return (
    <Paper sx={{width:'80%', margin:'auto'}}>
      <Table>
        <TableHead>
          <TableRow>
            {Object.keys(data[0]).map((key:string, index:number) => (
              <TableCell sx={cellStyle} key={index}>{key}</TableCell>
            ))}
            <TableCell sx={cellStyle}>Edit</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(row => (
            <TableRow key={row.picu_id} sx={{height:'100px'}}>
              {editId === row.picu_id ? (
                <>
                  {Object.keys(row).map((key:string, index:number) => (
                    noEditFields.includes(key) ? 
                      (
                        <TableCell key={index}>{row[key]}</TableCell>
                      ) : (
                        <>
                          {customInputFields.some((obj:any) => obj.key === key && obj.type === "autocomplete") && 
                          (
                            <TableCell key={index}>
                              <Autocomplete
                                options={customInputFields.filter(obj => obj.key === key)[0].options} 
                                onChange={(event, newValue:any) => {
                                  if(newValue === null) {
                                    newValue = { value: ""}
                                  }
                                  setTempData(prev => ({ ...prev!, [key]: newValue.value }));
                                }}
                                value={customInputFields.filter(obj => obj.key === key)[0].options.find((option:any) => option.value === tempData?.[key])}
                                renderInput={(params) => <TextField {...params} error={error?.includes(key)} />}
                              />
                            </TableCell>
                          )}

                          {customInputFields.some((obj:any) => obj.key !== key) && (
                            <TableCell key={index}>
                              <TextField
                                value={tempData?.[key]}
                                onChange={e => setTempData(prev => ({ ...prev!, [key]: e.target.value }))}
                                error={error?.includes(key)}
                              />
                            </TableCell>
                          )}
                        </>
                      )
                  ))}

                  <TableCell>
                    <IconButton onClick={saveEdit}>
                      <SaveIcon />
                    </IconButton>

                    <IconButton onClick={() => {
                      setEditId(null);
                      setError(null);
                    }}>
                      <CancelIcon />
                    </IconButton>
                  </TableCell>
                </>
              ) : (
                <>
                  {Object.keys(row).map((key, index) => (
                    <TableCell key={index}>
                      {row[key]}
                    </TableCell>
                  ))}
                  <TableCell>
                    <IconButton onClick={() => startEdit(row.picu_id !== undefined ? Number(row.picu_id) : 0, row)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
