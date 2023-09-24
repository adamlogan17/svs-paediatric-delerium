import { ChangeEvent, useMemo, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField, IconButton, SxProps, Theme, Autocomplete, Checkbox, TablePagination, TableContainer } from '@mui/material';
import { alpha } from '@mui/material/styles';

import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import EnhancedToolbar from './EnhancedToolbar';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';

/**
 * 
 * @todo Add other option for textfield, to be a checkbox for boolean values
 * @todo Cannot deselect all after implementing the disableDelete prop
 */
export default function EditTable(props:{initialData:any[], uniqueIdName:string, columnNameMap:any, customInputFields:any[], noEditFields:string[], validateData:(data:any) => string[], deleteData:(ids:number[]) => void, updateData:(data:any) => void, disableDelete?:any[]}) {
  const [data, setData] = useState<any[]>(props.initialData);
  const [editId, setEditId] = useState<number | null>(null);
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

  function startEdit(id: number, row: Picu) {
    setEditId(id);
    setTempData({ ...row });
    setError(null);
  };

  function saveEdit() {
    if (tempData && (props.validateData(tempData).length === 0)) {
      props.updateData(tempData);

      setData(prev => prev.map(row => (row[props.uniqueIdName] === editId ? tempData : row)));
      setEditId(null);
      setTempData(null);
    } else {
      setError(props.validateData(tempData));
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
    <Paper sx={{margin:'auto'}}>
      <ConfirmDialog open={editOpen} handleClose={() => { setEditOpen(false)}} handleConfirm={saveEdit} title='Confrim Edit Record' description={<>Would you like to edit record {editId}?</>} />

      <EnhancedToolbar numSelected={selected.length} title='PICU' handleDelete={() => handleDelete(selected)} />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding='checkbox'>
              <Checkbox
                color="primary"
                indeterminate={selected.length > 0 && selected.length < data.length}
                checked={data.length > 0 && selected.length === data.length}
                onChange={handleSelectAllClick}
              />
              </TableCell>
              {Object.keys(data[0]).map((key:string, index:number) => (
                <TableCell sx={cellStyle} key={index}>{props.columnNameMap[key]}</TableCell>
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
                      props.noEditFields.includes(key) ? 
                        (
                          <TableCell key={index}>{row[key]}</TableCell>
                        ) : (
                          <>
                            {props.customInputFields.some((obj:any) => obj.key === key && obj.type === "autocomplete") && 
                            (
                              <TableCell key={index}>
                                <Autocomplete
                                  options={props.customInputFields.filter(obj => obj.key === key)[0].options} 
                                  onChange={(e, newValue:any) => {
                                    if(newValue === null) {
                                      newValue = { value: ""}
                                    }
                                    setTempData((prev:any) => ({ ...prev!, [key]: newValue.value }));
                                  }}
                                  value={props.customInputFields.filter(obj => obj.key === key)[0].options.find((option:any) => option.value === tempData?.[key])}
                                  renderInput={(params) => <TextField {...params} error={error?.includes(key)} />}
                                />
                              </TableCell>
                            )}

                            {props.customInputFields.some((obj:any) => obj.key !== key) && (
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
                ) : (
                  <>
                    {Object.keys(row).map((key, index) => (
                      <>
                        {props.customInputFields.some((obj:any) => obj.key === key && obj.type === "autocomplete") && 
                        (
                          <TableCell>
                            {props.customInputFields.filter(obj => obj.key === key)[0].options.find((option:any) => option.value === row[key]).label}
                          </TableCell>
                        )}

                        {props.customInputFields.some((obj:any) => obj.key !== key) && (
                          <TableCell>
                            {row[key]}
                          </TableCell>
                        )}
                      </>
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
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
    </Paper>
  );
}
