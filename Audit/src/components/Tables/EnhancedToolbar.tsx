import { Toolbar, Tooltip, IconButton, Typography, TextField } from "@mui/material";
import { alpha } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import { useState } from "react";
import { CSVLink } from "react-csv";
import { Data, Headers } from "react-csv/lib/core";

/**
 * @typedef EnhancedToolbarProps
 * 
 * Represents the props required for the EnhancedToolbar component.
 * 
 * @property {number} numSelected - The number of selected items.
 * @property {Data} [dataToFilter] - The data to apply filtering on (optional).
 * @property {Data} downloadData - The data to download, within JSON format.
 * @property {Headers} header - The headers for the data, being downloaded for the CSV.
 * @property {string} title - The title of the toolbar.
 * @property {() => void} [handleDelete] - An optional function to handle deletion.
 * @property {any} [filterData] - An optional function to handle data filtering.
 */
type EnhancedToolbarProps = {
  numSelected:number,
  dataToFilter?:Data,
  downloadData:Data,
  header:Headers,
  title:string,
  handleDelete?:() => void,
  filterData?:(data:Data) => void,
}

/**
 * @component
 * @author Adam Logan
 * 
 * A toolbar component for tables, that allows the data to be downloaded as a CSV.
 * Also allows an option for a search to be implemented, to display the number of data selected and to delete this data.
 * 
 * @param {EnhancedToolbarProps} props - The props for the EnhancedToolbar component.
 */
export default function EnhancedToolbar(props: EnhancedToolbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(props.numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {/* Groups the components to the left of the toolbar */}
      <div style={{ marginTop:'10px', flex: '1 1 100%' }}>
        {props.numSelected > 0 ? (
          <Typography
            color="inherit"
            variant="h6"
            component="div"
          >
            {props.numSelected} selected
          </Typography>
        ) : (
          <Typography
            variant="h6"
            component="div"
          >
            {props.title}
          </Typography>
        )}

        <TextField
          sx={{ marginTop: '10px' }}
          label="Search"
          variant="outlined"
          onChange={(e) => {
            const filteredData:any = props.dataToFilter?.filter((row: { [key: string]: any }) => {
              const searchTerm = e.target.value.toLowerCase();
              return Object.values(row).some(value => value.toString().toLowerCase().includes(searchTerm));
            });
            props.filterData?.(filteredData);
          }}
        />
      </div>

      {props.numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={() => setIsOpen(true)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Download">
          <IconButton>
            <CSVLink data={props.downloadData} headers={props.header} filename={props.title} style={{  color:'inherit' }}>
              <FileDownloadIcon />
            </CSVLink>
          </IconButton>
        </Tooltip>
      )}

      <ConfirmDialog 
        open={isOpen} 
        handleClose={() => { setIsOpen(false)}} 
        handleConfirm={props.handleDelete ?? (() => null)} 
        title='Confrim Delete Records' 
        description={<>Would you like to delete the {props.numSelected} item(s)?</>} 
      />

    </Toolbar>
  );
}