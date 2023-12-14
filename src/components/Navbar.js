import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Bell, BellFill, GearFill } from 'react-bootstrap-icons';
import { CheckCircleFill, Search, ExclamationCircleFill } from "react-bootstrap-icons";
import { Container, Button, Dropdown } from "react-bootstrap";

import Logo from "./Logo";
import User from "../assets/user.png";
import UserContext from "../context/UserContext";

const Navbar = () => {
    const context = useContext(UserContext);
    const navigate = useNavigate();

    const logOut = () => {
        context.logout();
        navigate("/login");
    };

    return(
        <div className="Navbar">
            <div className="mobile-bar py-3 px-2 bg-secondary position-fixed bottom-0 w-100" style={{height:"65px", zIndex:10}}>
                <ul className="mobile-bar-icons container-sm d-flex justify-content-between py-0 px-3 px-sm-5">
                    <li>
                        <Link to="">
                            <CheckCircleFill></CheckCircleFill>
                            <div>Servicios</div>
                        </Link>
                    </li>
                    <li>
                        <Link to="">
                            <Search></Search>
                            <div>Buscar</div>
                        </Link>
                    </li>
                    <li>
                        <Link to="">
                            <ExclamationCircleFill></ExclamationCircleFill>
                            <div>Información</div>
                        </Link>
                    </li>
                    <li>
                        <Link to="">
                            <BellFill></BellFill>
                            <div>Notificaciones</div>
                        </Link>
                    </li>
                </ul>
            </div>
            <Container className="container-class">
                <div className="Navbar-content d-flex justify-content-between align-items-center py-2">
                    <div className="main-logo pt-2" onClick={() => navigate("/")}>
                        <Logo></Logo>
                    </div>
                    {/* <img src={Logo} style={{cursor:"pointer"}} alt="Quiero Un Turno" height={100} onClick={() => navigate("/")}/> */}
                    <div className="Navbar-content-cta ms-5 d-grid gap-2 gap-lg-3 d-lg-flex justify-content-end mt-2 mt-lg-0">
                        <div className="d-grid d-lg-flex gap-2 justify-content-end">
                            <Link variant="primary" className="btn btn-primary d-flex align-items-center f-700 mt-lg-2" to={(context.businesses && context.businesses !== 0 ? "/mis-negocios" : "/nuevo/negocio")}>{(context.businesses && context.businesses !== 0 ? "MIS NEGOCIOS" : "QUIERO OFRECER SERVICIOS")}</Link>{' '}
                            <Link variant="outline-primary order-lg-first" className="btn btn-outline-primary d-flex align-items-center f-700 mt-lg-2" to={"/buscar-turno"}>QUIERO BUSCAR UN TURNO</Link>{' '}
                        </div>
                        {
                            context.user ?
                            <div className="user-info d-flex justify-content-end align-items-center">
{/*                                 <Dropdown className="d-flex c-black f-700 g-3 align-items-center justify-content-center order-lg-last">
                                    <Dropdown.Toggle variant="link" id="dropdown-basic">
                                        <Bell width={30} height={30} color={"black"}></Bell>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Link>Notificación 1</Link>
                                        <Link>Notificación 2</Link>
                                    </Dropdown.Menu>
                                </Dropdown> */}
                                <Dropdown className="d-flex c-black f-700 g-3 align-items-center justify-content-center order-lg-last">
                                    <Dropdown.Toggle variant="link" id="dropdown-basic">
                                        <img className="profile-photo" referrerPolicy="no-referrer" src={context.user.imageUrl ? context.user.imageUrl : User} alt={context.user.givenName + " " + context.user.familyName} width={40}/>
                                    </Dropdown.Toggle>
                            
                                    <Dropdown.Menu>
                                    <Dropdown.Item>
                                    <Link to="/mi-perfil">Mis perfil</Link>
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                    <Link to="/mis-turnos">Mis turnos</Link>
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                    <Link to="/mis-negocios">Mis negocios</Link>
                                    </Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={logOut}>Cerrar sesión</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                             :
                            <Link variant="link" className="btn btn-link d-flex c-black f-700 g-3 align-items-center justify-content-center order-first order-lg-last" to={"/login"}>INICIAR SESIÓN <GearFill color="#00C4B4" className="mx-2"></GearFill></Link>
                        }
                    </div>
                </div>
            </Container>
        </div>
    )
};

export default Navbar;