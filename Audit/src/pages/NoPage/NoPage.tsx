import './NoPage.css';
import { createTheme, PaletteOptions, ThemeOptions, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, PaletteMode } from '@mui/material';
import React, { createContext, useMemo, useState } from 'react';
import { SnackbarProvider } from 'notistack';
import Typography from '@mui/material/Typography';
import { useLocation } from 'react-router-dom';



const NoPage = () => {
    const location = useLocation();
    const method = location.state.method;

    return (
        
        <div className="no-page">
            <Typography variant="h1" component="h2">
            {method === 'SOSPD' || 'CAPD' ? '401 Error' : '404 Error'}
             </Typography>

             <Typography variant="h3" component="h3">
             {method === 'SOSPD' || 'CAPD' ? 'Remember to login first' : 'Ooops... Page not found'}
             </Typography>
        </div>
        
    );
};

export default NoPage;