import Button from '@mui/material/Button';
import { VariantType, useSnackbar } from 'notistack';

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
      <Button onClick={handleClick}>Show snackbar</Button>
      <Button onClick={handleClickVariant('success')}>Show success snackbar</Button>
      <Button onClick={handleClickVariant('error')}>Show success default</Button>

    </div>
  );
}