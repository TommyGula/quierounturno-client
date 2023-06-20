import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import Slider from '@mui/material/Slider';
import Schedules from "../components/Schedules";
import ItemDropdown from "../components/ItemDropdown";
import EmployeeRoles from "../components/EmployeeRoles";
import FormContext from "../components/FormContext";
import SectionTitle from "../components/SectionTitle";
import { get } from "../utils/axios";
import Spinner from "../components/Spinner";

const valueLabelFormat = (value) => {
    return `${value} %`;
};

const permissions = [
    {
        name:"Agendar turnos",
    },
    {
        name:"Asignar turnos",
    },
    {
        name:"Cargar turnos",
    },
    {
        name:"Otro turnos",
    },
    {
        name:"Otro turnos",
    },
    {
        name:"Otro turnos",
    },
];

const commissions = [
    {
        id:1,
        name:"Servicios propios"
    },
    {
        id:2,
        name:"Servicios de la sucursal"
    },
    {
        id:3,
        name:"Servicios de la empresa"
    }
];

const servicesItems = [
    {
        id:1,
        name:"Service 1",
    },
    {
        id:2,
        name:"Service 2",
    },
    {
        id:3,
        name:"Service 3",
    }
];

const requiredFields = [
    "email",
    "companyId",
    "salary",
    "store",
    "role",
    "schedule",
    "permissions",
    "services",
];

const InviteEmployee = ({ context, navigate, show, setShow, redirect, setRedirect, modalTitle, setModalTitle, modalDescription, setModalDescription, handleClose, handleShow, onPageError }) => {
    const [value, setValue] = useState({});
    const [disabledSlider, setDisabledSlider] = useState({1:false,2:false,3:false});
    const [toInvite, setToInvite] = useState({});
    const [stores, setStores] = useState([]);
    const [allStores, setAllStores] = useState(null);
    const [services, setServices] = useState([]);
    const [fixedSalary, setFixedSalary] = useState(true);
    const [submited, setSubmited] = useState(false);
    const [body, setBody] = useState({});

    const [salary, setSalary] = useState({1:0,2:0,3:0});

    useEffect(() => {
        getBody();
    },[value, fixedSalary])

    useEffect(() => {
        getStores();
    },[]);
    
    const getStores = () => {
        get("businesses?createdBy=" + context.user._id, context.token, (response) => {
            setAllStores(response);
        });
    };
    
    const handleSliderChange = (event) => {
        const name = event.target.name.split("-")[1];
        const value = event.target.value;
        setSalary({... salary, [name]:value});
    };

    const handleStores = (e) => {
        const checked = e.target.checked;
        const name = e.target.name;

        if (!checked) {
            setStores(stores.filter(store => store.id !== name));
        } else {
            setStores(stores => [...stores, name]);
        };
    };

    const handleServices = (e) => {
        const checked = e.target.checked;
        const name = e.target.name;

        if (!checked) {
            setServices(services.filter(service => service.id !== name));
        } else {
            setServices(services => [...services, name]);
        };
    };
    
    const handleInputChange = (event) => {
        const name = event.target.name.split("-")[1];
        const value = event.target.value === '' ? '' : parseInt(event.target.value);
        setSalary({... salary, [name]:value});
    };
    
    const handleBlur = () => {
        if (salary < 0) {
            setSalary(0);
        } else if (salary > 100) {
            setSalary(100);
        }
    };

    const handleDisableSlider = (e) => {
        const id = e.target.name.split("-")[2];
        const checked = !e.target.checked;
        console.log(checked, id)
        if (id === "all") {
            setDisabledSlider({
                1:checked,
                2:checked,
                3:checked,
            });
        } else {
            setDisabledSlider({...disabledSlider, [id]:checked});
        };
    };

    const handleUpdate = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setToInvite({...toInvite, [name]:value});
    };

    const handleChange = (e, name) => {
        setValue({...value, [name]:e});
    };

    const getBody = () => {
        const newUser = {
            email:toInvite.email,
            phone:(toInvite.code && toInvite.phone ? toInvite.code + " " + toInvite.phone : null),
            stores:stores,
            role:toInvite.role || 1,
            permissions:permissions,
            salary:toInvite["fixed-salary"],
            salaryByOwnServices:salary[1],
            salaryByStoreServices:salary[2],
            salaryByCompanyServices:salary[3],
            services:services,
            schedules:value,
        };
        setBody(newUser);
    };

    return(
        <FormContext setRedirect={setRedirect} body={body} cta="CREAR" setSubmited={setSubmited} requiredFields={requiredFields} context="businesses" user={context.user} token={context.token} method="PUT" modal={handleShow}>
            <div className="p-4">
                <SectionTitle submited={submited} title="Invita a alguien a formar parte de tu negocio" onClick={() => handleShow("Título", "Esta es una descripción informativa acerca de la sección que ha clickeado")}></SectionTitle>
                    <div className="row g-3 mt-2">
                        <div className="w-100">
                            <TextField
                                id="email"
                                name="email"
                                className="textfield-primary w-100"
                                label="Email de la persona que quieres invitar"
                                helperText='tuinvitado@email.com'
                                variant="standard"
                                onChange={handleUpdate}
                                width="auto"
                                required
                                error={submited ? !body.email : false}
                            />
                        </div>
                        <div className="col col-4 col-md-3 col-lg-2">
                        <InputLabel htmlFor="standard-adornment-amount">Teléfono</InputLabel>
                        <TextField
                                id="code"
                                name="code"
                                className="textfield-primary w-100"
                                label="Código"
                                helperText='011'
                                variant="standard"
                                onChange={handleUpdate}
                                width="auto"
                                required
                                error={submited ? !body.code : false}
                        />
                        </div>
                        <div className="col col-8 col-md-6 col-lg-4">
                        <InputLabel htmlFor="standard-adornment-amount" style={{color:"white"}}>Teléfono</InputLabel>
                        <TextField
                                id="phone"
                                name="phone"
                                className="textfield-primary w-100"
                                label="Número"
                                helperText='1111111111'
                                variant="standard"
                                onChange={handleUpdate}
                                width="auto"
                                required
                                error={submited ? !body.phone : false}
                        />
                        </div>
                    </div>
                    <div className="mt-4">
                        {
                            allStores ?
                            <ItemDropdown seemoretarget="invite-stores" onChange={handleStores} items={allStores} title="Asignar sucursal" handleShow={handleShow} required error={submited ? !body.stores : false}></ItemDropdown> :
                            <Spinner></Spinner>
                        }

                    </div>
                    <div className="mt-5">
                        <SectionTitle submited={submited} title="Asignar rol" onClick={() => handleShow("Título", "Esta es una descripción informativa acerca de la sección que ha clickeado")} validationtext="Debes seleccionar un rol" requiredtarget={body.role}></SectionTitle>
                        <div className="separator"></div>
                        <EmployeeRoles handleChange={handleUpdate}></EmployeeRoles>
                    </div>
                    <div className="mt-5">
                        <SectionTitle submited={submited} title="Permisos" onClick={() => handleShow("Título", "Esta es una descripción informativa acerca de la sección que ha clickeado")} validationtext="Debes seleccionar al menos un permiso" requiredtarget={body.permissions}></SectionTitle>
                        <div className="separator"></div>
                        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 py-3">
                            {
                                [0,1,2].map((i) => {
                                    return(
                                        <div className="col" key={i}>
                                            {
                                                permissions.slice(i*5, (i+1)*5).map((permission) => {
                                                    return(
                                                        <div className="permission-item d-flex mt-2" key={permission.id}>
                                                            <input type="checkbox" className="form-check-input" name={"permission-" + permission.id} onChange={handleUpdate}/>
                                                            <p className="ms-2 mb-0">{permission.name}</p>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="mt-4">
                        <SectionTitle submited={submited} title="Salario del profesional" onClick={() => handleShow("Título", "Esta es una descripción informativa acerca de la sección que ha clickeado")} validationtext="Debes indicar un salario para el profesional" requiredtarget={body.permissions}></SectionTitle>
                        <div className="separator"></div>
                        <div className="mt-4">
                            <div className="d-flex w-100 mb-4">
                                <p className="mb-0">Salario fijo</p>
                                <input type="checkbox" className="form-check-input ms-3" name="fixed-salary" onChange={(e) => setFixedSalary(!e.target.checked)}/>
                            </div>
                            <TextField id="outlined-basic" label="Salario fijo" name="fixed-salary" disabled={fixedSalary} variant="outlined" required error={submited ? body.salary : false} onChange={handleUpdate}/>
                        </div>
                        <div className="separator mt-4"></div>
                        <div className="mt-4">
                            <div className="d-flex w-100 mb-4">
                                <p className="mb-0">Salario por porcentajes</p>
                                <input type="checkbox" defaultChecked="true" className="form-check-input ms-3" name="disable-slider-all" onChange={handleDisableSlider}/>
                            </div>
                            <div className="col col-12 col-lg-8">
                                {
                                    commissions.map((slider) => {
                                        return(
                                            <div>
                                                <p className="mt-3">{slider.name}</p>
                                                <div className="row">
                                                    <div className="col col-9 d-flex">
                                                        <div className="form-check align-self-center mx-2 col col-1">
                                                            <input name={"disable-slider-" + slider.id} type="checkbox" checked={!disabledSlider[slider.id]} defaultChecked={true} className="form-check-input" onChange={handleDisableSlider}/>
                                                        </div>
                                                        <Slider
                                                            name={"salary-" + slider.id}
                                                            disabled={disabledSlider[slider.id]}
                                                            value={typeof salary[slider.id] === 'number' ? salary[slider.id] : 0}
                                                            onChange={handleSliderChange}
                                                            valueLabelFormat={valueLabelFormat}
                                                            valueLabelDisplay="auto"
                                                        />
                                                    </div>
                                                    <div className="col col-3">
                                                    <Input
                                                        disabled={disabledSlider[slider.id]}
                                                        id={"salary-" + slider.id}
                                                        name={"salary-" + slider.id}
                                                        value={salary[slider.id]}
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
                                                    />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className="mt-5">
                        <ItemDropdown onChange={handleServices} items={servicesItems} title="Servicios que va a prestar" required error={submited ? !body.services : false} handleShow={handleShow}></ItemDropdown>

                    </div>
                    <div className="mt-4">
                    <SectionTitle submited={submited} title="Horarios del profesional" validationtext="Selecciona un horario de atención" requiredtarget={body.schedule} validationFunction={(val) => Object.keys(val).filter(key=>val[key]).length > 0} onClick={() => handleShow("Título", "Esta es una descripción informativa acerca de la sección que ha clickeado")}> </SectionTitle>
                    <div className="separator"></div>
                        <Schedules handleChange={handleChange} value={value} setValue={setValue}></Schedules>
                    </div>
                </div>
        </FormContext>
    )
};

export default InviteEmployee;