import { Backdrop, CircularProgress } from "@mui/material";

export default function Sandbox(props:any) {


  return (
    <div>
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <CircularProgress color='primary' />
      </Backdrop>
    </div>
  );
}