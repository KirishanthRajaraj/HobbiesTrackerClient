import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider, createTheme } from '@mui/material'

const theme = createTheme({
  palette: {
    primary: {
      main: '#fff',
      contrastText: '#e3e3e3',
    },
    secondary: {
      main: '#e3e3e3',
    },
  },
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#fff',
          '&.Mui-focused': {
            color: '#fff',
          },
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          color: '#fff',
        },
      },
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <StrictMode>
      <App />
    </StrictMode>
  </ThemeProvider>
)
