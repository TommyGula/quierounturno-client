import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { Container } from "react-bootstrap";

// Pages
import Login from "./pages/Login";

// Components
import Navbar from "./components/Navbar";

const App = () => {
  return(
    <BrowserRouter>
      <Navbar/>
      <Container className="container-class">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
};

export default App;
