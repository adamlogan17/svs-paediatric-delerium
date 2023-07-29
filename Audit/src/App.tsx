import AppRouter from './AppRouter';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import BasicNavBar from './components/NavBar/NavBar';
import { CssBaseline, IconButton, PaletteMode } from '@mui/material';
import { createContext, useMemo, useState } from 'react';
import Brightness7Icon from '@mui/icons-material/Brightness7';



const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // palette values for light mode
          primary: {
            main:'#009999'
          }
        }
      : {
          primary: {
            main: '#009999'
          }
        }),
  },
});


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
  const [mode, setMode] = useState<'light' | 'dark'>(sessionStorage.getItem("MODE") !== 'light' ? 'dark' : 'light');
  const ColorModeContext = createContext({ toggleColorMode: () => {} });
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light'
          sessionStorage.setItem("MODE", newMode);
          return newMode;
        });
      },
    }),
    [],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={createTheme(theme)} >
        <CssBaseline />

        <BasicNavBar props={{toggleMode: colorMode.toggleColorMode, mode:mode}} />
        
        <br />
        {/* Render the current page content using the AppRouter component */}
        <AppRouter />
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}