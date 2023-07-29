import AppRouter from './AppRouter';


import { createTheme, ThemeProvider } from '@mui/material/styles';
import BasicNavBar from './components/NavBar/NavBar';
import { CssBaseline } from '@mui/material';

// sets the theme for the entire app, find more out at the link'https://mui.com/material-ui/customization/palette/#customization'
const theme = {
  mode:'dark',
  palette: {
    primary: {
      main: '#009999'
    },
    secondary: {
      main: '#f3f3f3'
    }
  }
}

/**
 * The main component of the application.
 * Renders the navigation bar, the current page content, and the footer.
 * 
 * @author Adam Logan
 * @component
 * @function App
 * @returns {JSX.Element} - Rendered component.
 */
export default function App() {
  return (
    <ThemeProvider theme={createTheme(theme)} >
      <CssBaseline />
      
      <BasicNavBar />
      <br />
      {/* Render the current page content using the AppRouter component */}
      <AppRouter />
    </ThemeProvider>
  )
}
