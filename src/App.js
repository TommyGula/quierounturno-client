import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { Container } from "react-bootstrap";
import GlobalState from './context/GlobalState';

// Pages
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import NewCompany from "./pages/NewCompany";
import Payment from "./pages/Payment";
import NewService from "./pages/NewService";
import InviteEmployee from "./pages/InviteEmployee";
import MainPannel from "./pages/MainPannel";
import EmployeeProfile from "./pages/EmployeeProfile";
import StoreProfile from "./pages/StoreProfile";
import MyAgenda from "./pages/MyAgenda";
import StoreAgenda from "./pages/StoreAgenda";
import Search from "./pages/Search";
import UserStore from "./pages/UserStore";
import QuieroUnTurno from "./pages/QuieroUnTurno";
import UserAgenda from "./pages/UserAgenda";

// Components
import Navbar from "./components/Navbar";
import PageContext from "./components/PageContext";
import PaymentMethodConfirmation from "./pages/PaymentMethodConfirmation";
import MyErrorBoundary from "./components/MyErrorBoundary";

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
            <Route path="/mis-negocios" element={<PageContext private><MainPannel/></PageContext>} />
            <Route path="/pago/:id" element={<Payment />} />
            <Route path="/nuevo/negocio" element={<PageContext private><NewCompany /></PageContext>} />
            <Route path="/me/:companyId/nuevo/servicio" element={<PageContext private><NewService /></PageContext>} />
            <Route path="/me/:companyId/equipo/invitar" element={<PageContext private><InviteEmployee /></PageContext>} />
            <Route path="/me/:companyId/equipo/:employeeId" element={<PageContext private><EmployeeProfile /></PageContext>} />
            <Route path="/me/:companyId/agendas/:employeeId" element={<PageContext private><MyAgenda/></PageContext>} />
            <Route path="/me/:companyId/agendas" element={<PageContext private><StoreAgenda/></PageContext>} />
            <Route path="/me/:companyId" element={<PageContext private><StoreProfile /></PageContext>} />
            <Route path="/:companyId" element={<PageContext private><UserStore /></PageContext>} />
            <Route path="/buscar-turno" element={<PageContext private><Search /></PageContext>} />
            <Route path="/agendar/:id" element={<PageContext private><QuieroUnTurno /></PageContext>} />
            <Route path="/mis-turnos" element={<PageContext private><UserAgenda/></PageContext>} />
            <Route path="/auth/mp" element={<PageContext private><PaymentMethodConfirmation /></PageContext>} />
          </Routes>
        </Container>
        </MyErrorBoundary>
      </BrowserRouter>
    </GlobalState>
  );
};

export default App;
