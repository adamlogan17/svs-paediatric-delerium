import { ChangeEvent, useMemo, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableHead, TableRow, SxProps, Theme, TablePagination, TableContainer } from '@mui/material';
// import { alpha } from '@mui/material/styles';
import EnhancedToolbar from './EnhancedToolbar';

/**
 * @typedef BaseTableProps
 * 
 * Represents the props required for the BaseTable component.
 * 
 * @property {any[]} initialData - The initial data to be displayed in the table.
 * @property {string} title - The title of the table.
 * @property {string} uniqueIdName - The unique identifier for each row in the table.
 * @property {any} [columnNameMap] - An optional mapping of column names for display.
 */
type BaseTableProps = {
  initialData: any[],
  title: string,
  uniqueIdName: string,
  columnNameMap?: any,
}

/**
 * @component
 * @author Adam Logan
 * 
 * A base table component for displaying data.
 * 
 * @param {BaseTableProps} props - The props for the BaseTable component.
 * 
 * @todo maybe merge this with the EditTable component
 */
export default function BaseTable(props: BaseTableProps) {
  // required to keep a store of all of the data, not just that being displayed
  const [data] = useState<any[]>(props.initialData);
  // commented out incase of a merge with the EditTable component
  // const [selected, setSelected] = useState<number[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>(props.initialData);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // ensures that the columns and data are always in sync
  const dataKeys = Object.keys(data[0]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredData.length) : 0;

  // Calculate the rows that should be visible in the current page
  const visibleRows = useMemo(
    () =>
      filteredData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [page, rowsPerPage, filteredData],
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
        dataToFilter={data}
        downloadData={filteredData}
        filterData={(filteredData) => { setPage(0); setFilteredData(filteredData); }}
        header={Object.keys(props.columnNameMap ?? data[0]).map((key:string) => ({label: props.columnNameMap?.[key] ?? key, key: key}))}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {/* If the user provides a columnNameMap, use that, otherwise use the keys from the first object in the data array */}
              {dataKeys.map((key:string, index:number) => (
                <TableCell sx={cellStyle} key={index}>{props.columnNameMap?.[key] ?? key}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          
          <TableBody>
            {visibleRows.map((row, index) => (
              <TableRow key={index} sx={
                // this style is included incase this component is merged with the EditTable component
                {
                  // height:'100px',
                  // ...(selected.includes(Number(row[props.uniqueIdName])) && {
                  //   bgcolor: (theme) =>
                  //     alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                  // }),
                }}>
                
                {dataKeys.map((key, index) => (
                  <TableCell key={index}>
                    {row[key].toString()}
                  </TableCell>
                ))}
              </TableRow>
            ))}

            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: `${100 * emptyRows}px`,
                }}
              >
                <TableCell colSpan={Object.keys(filteredData[0]).length} />
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
        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: filteredData.length }]}
        count={filteredData.length}
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
