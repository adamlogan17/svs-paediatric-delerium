import AppRouter from './AppRouter';

import { createTheme, PaletteOptions, ThemeOptions, ThemeProvider } from '@mui/material/styles';
import BasicNavBar from './components/NavBar/NavBar';
import { CssBaseline } from '@mui/material';
import { useMemo, useState } from 'react';
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
  },
  background: {
    default:'#181818',
    paper: '#181818'
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
    paper: '#000000'

  }
}

const options:LabelValuePair[] = [
  { label: "Contrast", value: "contrast" },
  { label: "Dark", value: "dark" },
  { label: "Light", value: "light" },
];

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
const customVariants = {
  error: BaseSnackBarElement,
  info: BaseSnackBarElement,
  success: BaseSnackBarElement,
  warning: BaseSnackBarElement,
  default: BaseSnackBarElement,
}

const adminLinks:LabelValuePair[] = [
  {
    label:'Home',
    value:'/'
  },
  {
    value:'/admin',
    label:'Menu'
  }, 
  {
    value:'/forgot-password',
    label:'Reset Password'
  },
  {
    value:'/audit-graphs',
    label:'Graphs'
  },
  {
    label:"Edit Compliance",
    value:'/edit-compliance'
  },
  {
    label:'View Log',
    value:'/audit-log'
  },
  {
    label:'Add PICU',
    value:'/add-picu'
  },
  {
    label:'Edit PICUs',
    value:'/edit-picu'
  }
]

const fieldEngineer:LabelValuePair[] = [
  {
    label:'Home',
    value:'/'
  },
  {
    value:'/field-engineer',
    label:'Menu'
  }, 
  {
    value:'/forgot-password',
    label:'Reset Password'
  }
]

const picu:LabelValuePair[] = [
  {
    label:'Home',
    value:'/'
  },
  {
    value:'/audit-graphs',
    label:'Graphs'
  }
]


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
  const defaultTheme:Themes = sessionStorage.getItem('MODE') as Themes || 'light';
  const [mode, setMode] = useState<Themes>(defaultTheme);
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: (newMode:Themes) => {
        setMode(() => {
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

      <SnackbarProvider maxSnack={3} Components={customVariants}>
        <BasicNavBar
          links={sessionStorage.getItem('ROLE') === 'admin' ? adminLinks : sessionStorage.getItem('ROLE') === 'field_engineer' ? fieldEngineer : sessionStorage.getItem('ROLE') === 'picu' ? picu : []} 
          modeOptions={options}
          toggleMode={colorMode.toggleColorMode} 
          theme={mode} 
          backgroundColor={theme.palette.background.paper} 
          textColor={theme.palette.text.primary}
          buttonColor={theme.palette.primary.main}
        />
        
        <br />
        {/* Render the current page content using the AppRouter component */}
        <AppRouter />
      </SnackbarProvider>

    </ThemeProvider>
  )
}