import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Button } from "@mui/material";
import ItemsListDropdown from "../components/ItemsListDropdown";
import { get } from "../utils/axios";
import { handlePromises, buildEmployeeAgenda } from "../utils/helpers";
import EmployeeSelector from "../components/EmployeeSelector";
import Agenda from "../components/Agenda";

const NewAppointment = ({context, pageState, navigate}) => {
    const {companyId} = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [service, setService] = useState(searchParams.get("service") || (context.appointment.service && context.appointment.service._id));
    const [employees, setEmployees] = useState([]);
    const [form, setForm] = useState({
        service:service,
        employees:[],
        appointment:null
    });
    const [services, setServices] = useState([]);
    const [store, setStore] = useState(null);
    const [filled, setFilled] = useState(false);
    const [agenda, setAgenda] = useState([]);

    useEffect(() => {
        if (context.appointment.companyId === companyId) {
            handlePromises([
                getStore(),
                getEmployees(),
                getServices(),
            ]).then((values) => {
                pageState.setLoading(false);
            }).catch((err) => {
                throw new Error(err.message);
            })
        } else {
            context.initAppointment(companyId);
        };
    },[context.appointment.companyId]);

    useEffect(() => {
        context.buildAppointment("service", form["service"]);
        context.buildAppointment("employees", form["employees"]);
        context.buildAppointment("appointment", form["appointment"]);
        if (
            form["service"] && form["employees"] && form["appointment"]
        ) {
            setFilled(true);
        } else {
            setFilled(false);
        }
    }, Object.values(form));

    const updateForm = (key, val) => {
        if (key === "service") {
            setForm({[key]:val, employees:[], appointment:null});
        } else if (key === "employees") {
            setForm({... form, [key]:val, appointment:null});
        } else {
            setForm({...form, [key]:val});
        };
    };

    const getStore = () => {
        get("businesses/" + context.appointment.companyId, context.token, (store) => {
            if (store.length) {
                setStore(store[0]);
            } else {
                console.log(context.appointment)
                //navigate("/");
            }
        });
    };

    const getUser = (id, callback) => {
        get("users/" + id, context.token, (user) => {
            console.log(user)
            if (user.length) {
                callback(user[0]);
            } else {
                callback(null);
            }
        })
    };

    const handleEmployeeSelect = (employee=null) => {
        if (employee) {
            const t = new Date();
            t.setDate(t.getDate() - t.getDay());
            get("appointments/agenda?employeeId=" + employee._id + "&serviceId=" + service + "&startDate=" + t.toISOString().split("T")[0], context.token, (data) => {
                setAgenda(data);
                updateForm("employees", [employee._id]);
            });
        };
    };

    const getEmployees = () => {
        get("employees?companyId=" + context.appointment.companyId, context.token, (employees) => {
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
/*                         if (employee.role === "OWNER") {
                            context.buildAppointment("employees", [employee]);
                            handleEmployeeSelect(employee);
                        }; */
                    })
                }
            }
        })
    };

    const getServices = () => {
        get("services?companyId=" + context.appointment.companyId, context.token, (resServices) => {
            setServices(resServices);
            if (service) {
              resServices.reduce((r,a) => {
                if (a._id === service) {
                  context.buildAppointment("service", a);
                  //setServices([a]);
                  //handleNext();
                };
                return r;
              },[]);
            };
        });
    };
    
    const handleItemsListDropdownChange = (e) => {
        setService(e.target.name);
        setAgenda([]);
        updateForm("service", e.target.name);
    };

    const handleAppointmentSelect = (a) => {
        updateForm("appointment", a);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    if (!pageState.loading && store) {
        return(
        <div className="new-appointment p-4 pb-5">
            <form action="" onSubmit={handleSubmit}>
                <ItemsListDropdown image={(src) => process.env.REACT_APP_BACKEND_PATH + "uploads/" + src[0]} imageAttr="photos" items={services} name="name" checked={service} title="Selecciona un servicio" ctaText="SELECCIONAR" seemoretarget="searchBox" onChange={handleItemsListDropdownChange}></ItemsListDropdown>
                {
                    form.service &&
                    <section className="employees">
                        <h3 className="title">Selecciona un empleado</h3>
                        <div className="separator"></div>
                        {
                            employees
                            .filter(employee => employee.services.includes(service))
                            .map((employee,i) => <EmployeeSelector key={i} name={employee.firstName} add={() => handleEmployeeSelect(employee)} remove={() => handleEmployeeSelect(null)} selected={(context.appointment.employees || []).includes(employee._id)} lastName={employee.lastName} id={employee._id}></EmployeeSelector>)
                        }
                        {
                            !employees
                            .filter(employee => employee.services.includes(service)).length &&
                            <p className="mt-4">No hay empleados disponibles para el servicio que seleccionó</p>
                        }
                    </section>
                }
                {
                    form.employees.length && 
                    <section className="schedule">
                        <h3 className="title">Selecciona un turno</h3>
                        <Agenda select={handleAppointmentSelect} daily={true} monthly={true} weekly={true} agenda={agenda} readonly={false} context={context} update={() => null} startDayHour={!agenda.length && 9} endDayHour={!agenda.length && 11}></Agenda>
                    </section>
                }
                <div className="text-center p-4 pb-0">
                <Button disabled={!filled} variant="contained" type="submit" className="text-white">AGENDAR</Button>
                </div>
            </form>
        </div>
        )
    }
};

export default NewAppointment;