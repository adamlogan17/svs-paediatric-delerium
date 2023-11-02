import PopUp from './PopUp';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * Represents a component that displays a spinner during page loading.
 * To use this component simply have the '<PageLoad loading={state} />' anywhere.
 *
 * @author Adam Logan
 * @component
 * @function PageLoad
 * @param {Object} props - The properties of the PageLoad component.
 * @param {boolean} props.loading - A boolean state indicating whether the page is still loading or not.
 * @returns {JSX.Element} The PageLoad component.
 */
export default function PageLoad(props:{loading: boolean}) {
  return (
    <PopUp isOpen={props.loading} >
      <CircularProgress />
    </PopUp>
  )
}