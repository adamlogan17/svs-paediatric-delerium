import { ChangeEvent, useMemo, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableHead, TableRow, SxProps, Theme, TablePagination, TableContainer } from '@mui/material';
import { alpha } from '@mui/material/styles';
import EnhancedToolbar from './EnhancedToolbar';

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
export default function BaseTable(props: EditTableProps) {
  const [data, setData] = useState<any[]>(props.initialData);
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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


  let cellStyle:SxProps<Theme> = {
    width: `${100/Object.keys(data[0]).length}%`,
  }

  function handleChangePage(event: any, newPage: number) {
    setPage(newPage);
  };

  function handleChangeRowsPerPage(event: ChangeEvent<HTMLInputElement>) {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper sx={{mb: 2}}>
      <EnhancedToolbar 
        numSelected={0} 
        title={props.title} 
        handleDelete={() => null}
        data={data}
        header={Object.keys(props.columnNameMap ?? data[0]).map((key:string) => ({label: props.columnNameMap?.[key] ?? key, key: key}))}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {/* If the user provides a columnNameMap, use that, otherwise use the keys from the first object in the data array */}
              {Object.keys(props.columnNameMap ?? data[0]).map((key:string, index:number) => (
                <TableCell sx={cellStyle} key={index}>{props.columnNameMap?.[key] ?? key}</TableCell>
              ))}
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
                
                {Object.keys(row).map((key, index) => (
                  <>
                    <TableCell>
                      {row[key].toString()}
                    </TableCell>
                  </>
                ))}
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
