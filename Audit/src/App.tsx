import AppRouter from './AppRouter';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import BasicNavBar from './components/NavBar/NavBar';
import { CssBaseline, PaletteMode } from '@mui/material';
import React, { createContext, useMemo, useState } from 'react';
import { SnackbarProvider } from 'notistack';
import BaseSnackBarElement from './components/SnackBarVarients/BaseSnackbarVarient';

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
 * Below is used to add a custom variant to the notistack snackbar, with 'varientName' being the name of the variant to queue
 * It then must be added to the customVarients object below, with the component to be rendered
 */
// declare module "notistack" {
//   interface VariantOverrides {
//     varientName: true;
//   }
// }

const customVarients = {
  error: BaseSnackBarElement,
  info: BaseSnackBarElement,
  success: BaseSnackBarElement,
  warning: BaseSnackBarElement,
  default: BaseSnackBarElement,
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

        <SnackbarProvider maxSnack={3} Components={customVarients}>
          <BasicNavBar props={{toggleMode: colorMode.toggleColorMode, mode:mode}} />
          
          <br />
          {/* Render the current page content using the AppRouter component */}
          <AppRouter />
        </SnackbarProvider>

      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}