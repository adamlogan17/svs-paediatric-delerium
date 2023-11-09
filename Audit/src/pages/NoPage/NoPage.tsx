import './NoPage.css';
import { createTheme, PaletteOptions, ThemeOptions, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, PaletteMode } from '@mui/material';
import React, { createContext, useMemo, useState } from 'react';
import { SnackbarProvider } from 'notistack';
import Typography from '@mui/material/Typography';
import { useLocation } from 'react-router-dom';




const NoPage = () => {
    const location = useLocation();
    let message = '404'; // Default message
    let description = 'Ooops... Page not found';

    // Check if location.state exists and if it has a method property
    if (location.state && (location.state.method === 'SOSPD' || location.state.method === 'CAPD')) {
        message = '401';
        description = 'You are not authorised to view this page, login first';
    }

    return (
        <div className="no-page">
            <Typography variant="h1" component="h2">
                {message}
            </Typography>

            <Typography variant="h3" component="h3">
                {description}
            </Typography>
        </div>
    );
};


export default NoPage;