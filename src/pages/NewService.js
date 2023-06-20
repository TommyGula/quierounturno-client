import React, { useContext, useState, useEffect } from "react";
import { TextField } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import OutlinedInput from '@mui/material/OutlinedInput';
import Slider from '@mui/material/Slider';
import { Button } from "react-bootstrap";
import { Info } from "react-bootstrap-icons";
import Schedules from "../components/Schedules";
import { formatScheduleBody } from "../components/Schedules";
import ListItem from "../components/ListItem";
import AddPictures from "../components/AddPictures";
import FormContext from "../components/FormContext";
import SectionTitle from "../components/SectionTitle";
import {useParams} from "react-router-dom";
import {get} from "../utils/axios";

const valueLabelFormat = (value) => {
    return `${value} %`;
};
    
const requiredFields = [
    "name",
    "companyId",
    "price",
    "minutesLength",
    "deposit",
    "schedule",
    "description",
    "employees",
];

const NewService = ({ context, navigate, show, setShow, redirect, setRedirect, modalTitle, setModalTitle, modalDescription, setModalDescription, handleClose, handleShow, onPageError }) => {
    const { companyId } = useParams();
    const [value, setValue] = useState({});
    const [disabledSlider, setDisabledSlider] = useState(false);
    const [service, setservice] = useState({});
    const [photos, setPhotos] = useState([]);
    const [typeStyle, setTypeStyle] = useState(["btn-primary", "btn-outline-primary"]);
    const [submited, setSubmited] = useState(false);
    const [body, setBody] = useState({});
    const [employees, setEmployees] = useState(null);
    const [selectedEmployees, setSelectedEmployees] = useState([]);

    const [deposit, setDeposit] = useState(30);
    
    const handleSliderChange = (event) => {
        setDeposit(event.target.value);
    };
    
    const handleInputChange = (event) => {
        setDeposit(event.target.value === '' ? '' : parseInt(event.target.value));
    };
    
    const handleBlur = () => {
        if (deposit < 0) {
            setDeposit(0);
        } else if (deposit > 100) {
            setDeposit(100);
        }
    };
    
    useEffect(() => {
        document.getElementById("virtual").classList.remove("btn-primary");
        getEmployees();
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
                        if (employee.role === "OWNER") {
                            setSelectedEmployees(selectedEmployees => [...selectedEmployees, employee._id])
                        };
                    })
                }
            }
        })
    };

    const handleUpdate = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setservice({...service, [name]:value});
    };

    const handleChange = (e, name) => {
        setValue({...value, [name]:e});
    };

    const handleDisableSlider = () => {
        var deposit = document.getElementById("deposit");
        var fixedDeposit = document.getElementsByClassName("css-1q6at85-MuiInputBase-root-MuiOutlinedInput-root")[0];
        if (disabledSlider) {
            deposit.classList.add("Mui-focused");
            fixedDeposit.classList.remove("Mui-focused");
        } else {
            deposit.classList.remove("Mui-focused");
            fixedDeposit.classList.add("Mui-focused");
        };
        setDisabledSlider(!disabledSlider);
    };

    const switchType = (e) => {
        const variant = e.target.classList;
        const id = e.target.id;
        if (variant.contains("btn-outline-primary")) {
            e.target.classList.remove("btn-outline-primary");
            e.target.classList.add("btn-primary");
            if (id === "virtual") {
                const deactivate = document.getElementById("inPerson");
                deactivate.classList.add("btn-outline-primary");
                deactivate.classList.remove("btn-primary");
            } else {
                const deactivate = document.getElementById("virtual");
                deactivate.classList.add("btn-outline-primary");
                deactivate.classList.remove("btn-primary");
            };
        };
    };

    const getBody = () => {
        const myService = {
            createdBy:context.user._id,
            name:service.name,
            companyId:companyId,
            price:service.price,
            minutesLength:service.minutesLength,
            deposit:disabledSlider ? service.fixedDeposit : deposit / 100,
            type:Array.prototype.slice.call(document.getElementsByName("type-service"),0).filter(type=>!type.classList.contains("btn-outline-primary"))[0].value,
            schedule:Object.keys(value).length > 0 ? formatScheduleBody(value) : {},
            description:service.description,
            additionlText:service.additionalText,
            employees:selectedEmployees,
            photos:photos.map(photo=>photo.data.name),
        };
        setBody(myService);
    };

    useEffect(() => {
        getBody();
    }, [service, disabledSlider, value, photos, photos]);

    return(
        <FormContext redirect={"/my-panel"} id={companyId} cta="CREAR"  redirectMessage="Ahora invita a las personas que trabajarán en tu nuevo servicio" setRedirect={setRedirect} body={body} setSubmited={setSubmited} requiredFields={requiredFields} getContext="businesses" postContext="services" user={context.user} token={context.token} method="POST" modal={handleShow}>
            <div className="p-4">
                <SectionTitle submited={submited} title="Nuevo Servicio" onClick={() => handleShow("Título", "Esta es una descripción informativa acerca de la sección que ha clickeado")}></SectionTitle>
                    <div className="row row-cols-md-2 g-3 mt-2">
                        <div className="w-100">
                            <TextField
                                id="name"
                                name="name"
                                className="textfield-primary w-100"
                                label="Dale un nombre a tu nuevo servicio"
                                helperText='"Corte básico"'
                                placeholder="Ingresa un nombre"
                                variant="standard"
                                onChange={handleUpdate}
                                width="auto"
                                required
                                error={submited ? !body.name : false}
                            />
                        </div>
                        <div>
                        <FormControl fullWidth sx={{ m: 1 }} variant="standard" className="mx-0 textfield-primary">
                            <InputLabel htmlFor="standard-adornment-amount">Precio</InputLabel>
                            <Input
                                onChange={handleUpdate}
                                id="price"
                                name="price"
                                placeholder="Precio por servicio"
                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                required
                                error={submited ? !body.price : false}
                            />
                        </FormControl>
                        </div>
                        <div>
                        <FormControl fullWidth sx={{ m: 1 }} variant="standard" className="mx-0 textfield-primary">
                            <InputLabel htmlFor="standard-adornment-amount">Duración</InputLabel>
                            <Input
                                id="minutesLength"
                                onChange={handleUpdate}
                                name="minutesLength"
                                placeholder="Duración del servicio (minutos)"
                                startAdornment={<InputAdornment position="start">🕗</InputAdornment>}
                                required
                                error={submited ? !body.minutesLength : false}
                            />
                        </FormControl>
                        </div>
                    </div>
                    <div className="mt-4">
                        <SectionTitle submited={submited} title="Seña" onClick={() => handleShow("Título", "Esta es una descripción informativa acerca de la sección que ha clickeado")} validationtext="Completa todos los campos requeridos" requiredtarget={body.deposit}></SectionTitle>
                        <div className="separator"></div>
                        <div className="row align-items-center mt-3">

                            <div className="col col-12 col-lg-8">
                                <div className="row">
                                    <div className="col col-9 d-flex">
                                        <div className="form-check align-self-center mx-2 col col-1">
                                            <input type="checkbox" defaultChecked={true} className="form-check-input" onChange={handleDisableSlider}/>
                                        </div>
                                        <Slider 
                                            disabled={disabledSlider}
                                            value={typeof deposit === 'number' ? deposit : 0}
                                            onChange={handleSliderChange}
                                            valueLabelFormat={valueLabelFormat}
                                            valueLabelDisplay="auto"
                                        />
                                    </div>
                                    <div className="col col-3">
                                    <Input
                                        disabled={disabledSlider}
                                        id="deposit"
                                        name="deposit"
                                        value={deposit}
                                        size="small"
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        endAdornment={<InputAdornment position="end">%</InputAdornment>}
                                        inputProps={{
                                        step: 10,
                                        min: 0,
                                        max: 100,
                                        type: 'number',
                                        'aria-labelledby': 'input-slider',
                                        }}
                                        required={!disabledSlider}
                                        error={submited ? !body.deposit : false}
                                    />
                                    </div>
                                </div>
                            </div>
                            <div className="col col-12 col-lg-4">
                                <FormControl fullWidth sx={{ m: 1 }}  className="textfield-primary mt-4 mt-lg-0 mx-0" disabled={!disabledSlider}>
                                    <InputLabel htmlFor="outlined-adornment-amount">Seña fija</InputLabel>
                                    <OutlinedInput
                                        id="fixedDeposit"
                                        onChange={handleUpdate}
                                        name="fixedDeposit"
                                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                        label="Seña fija"
                                        required
                                        error={submited ? !body.deposit : false}
                                    />
                                </FormControl>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5">
                        <SectionTitle submited={submited} title="Horarios del servicio" validationtext="Selecciona un horario del servicio" requiredtarget={body.schedule} validationFunction={(val) => Object.keys(val).filter(key=>val[key]).length > 0} onClick={() => handleShow("Título", "Esta es una descripción informativa acerca de la sección que ha clickeado")}> </SectionTitle>
                        <div className="separator"></div>
                            <Schedules handleChange={handleChange} value={value} setValue={setValue}></Schedules>
                    </div>
                    <div className="mt-5">
                        <SectionTitle submited={submited} title="Tipo de servicio" validationtext="Selecciona un tipo de servicio" requiredtarget={body.type} onClick={() => handleShow("Título", "Esta es una descripción informativa acerca de la sección que ha clickeado")}> </SectionTitle>
                        <div className="separator"></div>
                        <div className="type-service">
                            <div className="row row-cols-2 justify-content-center">
                                <div className="text-end">
                                    <Button value="inPerson" id="inPerson" name="type-service" className={"py-3 my-4 col col-10 col-md-8 " + typeStyle[0]} onClick={switchType}>PRESENCIAL</Button>
                                </div>
                                <div className="text-start">
                                    <Button value="virtual" id="virtual" name="type-service" className={"py-3 my-4 col col-10 col-md-8 " + typeStyle[1]} onClick={switchType}>VIRTUAL</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5">
                        <SectionTitle submited={submited} title="Descripción del servicio" validationtext="Escribe una descripción del servicio" requiredtarget={body.description} onClick={() => handleShow("Título", "Esta es una descripción informativa acerca de la sección que ha clickeado")}> </SectionTitle>
                        <div className="separator mb-4"></div>
                        <div className="form-group shadow-textarea">
                            <textarea className="form-control p-4" id="description" name="description" placeholder="Incluye barba y peinado" rows="3" onChange={handleUpdate} required error={(submited ? (typeof body.description === 'undefined') : false).toString()}></textarea>
                        </div>
                    </div>
                    <div className="mt-5">
                        <h3 className="title">Aclaraciones adicionales <Info className="info-icon"  onClick={() => handleShow("Título", "Esta es una descripción informativa acerca de la sección que ha clickeado")}></Info></h3>
                        <div className="separator mb-4"></div>
                        <div className="form-group shadow-textarea">
                            <textarea className="form-control p-4" id="additionalText" name="additionalText" placeholder="Para bodas o fiestas de 15, reservar turno con anticipación" rows="3" onChange={handleUpdate}></textarea>
                        </div>
                    </div>
                    <div className="mt-5">
                        <SectionTitle submited={submited} title="Profesional/es asignado/s" validationtext="Selecciona uno o más profesionales asignados al servicio" requiredtarget={body.employees} validationFunction={(val) => val.length > 0} onClick={() => handleShow("Título", "Esta es una descripción informativa acerca de la sección que ha clickeado")}> </SectionTitle>
                        <div className="separator mb-4"></div>
                        <ul className="team px-0">
                            {
                                employees ? 
                                <div>
                                    {
                                        employees.map(employee => {
                                            return(
                                                <ListItem key={employees.indexOf(employee)} name={employee.firstName} add={(item) => setSelectedEmployees(selectedEmployees => [...selectedEmployees, item])} remove={(item) => setSelectedEmployees(selectedEmployees.filter(i=>i !== item))} selected={selectedEmployees.includes(employee._id)} lastName={employee.lastName} id={employee._id}></ListItem>
                                            )
                                        })
                                    }
                                </div> : null
                            }
                        </ul>
                    </div>
                    <div className="mt-5">
                        <h3 className="title">Fotos</h3>
                        <div className="separator mb-4"></div>
                        <AddPictures photos={photos} setPhotos={setPhotos} ></AddPictures>
                    </div>
                </div>
        </FormContext>
    )
};

export default NewService;