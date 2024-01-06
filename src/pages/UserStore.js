import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";
import { Button } from "@mui/material";
import Call from "../assets/call.svg";
import { get } from "../utils/axios";
import HiddenSection from "../components/HiddenSection";
import ItemsListDropdown from "../components/ItemsListDropdown";
import NoLogo from "../assets/no-logo.png";
import { Clock } from "react-bootstrap-icons";
import { TextField } from "@mui/material";
import MyGoogleMap from "../components/MyGoogleMap";
import { Clipboard } from "react-bootstrap-icons";
import {InputAdornment} from "@mui/material";
import Share from "../assets/share.svg";
import { handlePromises, days } from "../utils/helpers";
import { createDate } from "../utils/helpers";

const UserStore = ({ context, navigate, handleShow, copyToClipboard, pageState }) => {
    const { companyId } = useParams();
    const pageName = "userStore";

    const [profile, setProfile] = useState({});
    const [opened, setOpened] = useState(false);
    const [services, setServices] = useState([]);
    const [editable, setEditable] = useState(false);
    const [store, setStore] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [openTime, setOpenTime] = useState(0);
    const [closeTime, setCloseTime] = useState(0);

    useEffect(() => {
        handlePromises([
            getStore(),
            getEmployees(),
            getServices(),
        ]).then((values) => {
            pageState.setLoading(false);
        }).catch((err) => {
            throw new Error(err.message);
        })
    },[]);

    const getStore = () => {
        get("businesses/" + companyId, context.token, (store) => {
            if (store.length) {
                setStore(store[0]);
                checkIsOpen(store[0].schedule);
            }
        });
    };

    const handleUpdate = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setProfile({...profile, [name]:value});
    };

    const collapse = () => {
        let height = document.getElementById("collapseSection" + pageName).offsetHeight;

        if (!opened) {
            setOpened(height);
        } else {
            setOpened(false);
        };
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

    const checkIsOpen = (schedules) => {
        const date = new Date();
        const today = date.getDay()
        const daykey = days[today];
        
        const todaySchedule = Object.keys(schedules).filter(s => s.includes(daykey));
        
        setIsOpen(schedules[todaySchedule[0]].reduce((r,a) => {
            if (a.from && a.to) {
                var newFrom = new Date(a.from);
                var newTo = new Date(a.to);
                if (newFrom.getTime() < date.getTime() && newTo.getTime() > date.getTime()) {
                    return true;
                } else {
                    return r;
                }
            } else {
                return r;
            }
        },false));

        const followingDays = days.splice(today)
        const orderedDays = followingDays.concat(days);
        
        orderedDays.reduce((r,a) => {
            if (!r) {
                const dayOpen = schedules[a].reduce((r2,a2) => {
                    if (a2.from) {
                        var newFrom = new Date(a2.from);
                        newFrom = newFrom.getTime();
                        if (!r2) {
                            return newFrom;
                        } else {
                            if (newFrom < r2) {
                                return newFrom;
                            } else {
                                return r2;
                            }
                        }
                    } else {
                        return r2;
                    }
                },null)

                if (dayOpen) {
                    setOpenTime(createDate(new Date(dayOpen), true, false, "HH:MM") + " del " + a);
                    return dayOpen;
                } else {
                    return r;
                }
            } else {
                return r;
            }
        },null)

    };

    if (!pageState.loading && store) {
        return(
            <div className="p-4 pb-5">
                <div className="w-100">
                    <div className="rounded rounded-circle position-relative d-flex align-items-center justify-content-center">
                        {
                            store.logo ?
                            <img src={process.env.REACT_APP_BACKEND_PATH + "uploads/" + store.logo} alt="" style={{maxWidth:"300px"}}/> :
                            <img src={NoLogo} alt="Este negocio no tiene un logo" style={{maxWidth:"300px"}}/>
                        }
                    </div>
                </div>
                <div className="mt-4 text-center">
                    <div>
                        <h4>{store.name}</h4>
                    </div>
                    <div className="col col-12 col-md-8 col-lg-6 mx-auto my-3">
                        <div className="separator bgc-secondary"></div>
                    </div>
                    <div>
                        <h5 style={{fontWeight:400}}>{store.slogan}</h5>
                    </div>
                </div>
                <div className="mt-5 text-center">
                    <div className="form-group shadow-textarea col col-12 col-md-8 mx-auto">
                        <textarea className="form-control p-4" readOnly value={store.description} name="description" rows="3" onChange={handleUpdate}></textarea>
                    </div>
                </div>
                <div className="row g-3 mt-2 g-4 row-cols-1 ">
                    <div>
                        <h3 className="title text-center">Horarios de atención</h3>
                        <div className="separator mb-2"></div>
                        <div className="text-center mt-3">
                            <p onClick={collapse} className="pb-0 mb-0 no-pad"><span className="mb-1"><Clock fill="blue"></Clock></span>  {isOpen ? "Abierto" : "Cerrado"} - {isOpen ? "Cierra a las " + closeTime : "Abre a las " + openTime} <span className="dropdown-toggle"></span></p>
                            <HiddenSection open={opened} index={pageName}>
                                <div className="row">
                                    <ul className="p-0 pt-4 col col-12 col-md-8 col-lg-5 mx-auto text-start">
                                        {
                                            Object.keys(store.schedule).map((sch,i) => {
                                                return(
                                                    <li key={i} className="d-flex justify-content-between">
                                                        <span>{sch}</span> <span>{
                                                            store.schedule[sch].map((hours,j) => {
                                                                if (hours.from && hours.to) {
                                                                    var newFrom = new Date(hours.from);
                                                                    var newTo = new Date(hours.to);
                                                                    return(
                                                                        <span key={j}>Desde las {createDate(newFrom, true, false, "HH:MM")} hasta las {createDate(newTo, true, false, "HH:MM")}</span>
                                                                    )
                                                                }
                                                            })
                                                        } </span>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                            </HiddenSection>
                            {
                                Object.keys(store.schedule).map((schedule) => {
                                    
                                })
                            }
                        </div>
                    </div>
                    <div className="">
                        <ItemsListDropdown image={(src) => process.env.REACT_APP_BACKEND_PATH + "uploads/" + src[0]} imageAttr="photos" items={services} title="Servicios" seemoretarget={pageName + "2"} readonly ctaText="SOLICITAR" url={(serviceId) => "agendar/" + companyId+ "?service=" + serviceId} handleShow={handleShow}></ItemsListDropdown>
                    </div>    
                    <div className="mt-0">
                        <div className="w-100 text-center">
                            <Link variant="primary" onClick={() => context.initAppointment(companyId)} to={"/agendar/" + companyId} >
                                <Button className="text-white px-4 py-2 my-4" variant="contained">QUIERO UN TURNO</Button>
                            </Link>
                        </div>
                    </div>       
                    <div className="mt-4 row">
                        <div className=" col col-12 col-lg-8 mx-auto">
                            <div className="d-flex align-items-center">                            
                                <TextField
                                    id="Teléfono"
                                    name="phone"
                                    className="textfield-primary w-100"
                                    label="Teléfono"
                                    variant="standard"
                                    error={false}
                                    value={store.phone}
                                />
                                <div>
                                <a href={"tel:+" + store.phone}>
                                <img src={Call} alt="Llamar por teléfono" className="" />
                                </a>
                                </div>
                            </div>
                        </div>
                    </div>  
                    <div>
                        <h3 className="title text-center">Ubicación</h3>
                        <MyGoogleMap></MyGoogleMap>       
                    </div>
                    <div className="mt-5">
                        <h3 className="title text-center">Fotos</h3>
                        <div className="separator mb-4"></div>
                        <div className="row row-cols-3 g-5">
                            {
                                store.photos.map((ph, i) => {
                                    return(
                                        <div key={i}>
                                            <div className="w-100 ratio ratio-1x1 bg-cover-center rounded" style={{backgroundImage:"url('" + process.env.REACT_APP_BACKEND_PATH + "uploads/" + ph + "')"}}></div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="mt-5 text-center">
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
                                        <Clipboard onClick={() => copyToClipboard(process.env.REACT_APP_PATH + companyId)}></Clipboard>
                                    </InputAdornment>
                                ),
                            }}
                            error={false}
                            value={process.env.REACT_APP_PATH + companyId}
                        />
                    </div>
                    <div className="mt-5">
                        <SectionTitle centered title="Compartir publicidad para el negocio" onClick={() => handleShow("Título", "Esta es una descripción informativa acerca de la sección que ha clickeado")}></SectionTitle>
                        <div className="separator mb-2"></div>
                        <div className="text-center mt-3">
                            <img src={Share} className="pointer hoverable" alt="Click here to share link" />
                        </div>
                    </div>
                </div>
                </div>
            </div> 
        )
    }
};

export default UserStore;