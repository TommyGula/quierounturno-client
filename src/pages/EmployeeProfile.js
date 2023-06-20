import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FormContext from "../components/FormContext";
import SectionTitle from "../components/SectionTitle";
import ItemDropdown from "../components/ItemDropdown";
import { TextField, InputLabel } from "@mui/material";
import { Button } from "react-bootstrap";
import Avatar from "../assets/avatar.png";
import { get } from "../utils/axios";
import Spinner from "../components/Spinner";
import {InputAdornment} from "@mui/material";
import { Clipboard } from "react-bootstrap-icons";

const requiredFields = [
    "firstName",
    "lastName"
];

const EmployeeProfile = ({ context, navigate, show, setShow, redirect, setRedirect, modalTitle, setModalTitle, modalDescription, setModalDescription, handleClose, handleShow, onPageError, copyToClipboard }) => {
    const { companyId, employeeId } = useParams();
    const [submited, setSubmited] = useState(false);
    const [loading, setLoading] = useState(true);
    const [body, setBody] = useState({});
    const [profile, setProfile] = useState({});
    const [image, setImage] = useState(null);
    const [services, setServices] = useState([]);
    const [employee, setEmployee] = useState(null);

    useEffect(() => {
        getEmployee();
    },[]);

    const getUser = (id, callback) => {
        get("users/" + id, context.token, (user) => {
            if (user.length) {
                callback(user[0]);
            } else {
                callback(null);
            }
        })
    };

    const getEmployee = () => {
        get("employees/" + employeeId, context.token, (employees) => {
            if (employees.length) {
                for (let employee of employees) {
                    let employeesUser = [];
                    getUser(employee.userId, (user) => {
                        employee["firstName"] = user.firstName;
                        employee["lastName"] = user.lastName;
                        employee["email"] = user.email;
                        employee["DNI"] = user.DNI;
                        employee["code"] = user.code;
                        employee["phone"] = user.phone;
                        employeesUser.push(employee);
                        setEmployee(employeesUser[0]);
                        const employeeServices = employeesUser[0].services.reduce((r,a) => {
                            get("services/" + a, context.token, (service) => {
                                r.push(service[0]);
                            })
                            setServices(r);
                            return r;
                        },[]);
                        setTimeout(() => {
                            setServices(employeeServices)
                        },1000)
                        setLoading(false);
                    });
                }
            }
        })
    };

    const handleFileChange = async (e) => {
        const img = {
          preview: URL.createObjectURL(e.target.files[0]),
          data: e.target.files[0],
        }
        let formData = new FormData()
        formData.append('file', img.data);
        formData.append('userId', context.user._id);
        const response = await fetch('http://localhost:3001/upload', {
            method: 'POST',
            body: formData,
        })
        if (response) {
            setImage(img);
        };
    };

    const openFiles = () => {
        const input = document.getElementById("fileUploader");
        input.click();
    };


    return(
        <FormContext setRedirect={setRedirect} body={body} setSubmited={setSubmited} requiredFields={requiredFields} context="employee" user={context.user} token={context.token} method="PUT" modal={handleShow}>
            <Spinner hidden={!loading}></Spinner>
            {
                !loading ?
            <div className="p-4">
                <SectionTitle submited={submited} title="Datos Personales" onClick={() => handleShow("Título", "Esta es una descripción informativa acerca de la sección que ha clickeado")}></SectionTitle>
                <div className="row row-cols-md-2 g-3 mt-2">
                    <div>
                        <TextField
                            id="firstName"
                            name="firstName"
                            className="textfield-primary w-100"
                            label="Nombre"
                            placeholder="Ingresa un nombre"
                            variant="standard"
                            readonly
                            value={employee.firstName}
                        />
                    </div>
                    <div>
                        <TextField
                            id="lastName"
                            name="lastName"
                            className="textfield-primary w-100"
                            label="Apellido"
                            placeholder="Ingresa un apellido"
                            variant="standard"
                            readonly
                            value={employee.lastName}
                        />
                    </div>
                    <div>
                        <TextField
                            id="email"
                            name="email"
                            className="textfield-primary w-100"
                            label="Email"
                            helperText='tuinvitado@email.com'
                            variant="standard"
                            width="auto"
                            readonly
                            value={employee.email}
                        />
                    </div>
                </div>
                <div className="p-4 w-100">
                    <div className="logo rounded rounded-circle position-relative d-flex align-items-center justify-content-center overflow-hidden">
                        {
                            image ?
                            <img src={"http://localhost:3001/uploads/" + image.data.name} alt={image.data.name} width={"100%"}/> :
                            <img width={"100%"} src={Avatar} alt="No profile image selected" />
                        }
                    </div>
                    <div className="add-logo text-center mt-4">
                        <input type="file" id="fileUploader" className="d-none" onChange={handleFileChange}/>
                        <Button variant="primary" className="h-100" onClick={openFiles}>CAMBIAR IMÁGEN</Button>
                    </div>
                </div>
                <div className="row g-3 mt-2">
                    <div className="col col-12 col-lg-6">
                    <InputLabel htmlFor="standard-adornment-amount">Documento</InputLabel>
                        <TextField
                            id="DNI"
                            name="DNI"
                            className="textfield-primary w-100"
                            label="Documento"
                            placeholder="Ingresa un número de documento"
                            type="number"
                            variant="standard"
                            readonly
                            value={employee.DNI}
                        />
                    </div>
                    <div className="col col-4 col-lg-2">
                        <InputLabel htmlFor="standard-adornment-amount">Teléfono</InputLabel>
                        <TextField
                                id="code"
                                name="code"
                                className="textfield-primary w-100"
                                label="Código"
                                helperText='011'
                                variant="standard"
                                width="auto"
                                readonly
                                value={employee.code}
                        />
                    </div>
                    <div className="col col-8 col-lg-4">
                        <InputLabel htmlFor="standard-adornment-amount" style={{color:"white"}}>Teléfono</InputLabel>
                        <TextField
                                id="phone"
                                name="phone"
                                className="textfield-primary w-100"
                                label="Número"
                                helperText='1111111111'
                                variant="standard"
                                width="auto"
                                readonly
                                value={employee.phone}
                        />
                    </div>
                </div>
                <div className="mt-5">
                    {
                        !services.length ?
                        <Spinner></Spinner> :
                    <ItemDropdown items={services} title="Servicios prestados" readonly handleShow={handleShow} seemoretarget="employeeProfile"></ItemDropdown>
                    }
                </div>
                <div className="mt-4">
                    <div className="w-100 text-center">
                        <Button variant="primary" className="px-5 py-3 my-4" onClick={() => navigate("/" + companyId + "/agendas/" + employeeId)}>VER AGENDA</Button>
                    </div>
                </div>
                <div className="mt-2 text-center">
                    <SectionTitle title="Compartir disponibiliad" onClick={() => handleShow("Título", "Esta es una descripción informativa acerca de la sección que ha clickeado")}></SectionTitle>
                    <div className="separator mb-2"></div>
                    <div>
                        <TextField
                            id="link"
                            name="link"
                            className="textfield-primary col col-12 col-md-8 col-lg-6"
                            label="Link"
                            variant="standard"
                            InputProps={{
                                readOnly: true,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Clipboard onClick={() => copyToClipboard(process.env.REACT_APP_PATH + companyId)}></Clipboard>
                                    </InputAdornment>
                                ),
                            }}
                            value={process.env.REACT_APP_PATH + companyId + "/equipo/" + employeeId}
                        />
                    </div>
                </div>
            </div> : null
            }
        </FormContext>
    )
};

export default EmployeeProfile;