import { Toolbar, Tooltip, IconButton, Typography } from "@mui/material";
import { alpha } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import { useState } from "react";
import { CSVLink } from "react-csv";
import { Data, Headers } from "react-csv/lib/core";

type EnhancedToolbarProps = {
  numSelected:number,
  data:Data,
  header:Headers,
  title:string,
  handleDelete:() => void
}

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
      {props.numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {props.numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          component="div"
        >
          {props.title}
        </Typography>
      )}
      {props.numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={() => setIsOpen(true)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Download">
          <IconButton>
            <CSVLink data={props.data} headers={props.header} filename={props.title} style={{  color:'inherit' }}>
              <FileDownloadIcon />
            </CSVLink>
          </IconButton>
        </Tooltip>
      )}

      <ConfirmDialog 
        open={isOpen} 
        handleClose={() => { setIsOpen(false)}} 
        handleConfirm={props.handleDelete} 
        title='Confrim Delete Records' 
        description={<>Would you like to delete the {props.numSelected} item(s)?</>} 
      />

    </Toolbar>
  );
}