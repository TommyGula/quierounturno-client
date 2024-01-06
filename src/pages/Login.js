import React, {useContext, useState} from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { Button } from "@mui/material";
import {Form} from "react-bootstrap";
import TextField from '@mui/material/TextField';
import MyModal from "../components/MyModal";
import GoogleLoginComponent from "../components/GoogleLoginComponent";
import FacebookLoginComponent from "../components/FacebookLoginComponent";
import UserContext from "../context/UserContext";
import Spinner from "../components/Spinner";

const Login = () => {
    const navigate = useNavigate();
    const context = useContext(UserContext);
    const [searchParams, setSearchParams] = useSearchParams();
    const [show, setShow] = useState(false);
    const [form, setForm] = useState({});
    const [loading, setLoading] = useState(true);
    const [modalTitle, setModalTitle] = useState(null);
    const [modalDescription, setModalDescription] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = (title, description) => {
        setModalTitle(title);
        setModalDescription(description);
        setShow(true);
    };

    const handleCloseAndAccept = () => {
        handleClose();
        if (searchParams.get("before")) {
            navigate(searchParams.get("before"));
        } else {
            navigate("/");
        }
    };

    const handleSubmit = () => {
        setLoading(true);
        if (form.password && form.email) {
            fetch(process.env.REACT_APP_BACKEND_PATH + "users/login", {
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:{
                    email:form.email,
                    password:form.password,
                },
            })
            .then(res=>res.json())
            .then(data=>{
                context.login(data.user, data.accessToken, function() {
                    setLoading(false);
                    handleShow("Inicio de sesión exitoso", "¡Bienvenido " + data.user.firstName + "!");
                });
            })
            .catch(err=>{
                setLoading(false);
                handleShow("Ha ocurrido un error", err.message);
            })
        }
    };

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setForm({... form, [name]:value});
    };
    
    return(
        <div className="Login">
            <MyModal title={modalTitle} description={modalDescription} show={show} onHide={handleClose} primary={"ACEPTAR"} handlePrimary={handleCloseAndAccept}></MyModal>
            <div className={"form-container rounded shadow-sm bg-white p-4 col-12 col-lg-6 m-auto mt-4 " + (loading ? "d-none" : "")}>
                <div>
                    <h3 className="mb-4">Inicia sesión</h3>
                    <FacebookLoginComponent field="Iniciar sesión con Facebook"></FacebookLoginComponent>
                    <GoogleLoginComponent onLoad={() => setLoading(false)} field="Iniciar sesión con Google" onError={handleShow} onSuccess={handleShow}></GoogleLoginComponent>
                    <div className="divider position-relative border-bottom w-100 mb-5">
                        <div className="position-absolute start-0 end-0 m-auto d-flex justify-content-center bottom-10">
                            <h6 className="f-100 p-2 bg-white" style={{color:"gray"}}>O</h6>
                        </div>
                    </div>
                </div>
                <div className="position-relative">
                    <Form>
                        <div className="row row-cols-1 g-4 mb-4">
                            <Form.Group className="">
                                <TextField required type={"email"} id="outlined-required" className="w-100" label="Email" variant="outlined" onChange={handleChange}/>
                            </Form.Group>
                            <Form.Group className="">
                                <TextField required type={"password"} id="outlined-required" className="w-100" label="Contraseña" variant="outlined" onChange={handleChange}/>
                            </Form.Group>
                        </div>
                        <div className="d-flex justify-content-center mb-5">
                            <Button variant="contained" onClick={handleSubmit} className="text-white btn-social col col-12 col-sm-6 col-md-4">Iniciar sesión</Button>
                        </div>
                        </Form>
                </div>
                <h6 className="mb-4">¿No tienes una cuenta?</h6>
                <Button variant="outlined" className="btn-social mb-5" onClick={() => navigate("/register")}>Registrate</Button>
            </div>
            <Spinner hidden={!loading}></Spinner>
        </div>
    )
};

export default Login;