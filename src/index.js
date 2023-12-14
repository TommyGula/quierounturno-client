import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';

// MUI Color Themes
const theme = createTheme({
  palette: {
    primary: {
      main: '#00C4B'
    },
    secondary: {
      main: '#E33E7F'
    }
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MuiThemeProvider theme={theme}>
     <App />
    </MuiThemeProvider>
  </React.StrictMode>
);

