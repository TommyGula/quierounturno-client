import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FormContext from "../components/FormContext";
import SectionTitle from "../components/SectionTitle";
import Spinner from "../components/Spinner";
import { TextField } from "@mui/material";
import { Button } from "react-bootstrap";
import Share from "../assets/share.svg";
import DisplayMore from "../assets/display_more.svg";
import { get } from "../utils/axios";
import {InputAdornment} from "@mui/material";
import { Clipboard } from "react-bootstrap-icons";
import HiddenSection from "../components/HiddenSection";
import ListItem from "../components/ListItem";
import Schedules from "../components/Schedules";
import ItemDropdown from "../components/ItemDropdown";

const requiredFields = [
    "name",
    "categories",
    "location",
    "currency",
    "schedule",
    "description",
    "createdBy",
];

const StoreProfile = ({ context, navigate, show, setShow, redirect, setRedirect, modalTitle, setModalTitle, modalDescription, setModalDescription, handleClose, handleShow, onPageError, handleAlertShow, handleSeeMore, seeMore, copyToClipboard }) => {
    const { companyId } = useParams();
    const [loading, setLoading] = useState(true);
    const [submited, setSubmited] = useState(false);
    const [body, setBody] = useState({});
    const [profile, setProfile] = useState({});
    const [image, setImage] = useState(null);
    const [services, setServices] = useState([]);
    const [editable, setEditable] = useState(false);
    const [store, setStore] = useState(null);
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        getStore();
        getEmployees();
        getServices();
    },[]);

    const getStore = () => {
        get("businesses/" + companyId, context.token, (store) => {
            setStore(store[0]);
            console.log(store[0])
            setLoading(false);
        });
    };

    const handleUpdate = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setProfile({...profile, [name]:value});
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

    const getUser = (id, callback) => {
        get("users/" + id, context.token, (user) => {
            if (user.length) {
                callback(user[0]);
            } else {
                callback(null);
            }
        })
    };

    const getEmployees = () => {
        get("employees?companyId=" + companyId, context.token, (employees) => {
            if (employees.length) {
                for (let employee of employees) {
                    let employeesUser = [];
                    getUser(employee.userId, (user) => {
                        employee["firstName"] = user.firstName;
                        employee["lastName"] = user.lastName;
                        employeesUser.push(employee);
                        if (employee === employees[employees.length - 1]) {
                            setEmployees(employeesUser);
                        };
                    })
                }
            }
        })
    };

    const getServices = () => {
        get("services?companyId=" + companyId, context.token, (resServices) => {
            setServices(resServices);
        });
    };

    const schemaToValue = (schema) => {
        return Object.keys(schema).reduce((r,a) => {
            let day = schema[a].reduce((r2,a2) => {
                let index = schema[a].indexOf(a2) ? "_" + schema[a].indexOf(a2) : "";
                if (a2["from"] && a2["to"]) {
                    r[a + index + "-from"] = a2["from"];
                    r[a + index + "-to"] = a2["to"];
                };
                return r2;
            },[]);
            return r;
        },{});
    };

    return(
        <FormContext setRedirect={setRedirect} id={companyId} body={body} setSubmited={setSubmited} requiredFields={requiredFields} getContext="businesses" user={context.user} token={context.token} method="PUT" modal={handleShow}>
            <Spinner hidden={!loading}></Spinner>
            {
                !loading ?
            <div className="p-4">
                <SectionTitle submited={submited} title="Datos del negocio" onClick={() => handleShow("Título", "Esta es una descripción informativa acerca de la sección que ha clickeado")}></SectionTitle>
                <div className="row row-cols-md-2 g-3 mt-2">
                    <div>
                        <TextField
                            id="name"
                            name="name"
                            className="textfield-primary w-100"
                            label="Nombre del negocio"
                            placeholder="Ingresa un nombre"
                            variant="standard"
                            value={store.name}
                            onChange={handleUpdate}
                            InputProps={{
  readOnly: !editable,
}}
                            error={submited ? !body.name : false}
                        />
                    </div>
                    <div>
                        <TextField
                            id="slogan"
                            name="slogan"
                            className="textfield-primary w-100"
                            label="Slogan"
                            placeholder="Ingresa un slogan"
                            variant="standard"
                            value={store.slogan}
                            InputProps={{
            readOnly: true,}}
                            onChange={handleUpdate}
                        />
                    </div>
                </div>
                <div className="p-4 w-100">
                    <div className="logo rounded rounded-circle position-relative d-flex align-items-center justify-content-center overflow-hidden">
                        {
                            store.logo ?
                            <img src={"http://localhost:3001/uploads/" + store.logo} alt="" width={"100%"}/> :
                            <p className="m-0">Agregar Logo</p>
                        }
                    </div>
                    <div className="add-logo text-center mt-4">
                        <input type="file" id="fileUploader" className="d-none" onChange={handleFileChange}/>
                        <Button variant="primary" className="h-100" onClick={openFiles}>CAMBIAR LOGO</Button>
                    </div>
                </div>
                <div className="mt-2 text-center">
                    <SectionTitle title="Compartir link del negocio" onClick={() => handleShow("Título", "Esta es una descripción informativa acerca de la sección que ha clickeado")}></SectionTitle>
                    <div className="separator mb-2"></div>
                    <div>
                        <TextField
                            id="link"
                            name="link"
                            className="textfield-primary col col-12 col-md-8 col-lg-6"
                            label="Link"
                            variant="standard"
                            onChange={handleUpdate}
                            InputProps={{
                                readOnly: !editable,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Clipboard onClick={() => copyToClipboard(process.env.REACT_APP_PATH + "me/" + companyId)}></Clipboard>
                                    </InputAdornment>
                                ),
                            }}
                            error={submited ? !body.link : false}
                            value={process.env.REACT_APP_PATH + "me/" + companyId}
                        />
                    </div>
                </div>
                <div className="row g-3 mt-2 g-4 row-cols-1 ">
                    <div>
                        <SectionTitle centered title="Compartir publicidad para el negocio" onClick={() => handleShow("Título", "Esta es una descripción informativa acerca de la sección que ha clickeado")}></SectionTitle>
                        <div className="separator mb-2"></div>
                        <div className="text-center mt-3">
                            <img src={Share} className="pointer hoverable" alt="Click here to share link" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="w-100 text-center">
                            <Button variant="primary" className="px-4 py-2 my-4" onClick={() => navigate("/" + companyId + "/agendas/")}>VER AGENDA</Button>
                        </div>
                    </div>
                    <div>
                        <SectionTitle centered title="Demás datos del negocio" onClick={() => handleShow("Título", "Esta es una descripción informativa acerca de la sección que ha clickeado")}></SectionTitle>
                        <div className="separator mb-2"></div>
                        <div className="text-center mt-3">
                            <img src={DisplayMore} onClick={handleSeeMore} seemoretarget="seeMore" className="pointer hoverable" alt="Click here see more info" />
                        </div>
                    </div>
                </div>
                <HiddenSection open={seeMore} index="seeMore">
                    <div className="mb-5">
                        <ItemDropdown items={services} title="Servicios que va a prestar" seemoretarget="services" readonly handleShow={handleShow}></ItemDropdown>
                    </div>                    
                    <div className="">
                        <SectionTitle title="Profesional/es asignado/s al negocio" centered onClick={() => handleShow("Título", "Esta es una descripción informativa acerca de la sección que ha clickeado")}> </SectionTitle>
                        <div className="separator"></div>
                        <ul className="team px-0 mt-3">
                            {
                                employees ? 
                                <div>
                                    {
                                        employees.map(employee => {
                                            return(
                                                <ListItem key={employees.indexOf(employee)} name={employee.firstName} selected={true} lastName={employee.lastName} id={employee._id} url={"/" + companyId + "/equipo/" + employee._id}></ListItem>
                                            )
                                        })
                                    }
                                </div> : null
                            }
                        </ul>
                    </div>
                    <div className="mt-5">
                        <SectionTitle centered title="Horarios de atención" onClick={() => handleShow("Título", "Esta es una descripción informativa acerca de la sección que ha clickeado")}> </SectionTitle>
                        <div className="separator"></div>
                        <Schedules readonly value={schemaToValue(store.schedule)}></Schedules>
                    </div>
                </HiddenSection>
            </div> : null
            }
        </FormContext>
    )
};

export default StoreProfile;