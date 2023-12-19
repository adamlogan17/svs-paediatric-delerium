import { ReactElement, ReactNode } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import PageLoad from '../../components/Loading/PageLoad';

/**
 * @author Adam Logan
 * @component
 * @function PageContainer
 * 
 * A container component for rendering pages with a consistent layout.
 * This is the based if the 'SignIn' template from {@link https://mui.com/material-ui/getting-started/templates/}[here]
 * 
 * @param {Object} props - The props for the PageContainer component.
 * @param {string} props.title - The title of the page.
 * @param {ReactNode} props.children - The content to be rendered within the container.
 * @param {boolean} [props.loading] - Indicates whether the page is in a loading state (optional).
 * @param {ReactElement} props.icon - The icon to be displayed in the page header.
 * 
 * @returns {JSX.Element} - Rendered component.
 */
export default function PageContainer(props:{title:string, children:ReactNode, loading?:boolean, icon:ReactElement}) {
  return (
    <Container component="main" maxWidth="xl">
      <PageLoad loading={props.loading === undefined ? false : props.loading} />

      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >

        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          {props.icon}
        </Avatar>

        <Typography component="h1" variant="h5">
          {props.title}
        </Typography>

        {props.children}
        
      </Box>
    </Container>
  );
}