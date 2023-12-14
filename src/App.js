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
import NewCompany from "./pages/NewCompany";
import Payment from "./pages/Payment";
import NewService from "./pages/NewService";
import InviteEmployee from "./pages/InviteEmployee";
import StoreList from "./pages/StoreList";
import EmployeeProfile from "./pages/EmployeeProfile";
import StoreProfile from "./pages/StoreProfile";
import EmployeeAgenda from "./pages/EmployeeAgenda";
import StoreAgenda from "./pages/StoreAgenda";
import Search from "./pages/Search";
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
        <Navbar/>
        <MyErrorBoundary>
        <Container className="container-class">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            <Route path="/mis-negocios" element={<PageContext private><StoreList/></PageContext>} />
            <Route path="/mis-turnos" element={<PageContext private><UserAgenda/></PageContext>} />
            <Route path="/mi-perfil" element={<PageContext2 private><UserProfile/></PageContext2>} />
            <Route path="/pago/:id" element={<Payment />} />
            <Route path="/nuevo/negocio" element={<PageContext private><NewCompany /></PageContext>} />
            <Route path="/me/:companyId/nuevo/servicio" element={<PageContext private><NewService /></PageContext>} />
            <Route path="/me/:companyId/equipo/invitar" element={<PageContext private><InviteEmployee /></PageContext>} />
            <Route path="/me/:companyId/equipo/:employeeId" element={<PageContext private><EmployeeProfile /></PageContext>} />
            <Route path="/me/:companyId/agendas/:employeeId" element={<PageContext private><EmployeeAgenda/></PageContext>} />
            <Route path="/me/:companyId/agendas" element={<PageContext private><StoreAgenda/></PageContext>} />
            <Route path="/me/:companyId" element={<PageContext2 private><StoreProfile /></PageContext2>} />
            <Route path="/:companyId" element={<PageContext2 private><UserStore /></PageContext2>} />
            <Route path="/buscar-turno" element={<PageContext private><Search /></PageContext>} />
            <Route path="/agendar/:id" element={<PageContext private><NewAppointment /></PageContext>} />
            <Route path="/auth/mp" element={<PageContext private><PaymentMethodConfirmation /></PageContext>} />
            <Route path="/admin" element={<PageContext private><Admin /></PageContext>} />
          </Routes>
        </Container>
        </MyErrorBoundary>
      </BrowserRouter>
    </GlobalState>
  );
};

export default App;
