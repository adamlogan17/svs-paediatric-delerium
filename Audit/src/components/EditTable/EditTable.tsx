import { ChangeEvent, useMemo, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField, IconButton, SxProps, Theme, Autocomplete, Checkbox, TablePagination, TableContainer } from '@mui/material';
import { alpha } from '@mui/material/styles';

import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import EnhancedToolbar from './EnhancedToolbar';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';

type CustomFields = {
    key:string,
    type:"autocomplete"|"boolean"
    options?:{
      label:string,
      value:string
    }[]
}

type EditTableProps = {
  initialData: any[],
  title: string,
  uniqueIdName: string,
  columnNameMap?: any,
  customInputFields?: CustomFields[],
  noEditFields?: string[],
  validateData?: (data: any) => string[],
  deleteData: (ids: number[]) => void,
  updateData: (data: any) => void|any[]|Promise<any[]>,
  disableDelete?: any[]
}

/**
 * 
 * @todo Add other option for textfield, to be a checkbox for boolean values
 * @todo Maybe add validation for the props?
 */
export default function EditTable(props: EditTableProps) {
  const [data, setData] = useState<any[]>(props.initialData);
  const [editId, setEditId] = useState<number | null>(null);
  // stores the data that is being edited
  const [tempData, setTempData] = useState<any | null>(null);
  const [error, setError] = useState<string[] | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editOpen, setEditOpen] = useState(false);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const visibleRows = useMemo(
    () =>
      data.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [page, rowsPerPage, data],
  );

  function startEdit(id: number, row: any) {
    setEditId(id);
    setTempData({ ...row });
    setError(null);
  };

  async function saveEdit() {
    if (tempData && ((props.validateData?.(tempData) ?? []).length === 0)) {
      const updatedData = await props.updateData(tempData);

      // If the updateData function returns an array, use that as the new data, otherwise just update the row that was edited
      setData((prev) => updatedData ?? prev.map(row => (row[props.uniqueIdName] === editId ? tempData : row)));
      setEditId(null);
      setTempData(null);
      setError(null);
    } else {
      setError(props.validateData?.(tempData) ?? null);
    }
  };

  let cellStyle:SxProps<Theme> = {
    width: `${100/Object.keys(data[0]).length + 1}%`,
  }

  const handleDelete = (ids: number[]) => {
    setData(prev => prev.filter(row => !ids.includes(Number(row[props.uniqueIdName]))));
    ids.forEach(id => itemSelection(false, id));
    props.deleteData(ids);
  };

  function itemSelection(add: boolean, picuId: number) {
    setSelected((prev) => add ? [...prev,  picuId] : prev.filter(id => id !== picuId));
  }

  function handleChangePage(event: any, newPage: number) {
    setPage(newPage);
  };

  function handleChangeRowsPerPage(event: ChangeEvent<HTMLInputElement>) {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function handleSelectAllClick(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.checked) {
      const newSelected = data
        .map((element: any) => element[props.uniqueIdName])
        .filter((id) => !props.disableDelete?.includes(id)) as number[];
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };


  return (
    <Paper sx={{mb: 2}}>
      <ConfirmDialog 
        open={editOpen} 
        handleClose={() => { setEditOpen(false)}} 
        handleConfirm={saveEdit} 
        title='Confirm Edit Record' 
        description={<>Would you like to edit record {editId}?</>} 
      />

      <EnhancedToolbar 
        numSelected={selected.length} 
        title={props.title} 
        handleDelete={() => handleDelete(selected)}
        data={data}
        header={Object.keys(props.columnNameMap ?? data[0]).map((key:string) => ({label: props.columnNameMap?.[key] ?? key, key: key}))}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding='checkbox'>
                <Checkbox
                  color="primary"
                  // The '??' provides a default value if the array is undefined or null
                  indeterminate={selected.length > 0 && selected.length < (data.length - (props?.disableDelete ?? []).length)}
                  checked={data.length > 0 && selected.length === (data.length - (props?.disableDelete ?? []).length)}
                  onChange={handleSelectAllClick}
                />
              </TableCell>

              {/* If the user provides a columnNameMap, use that, otherwise use the keys from the first object in the data array */}
              {Object.keys(props.columnNameMap ?? data[0]).map((key:string, index:number) => (
                <TableCell sx={cellStyle} key={index}>{props.columnNameMap?.[key] ?? key}</TableCell>
              ))}

              <TableCell sx={cellStyle}>Edit</TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
            {visibleRows.map((row, index) => (
              <TableRow key={index} sx={
                {
                  height:'100px',
                  ...(selected.includes(Number(row[props.uniqueIdName])) && {
                    bgcolor: (theme) =>
                      alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                  }),
                }}>
                
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    disabled={props.disableDelete?.includes(row[props.uniqueIdName])}
                    onClick={(e:any) => {
                      itemSelection(e.target.checked, Number(row[props.uniqueIdName]));
                    }}
                    checked={selected.includes(Number(row[props.uniqueIdName])) && !props.disableDelete?.includes(row[props.uniqueIdName])}
                  />
                </TableCell>
                      
                {editId === row[props.uniqueIdName] ? (
                  <>
                    {Object.keys(row).map((key:string, index:number) => (
                      props.noEditFields?.includes(key) ? 
                        (
                          <TableCell key={index}>{row[key]}</TableCell>
                        ) : (
                          <>
                            {props.customInputFields?.some((obj:any) => obj.key === key && obj.type === "autocomplete") && 
                            (
                              <TableCell key={index}>
                                <Autocomplete
                                  options={props.customInputFields.filter(obj => obj.key === key)[0].options ?? []} 
                                  onChange={(e, newValue:any) => {
                                    if(newValue === null) {
                                      newValue = { value: ""}
                                    }
                                    setTempData((prev:any) => ({ ...prev!, [key]: newValue.value }));
                                  }}
                                  value={(props.customInputFields.filter(obj => obj.key === key)[0].options ?? []).find((option:any) => option.value === tempData?.[key])}
                                  renderInput={(params) => <TextField {...params} error={error?.includes(key)} />}
                                />
                              </TableCell>
                            )}

                            {(props.customInputFields === undefined || !props.customInputFields?.some((obj:any) => obj.key === key)) && (
                              <TableCell key={index}>
                                <TextField
                                  value={tempData?.[key]}
                                  onChange={e => setTempData((prev:any) => ({ ...prev!, [key]: e.target.value }))}
                                  error={error?.includes(key)}
                                />
                              </TableCell>
                            )}
                          </>
                        )
                    ))}

                    <TableCell>
                      <IconButton onClick={() => setEditOpen(true)}>
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
                ) : 
                // below occurs when the data is NOT being edited
                (
                  <>
                    {Object.keys(row).map((key, index) => (
                      <>
                        {props.customInputFields?.some((obj:any) => obj.key === key && obj.type === "autocomplete") && 
                        (
                          <TableCell>
                            {(props.customInputFields.filter(obj => obj.key === key)[0].options ?? []).find((option:any) => option.value === row[key])?.label}
                          </TableCell>
                        )}

                        {(props.customInputFields === undefined || !props.customInputFields?.some((obj:any) => obj.key === key)) && (
                          <TableCell>
                            {row[key].toString()}
                          </TableCell>
                        )}
                      </>
                    ))}
                    <TableCell>
                      <IconButton onClick={() => startEdit(row[props.uniqueIdName] !== undefined ? Number(row[props.uniqueIdName]) : 0, row)}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}

            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: `${100 * emptyRows}px`,
                }}
              >
                <TableCell colSpan={Object.keys(data[0]).length + 2} />
              </TableRow>
            )}

          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        // the style below is due to bootstrap causing alignment issue with the pagination text @see {@link https://github.com/mui/mui-x/issues/4076} for more
        sx={{
          '.MuiTablePagination-displayedRows, .MuiTablePagination-selectLabel': {
            marginTop: '1em',
            marginBottom: '1em'
          }
        }}
        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: data.length }]}
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        component='div'
        showFirstButton={true}
        showLastButton={true}
      />
    </Paper>
  );
}
