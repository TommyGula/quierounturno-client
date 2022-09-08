import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { GearFill } from 'react-bootstrap-icons';
import { Container, Button } from "react-bootstrap";

import Logo from "../assets/QUT_Logo.png";

const Navbar = () => {
    const route = window.location.pathname;
    const navigate = useNavigate();

    useEffect(() => {
        console.log(route)
    },[])

    return(
        <div className="Navbar">
            <Container className="container-class">
                <div className="Navbar-content d-flex justify-content-between align-items-center py-2">
                    <img src={Logo} style={{cursor:"pointer"}} alt="Quiero Un Turno" height={100} onClick={() => navigate("/")}/>
                    {
                        route.includes("login") ?
                        null :
                        <div className="Navbar-content-cta ms-5 d-grid gap-2 gap-lg-3 d-lg-flex justify-content-end mt-2 mt-lg-0">
                            <Button variant="link" className="d-flex g-3 align-items-center justify-content-center order-lg-last" onClick={() => navigate("/login")}>INICIAR SESIÓN <GearFill color="#00C4B4" className="mx-2"></GearFill></Button>
                            <Button variant="primary">QUIERO OFRECER SERVICIOS</Button>{' '}
                            <Button variant="outline-primary order-lg-first">QUIERO BUSCAR UN TURNO</Button>{' '}
                        </div>
                    }  
                </div>
            </Container>
        </div>
    )
};

export default Navbar;