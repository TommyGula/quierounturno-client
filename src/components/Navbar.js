import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Bell, BellFill, GearFill, Person, PersonFill } from 'react-bootstrap-icons';
import { CheckCircleFill, Search, ExclamationCircleFill } from "react-bootstrap-icons";
import { Container, Dropdown } from "react-bootstrap";
import { Button } from "@mui/material";

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
                        {
                            window.location.pathname !== "/" &&
                            <div className="d-grid d-lg-flex gap-2 justify-content-end">
                                <a className="text-decoration-none" href={process.env.REACT_APP_ADMIN_PATH + "nuevo/negocio"}>
                                    <Button className="text-white d-flex align-items-center f-700 mt-lg-2" variant="contained"><strong>QUIERO OFRECER SERVICIOS</strong></Button>
                                </a>{' '}
                                <Link className="text-decoration-none" to={"/"}>
                                <Button className="d-flex align-items-center f-700 mt-lg-2" variant="outlined"><strong>QUIERO BUSCAR UN TURNO</strong></Button></Link>{' '}
                            </div>
                        }
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
                                    <Link to="/mi-perfil" className="text-black text-decoration-none">Mis perfil</Link>
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                    <Link to="/mis-turnos" className="text-black text-decoration-none">Mis turnos</Link>
                                    </Dropdown.Item>
                                    <Dropdown.Item>
                                    <Link to="/mis-negocios" className="text-black text-decoration-none">Mis negocios</Link>
                                    </Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={logOut}>Cerrar sesión</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                             :

                             <>
                                {
                                    !window.location.pathname.includes("login") &&
                            <Link className="text-decoration-none" to={"/login"}><Button className="text-white d-flex align-items-center f-700 mt-lg-2" variant="contained"><strong>INICIAR SESIÓN</strong> <PersonFill color="#FFFFFF" className="mx-2"></PersonFill></Button></Link>
                                }
                             </>
                        }
                    </div>
                </div>
            </Container>
        </div>
    )
};

export default Navbar;