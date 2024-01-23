import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Button } from "@mui/material";
import ItemsListDropdown from "../components/ItemsListDropdown";
import { get, post, put } from "../utils/axios";
import { handlePromises, buildEmployeeAgenda } from "../utils/helpers";
import EmployeeSelector from "../components/EmployeeSelector";
import Agenda from "../components/Agenda";
import {TextField} from "@mui/material";
import MyModal from "../components/MyModal";

const NewAppointment = ({
  context,
  pageState,
  navigate,
  handleAlertShow,
  handleShow,
  setRedirect,
}) => {
  const { companyId } = useParams();
  const [selectedCurrency, setSelectedCurrency] = useState(2);
  const [searchParams, setSearchParams] = useSearchParams();
  const [service, setService] = useState(
    searchParams.get("service") || context.appointment.service
  );
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    service: context.appointment.service || service,
    employees: context.appointment.employees || [],
    appointment: context.appointment.appointment || null,
    paymentMethod: 1,
  });
  const [services, setServices] = useState([]);
  const [store, setStore] = useState(null);
  const [filled, setFilled] = useState(false);
  const [agenda, setAgenda] = useState(null);
  const [formModalSubmit, setFormModalSubmit] = useState();

  useEffect(() => {
    if (context.appointment.companyId === companyId) {
      handlePromises([getStore(), getEmployees(), getServices()])
        .then((values) => {
          pageState.setLoading(false);
        })
        .catch((err) => {
          throw new Error(err.message);
        });
    } else {
      context.initAppointment(companyId);
    }
  }, [context.appointment.companyId]);

  useEffect(() => {
    if (context.appointment.companyId === companyId) {

      context.setAppointmentData(form);
      // context.buildAppointment("service", form["service"]);
      // context.buildAppointment("employees", form["employees"]);
      // context.buildAppointment("appointment", form["appointment"]);
      if (form["service"] && form["employees"] && form["appointment"]) {
        setFilled(true);
      } else {
        setFilled(false);
      }
    };
  }, Object.values(form));

  const updateForm = (key, val) => {
    if (key === "service") {
      setForm({ [key]: val, employees: [], appointment: null });
    } else if (key === "employees") {
      setForm({ ...form, [key]: val, appointment: null });
    } else if (key === "appointment") {
      setForm({ ...form, [key]: val });
      context.buildAppointment("appointment", val);
    }
  };

  const getStore = () => {
    get(
      "businesses/" + context.appointment.companyId,
      context.token,
      (store) => {
        if (store.length) {
          setStore(store[0]);
        } else {
          console.log(context.appointment);
          //navigate("/");
        }
      }
    );
  };

  const getUser = (id, callback) => {
    get("users/" + id, context.token, (user) => {
      console.log(user);
      if (user.length) {
        callback(user[0]);
      } else {
        callback(null);
      }
    });
  };

  const handleAgenda = (startDate, view) => {
    //setAgenda([{}]);
    getAgenda(form.employees[0], startDate, view);
  };

  const getAgenda = (employee, t = new Date(), view = 0) => {
    t.setHours(0,0,0);
    if (view != undefined) {
      setAgenda([]);
    } else {
      view = 0;
    }
    get(
      "appointments/agenda?employeeId=" +
        employee +
        "&serviceId=" +
        form.service +
        "&startDate=" +
        t.toISOString().split("T")[0] +
        "&view=" +
        view,

      context.token,
      (data) => {
        if (data.message) {
          setAgenda([]);
          handleAlertShow(data.message, "error");
        } else {
          setAgenda(data);
          if (view < 2) {
            const available = data.filter(d=>!d.taken && d.startDate.split("T")[0] === t.toISOString().split("T")[0]).length;
            if (available) {
              handleAlertShow("Se encontraron " + available + " turnos disponibles", "success");
            } else {
              if (t < new Date()) {
                handleAlertShow("No hay turnos disponibles para una fecha pasada.", "warning")
              } else {
                handleAlertShow("No se encontraron turnos disponibles para la fecha en cuestión.", "error");
              }
            }
          }
        }
      }
    );
  };

  const handleEmployeeSelect = (employee = null) => {
    if (employee) {
      updateForm("employees", [employee._id]);
      getAgenda(employee._id);
    }
  };

  const getEmployees = () => {
    get(
      "employees?companyId=" + context.appointment.companyId,
      context.token,
      (employees) => {
        if (employees.length) {
          for (let employee of employees) {
            let employeesUser = [];
            getUser(employee.userId, (user) => {
              employee["firstName"] = user.firstName;
              employee["lastName"] = user.lastName;
              employeesUser.push(employee);
              if (employee === employees[employees.length - 1]) {
                setEmployees(employeesUser);
              }
              if (form.employees.includes(employee._id)) {
                getAgenda(employee._id);
              }
              /*                         if (employee.role === "OWNER") {
                            context.buildAppointment("employees", [employee]);
                            handleEmployeeSelect(employee);
                        }; */
            });
          }
        }
      }
    );
  };

  const getServices = () => {
    get(
      "services?companyId=" + context.appointment.companyId,
      context.token,
      (resServices) => {
        setServices(resServices);
        if (service) {
          resServices.reduce((r, a) => {
            if (a._id === service && context.appointment.service !== a._id) {
              context.buildAppointment("service", a._id);
              updateForm("service", a._id);
              //handleNext();
            }
            return r;
          }, []);
        }
      }
    );
  };

  const handleReset = () => {
    context.initAppointment(context.appointment.companyId);
  };

  const handleItemsListDropdownChange = (e) => {
    setService(e.target.name);
    setAgenda([]);
    updateForm("service", e.target.name);
  };

  const handleAppointmentSelect = (a) => {
    updateForm("appointment", a);
  };

  const getFormModalSubmit = () => {
    const phoneExists = context.user.phone;
    const description = phoneExists ? "Se le notificará horas antes del horario acordado." : "Por favor deje su número de teléfono para que podamos notificarle horas antes del horario acordado.";
    return (
    <MyModal title={"Está por agendar un turno"} description={description} content={!phoneExists && <form action="" className="pt-4">
    <TextField id="phone" label="Número de teléfono" onChange={(e) => setForm({...form, phone:e.target.value})} placeholder={"Número de teléfono"} color="primary" className="w-100" focused />
  </form>} show={true} onHide={() => setFormModalSubmit(null)} primary={"ACEPTAR"} handlePrimary={
    () => {
      if (true) {
        if (!phoneExists && form.phone) {
          put("users/" + context.user._id, context.token, {
            phone:form.phone
          }, (data) => {
            console.log("Phone updated! " + data);
          })
        };
        if (selectedCurrency === 1) {
          const preferenceBody = [
            {
              title: context.appointment.service.name,
              description: context.appointment.service.description,
              picture_url:
                process.env.REACT_APP_BACKEND_PATH + "uploads/" + store.logo,
              quantity: 1,
              currency_id: context.appointment.service.currencyId || "$",
              unit_price: context.appointment.service.price,
            },
          ];
          //post("preferences", context.token, )
        } else if (selectedCurrency === 2) {
          const appointmentBody = {
            name: services.filter((s) => s._id === form.service)[0].name,
            companyId: context.appointment.companyId,
            employees: context.appointment.employees,
            serviceId: context.appointment.service,
            createdBy: context.user._id,
            createdAt: new Date().toISOString(),
            date: context.appointment.appointment.startDate.split("T")[0],
            from: context.appointment.appointment.startDate,
            to: context.appointment.appointment.endDate,
            taken: true,
            takenBy: context.user._id,
          };
          post("appointments", context.token, appointmentBody, (res) => {
            if (!res.message) {
              handleReset();
              //handleShow("Felicitaciones", "Acabas de agendar un turno");
              navigate("/mis-turnos?init_message=Se%20ha%20registrado%20un%20nuevo%20turno");
            } else {
              handleAlertShow(res.message, "error");
            }
          });
        }
      } else {
        handleAlertShow("Debe seleccionar un método de pago", "error");
      }
      }
  }></MyModal>)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormModalSubmit(getFormModalSubmit());
  };

  if (!pageState.loading && store) {
    return (
      <div className="new-appointment p-4 pb-5">
        {formModalSubmit}
        <form action="" onSubmit={handleSubmit}>
          <ItemsListDropdown
            image={(src) =>
              process.env.REACT_APP_BACKEND_PATH + "uploads/" + src[0]
            }
            imageAttr="photos"
            items={services}
            name="name"
            checked={form.service}
            title="Selecciona un servicio"
            ctaText="SELECCIONAR"
            seemoretarget="searchBox"
            onChange={handleItemsListDropdownChange}
          ></ItemsListDropdown>
          {form.service && (
            <section className="employees">
              <h3 className="title">Selecciona un empleado</h3>
              <div className="separator"></div>
              {employees
                .filter((employee) => employee.services.includes(form.service))
                .map((employee, i) => (
                  <EmployeeSelector
                    key={i}
                    name={employee.firstName}
                    add={() => handleEmployeeSelect(employee)}
                    remove={() => handleEmployeeSelect(null)}
                    selected={form.employees.includes(employee._id)}
                    lastName={employee.lastName}
                    id={employee._id}
                  ></EmployeeSelector>
                ))}
              {!employees.filter((employee) =>
                employee.services.includes(form.service)
              ).length && (
                <p className="mt-4">
                  No hay empleados disponibles para el servicio que seleccionó
                </p>
              )}
            </section>
          )}
          {form.employees.length && agenda && (
            <section className="schedule">
              <h3 className="title">Selecciona un turno</h3>
              <Agenda
                select={handleAppointmentSelect}
                handleAgenda={handleAgenda}
                daily={true}
                monthly={true}
                weekly={true}
                agenda={agenda}
                readonly={true}
                context={context}
                update={() => null}
                selected={form.appointment}
              ></Agenda>
            </section>
          )}
          <div className="text-center pb-0">
            <Button
              disabled={!filled}
              variant="contained"
              type="submit"
              className="text-white"
            >
              AGENDAR
            </Button>
          </div>
        </form>
      </div>
    );
  }
};

export default NewAppointment;
