import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { Container } from "react-bootstrap";
import GlobalState from './context/GlobalState';
import { createTheme, ThemeProvider } from '@mui/material';

// Pages
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Payment from "./pages/Payment";
import StoreList from "./pages/StoreList";
import UserStore from "./pages/UserStore";
import UserProfile from "./pages/UserProfile";
import NewAppointment from "./pages/NewAppointment";
import UserAgenda from "./pages/UserAgenda";
import Admin from "./pages/AdminHttp";

// Components
import Navbar from "./components/Navbar";
import PageContext from "./components/PageContext";
import PageContext2 from "./components/PageContext2";
import PaymentMethodConfirmation from "./pages/PaymentMethodConfirmation";
import MyErrorBoundary from "./components/MyErrorBoundary";

// App Themes
const theme = createTheme({
  palette: {
    primary: {
      main: "#00C4B4",
    },
  },
});

const App = () => {
  return(
    <GlobalState>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Navbar/>
          <MyErrorBoundary>
          <Container className="container-class">
            <Routes>
              <Route path="/" element={<PageContext2 embed noLoad><Home /></PageContext2>} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Register />} />
              <Route path="/mis-turnos" element={<PageContext private><UserAgenda/></PageContext>} />
              <Route path="/mi-perfil" element={<PageContext2 private><UserProfile/></PageContext2>} />
              <Route path="/pago/:id" element={<Payment />} />
              <Route path="/:companyId" element={<PageContext2 private><UserStore /></PageContext2>} />
              <Route path="/agendar/:companyId" element={<PageContext2 private><NewAppointment /></PageContext2>} />
            </Routes>
          </Container>
          </MyErrorBoundary>
        </ThemeProvider>
      </BrowserRouter>
    </GlobalState>
  );
};

export default App;
