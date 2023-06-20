import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import {Button, Form} from "react-bootstrap";
import TextField from '@mui/material/TextField';
import Facebook from "../assets/facebook.png";
import MyModal from "../components/MyModal";
import GoogleLoginComponent from "../components/GoogleLoginComponent";
import FacebookLoginComponent from "../components/FacebookLoginComponent";
import Spinner from "../components/Spinner";

const Register = () => {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [hasAccount, setHasAccount] = useState(false);
    const [modalTitle, setModalTitle] = useState(null);
    const [modalDescription, setModalDescription] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleClose = () => setShow(false);
    const handleShow = (title, description) => {
        setModalTitle(title);
        setModalDescription(description);
        setShow(true);
    };
    
    return(
        <div className="Register">
            <MyModal title={modalTitle} description={modalDescription} show={show} onHide={handleClose} secondary={"CERRAR"} handleSecondary={handleClose}></MyModal>
            <div className="form-container rounded shadow-sm bg-white p-4 col-12 col-lg-6 m-auto mt-4">
                {
                    !hasAccount ?
                    <div>
                        <h3 className="mb-4">Crea una cuenta</h3>
                        <p className="mb-3">Selecciona cómo prefieres registrar tu cuenta</p>
        {/*                 <button onClick={loginFacebook} className="btn-social btn-facebook mb-3 d-flex justify-content-center align-items-center">
                            <img src={Facebook} alt="Login with Facebook" height={20} width={20} className="mx-3"/>
                            Crear con Facebook
                        </button>
                        <button onClick={loginGoogle} className="btn-social btn-google mb-5 d-flex justify-content-center align-items-center">
                            <img src={Google} alt="Login with Google" height={20} width={20} className="mx-3"/>
                            Crear con Google
                        </button> */}
                        <FacebookLoginComponent field="Crear con Facebook" ></FacebookLoginComponent>
                        <GoogleLoginComponent onLoad={() => setLoading(false)} field="Crear con Google" onError={handleShow} onSuccess={handleShow}></GoogleLoginComponent>
                        <div className="divider position-relative border-bottom w-100 mb-5">
                            <div className="position-absolute start-0 end-0 m-auto d-flex justify-content-center bottom-10">
                                <h6 className="f-100 p-2 bg-white" style={{color:"gray"}}>O</h6>
                            </div>
                        </div>
                        <Button variant="primary" className="btn-social mb-5"  onClick={() => setHasAccount(true)}>Registrarme con mi correo</Button>
                    </div> :
                    <div className="position-relative">
                        <h3 className="mb-4">Registrate con tu email</h3>
                        <Button variant="link" className="position-absolute top-0 end-0" onClick={() => setHasAccount(false)}>Volver</Button>
                        <p className="mb-3">Ingresá tus datos para crear una cuenta</p>
                        <Form>
                            <div className="row row-cols-lg-2 g-4 mb-4">
                                <Form.Group className="">
                                    <TextField required id="outlined-required" className="w-100" label="Nombre" variant="outlined" />
                                </Form.Group>
                                <Form.Group className="">
                                    <TextField required id="outlined-required" className="w-100" label="Apellido" variant="outlined" />
                                </Form.Group>
                            </div>
                            <div className="row row-cols-1 g-4 mb-4">
                                <Form.Group className="">
                                    <TextField required type={"email"} id="outlined-required" className="w-100" label="Email" variant="outlined" />
                                </Form.Group>
                                <Form.Group className="">
                                    <TextField required type={"password"} id="outlined-required" className="w-100" label="Contraseña" variant="outlined" />
                                </Form.Group>
                            </div>
                            <div className="d-flex justify-content-center mb-5">
                                <Button variant="primary" className="btn-social col col-12 col-sm-6 col-md-4">Registrarme</Button>
                            </div>
                           </Form>
                    </div>
                }
                <p className="text-muted mb-4"><small>Al crear la cuenta, confirmas que has leido y aceptado nuestros <a href="" className="">Terminos de Servico y Politicas de Privacidad.</a></small></p>
                <h6 className="mb-4">¿Ya tienes una cuenta?</h6>
                <Button variant="outline-primary order-lg-first" className="btn-social mb-5" onClick={() => navigate("/login")}>Iniciar sesión</Button>
            </div>
            <Spinner hidden={!loading}></Spinner>
        </div>
        
    )
};

export default Register;