import './NoPage.css';
import Typography from '@mui/material/Typography';

const NoPage = () => {
    let message = '404'; // Default message
    let description = 'Ooops... Page not found';

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