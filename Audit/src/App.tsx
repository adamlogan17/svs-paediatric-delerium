import AppRouter from './AppRouter';

import { createTheme, PaletteOptions, ThemeOptions, ThemeProvider } from '@mui/material/styles';
import BasicNavBar from './components/NavBar/NavBar';
import { CssBaseline, PaletteMode } from '@mui/material';
import React, { createContext, useMemo, useState } from 'react';
import { SnackbarProvider } from 'notistack';
import BaseSnackBarElement from './components/SnackBarVarients/BaseSnackbarVarient';

const lightTheme:PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#009999'
  }
}

const darkTheme:PaletteOptions = {
  mode: 'dark',
  primary: {
    main: '#009999'
  }
}

const contrastTheme:PaletteOptions = {
  mode: 'dark',
  primary: {
    main: '#FFFF00'
  },
  text: {
    primary:'#FFFF00',
  },
  background: {
    default:'#000000',
    paper: '#303030'
  }
}

function getDesignTokens(mode: string):ThemeOptions {
  let theme;
  switch (mode) {
    case "light":
      theme = lightTheme;
      break;
    case "dark":
      theme = darkTheme;
      break;
    case "contrast":
      theme = contrastTheme;
      break;
    default:
      theme = lightTheme;
  }

  return {
    palette: {
      ...theme
    },
  };
}

/**
 * Below is used to add a custom variant to the notistack snackbar, with 'varientName' being the name of the variant to queue
 * It then must be added to the customVarients object below, with the component to be rendered
 */
// declare module "notistack" {
//   interface VariantOverrides {
//     varientName: true;
//   }
// 
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
  const [mode, setMode] = useState<'light' | 'dark' | 'contrast'>(sessionStorage.getItem("MODE") !== 'light' ? 'dark' : 'light');
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: (newMode:'light' | 'dark' | 'contrast') => {
        setMode((prevMode) => {
          sessionStorage.setItem("MODE", newMode);
          return newMode;
        });
      },
    }),
    [],
  );

  return (
    <ThemeProvider theme={createTheme(theme)} >
      <CssBaseline />

      <SnackbarProvider maxSnack={3} Components={customVarients}>
        <BasicNavBar 
          toggleMode={colorMode.toggleColorMode} 
          theme={mode} 
          backgroundColor={theme.palette.background.paper} 
          textColor={theme.palette.text.primary}
        />
        
        <br />
        {/* Render the current page content using the AppRouter component */}
        <AppRouter />
      </SnackbarProvider>

    </ThemeProvider>
  )
}