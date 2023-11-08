import './NoPage.css';
import { createTheme, PaletteOptions, ThemeOptions, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, PaletteMode } from '@mui/material';
import React, { createContext, useMemo, useState } from 'react';
import { SnackbarProvider } from 'notistack';
import Typography from '@mui/material/Typography';


const NoPage = () => {
    return (
        <div className="no-page">
            <Typography variant="h1" component="h2">
                404
             </Typography>

             <Typography variant="h3" component="h3">
                Ooops... Page not found
             </Typography>
        </div>
        
    );
};

export default NoPage;