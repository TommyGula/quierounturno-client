import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Stack from '@mui/material/Stack';
import Spinner from '../components/Spinner';
import ItemDropdown from '../components/ItemDropdown';
import InnerSelect from '../components/InnerSelect';
import ListItem from '../components/ListItem';
import { get } from '../utils/axios';
import MercadoPago from '../assets/mercadopago.png';

const steps = ['Servicio', 'Día y hora', 'Pago'];

export default function QuieroUnTurno({context, navigate, handleAlertShow}) {
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
  const [activeStep, setActiveStep] = useState(context.appointment.step || 0);
  const [skipped, setSkipped] = useState(new Set());
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState(context.appointment.employee ? [context.appointment.employee] : null);
  const [services, setServices] = useState([]);
  const [selectedDay, setSelectedDay] = useState(context.appointment.date ? new Date(context.appointment.date) : null);
  const [selectedTimeRange, setSelectedTimeRange] = useState(context.appointment.timeRange || 0);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (context.appointment) {
            getStore();
            getEmployees();
            getServices();
        }
    },[context.isAppointmentSet]);

    const evalStep = {
      0: function(context, next) {
        if (context.appointment.service && context.appointment.companyId) {
          next();
        } else {
          handleAlertShow("Debe seleccionar un servicio", "error");
        }
      },
      1: function(context, next) {
        if (context.appointment.timeRange && context.appointment.employee) {
          next();
        } else {
          handleAlertShow("Debe seleccionar un horario y profesional para su turno");
        }
      },
      2: function() {
    
      },
    };

    const getStore = () => {
        get("businesses/" + context.appointment.companyId, context.token, (store) => {
            if (store.length) {
                setStore(store[0]);
                setLoading(false);
            } else {
                navigate("/buscar-turno")
            }
        });
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
                    })
                }
            }
        })
    };

    const getServices = () => {
        get("services?companyId=" + context.appointment.companyId, context.token, (resServices) => {
            setServices(resServices);
        });
    };

  const isStepOptional = (step) => {
    return step === 6;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    evalStep[activeStep](context, () => {
      let newSkipped = skipped;
      if (isStepSkipped(activeStep)) {
        newSkipped = new Set(newSkipped.values());
        newSkipped.delete(activeStep);
      }
  
      context.buildAppointment("step", activeStep + 1);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    });
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
    context.initAppointment(context.appointment.companyId);
  };

  const buildDailySchedule = (day) => {
    const duration = context.appointment.service.minutesLength;
    return context.appointment.service.schedule[day].reduce((r,a) => {
      let from = new Date(a.from);
      let to = new Date(a.to);

      let diff = Math.abs(to - from);
      let minutes = Math.floor((diff/1000)/60);
      let quantity = Math.floor(minutes/duration);

      Array.from({ length: quantity }, (value, index) => index).reduce((r2,a2) => {
        let itemFrom = new Date(from.getTime() + duration*a2*60000);
        let itemTo = new Date(from.getTime() + duration*(a2+1)*60000);

        r.push({value:a2 + 1,range:itemFrom.toString().split(" ")[4] + " - " + itemTo.toString().split(" ")[4]});
        return r2;
      },[]);

      return r;
    },[])
};

  const buildEmployeeDailySchedule = (day, employee) => {
    const duration = context.appointment.service.minutesLength;
    return employee.schedule[day].reduce((r,a) => {
      let from = new Date(a.from);
      let to = new Date(a.to);

      let diff = Math.abs(to - from);
      let minutes = Math.floor((diff/1000)/60);
      let quantity = Math.floor(minutes/duration);

      Array.from({ length: quantity }, (value, index) => index).reduce((r2,a2) => {
        let itemFrom = new Date(from.getTime() + duration*a2*60000);
        let itemTo = new Date(from.getTime() + duration*(a2+1)*60000);

        r.push({value:a2 + 1,range:itemFrom.toString().split(" ")[4] + " - " + itemTo.toString().split(" ")[4]});
        return r2;
      },[]);

      return r;
    },[])
};

  const renderSwith = (step) => {
    switch(step) {
      case 0:
        return (
          <div className="switch-tab" style={{display:(activeStep === 0 ? "block" : "none")}}>
          <ItemDropdown static image={(src) => process.env.REACT_APP_BACKEND_PATH + "uploads/" + src} imageAttr="logo" items={[store]} title="Negocio seleccionado" seemoretarget={"selectedStore"} noCta readonly></ItemDropdown>
          <h3 className="title mb-4 mt-5">Selecciona un servicio</h3>
          <Autocomplete
              options={services}
              getOptionLabel={(op) => op.name + " - " + op.description}
              id="select-on-focus"
              isOptionEqualToValue={(op,val) => op._id === val._id}
              value={context.appointment ? (context.appointment.service ? context.appointment.service.name + " - " + context.appointment.service.description: "") : ""}
              inputValue={context.appointment ? (context.appointment.service ? context.appointment.service.name + " - " + context.appointment.service.description: "") : ""}
              selectOnFocus
              renderOption={(props,op) => (
                  <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} key={op._id} {...props}>
                      {op.name + " - " + op.description}
                  </Box>
              )}
              renderInput={(params) => {
                return (
                  <TextField {...params}  label="Selecciona un servicio" variant="standard" />
                )
              }}
              onChange={(e,val) => {
                  context.buildAppointment("service", val)
              }}
          />
          {
              context.appointment.serviceId ? 
              <ItemDropdown static items={services.filter(service => service._id === context.appointment.service.serviceId)} seemoretarget={"selectedStoreServices"} ctaText="VER" readonly></ItemDropdown> : null
          }
          </div>
        )
      case 1: 
        return (
          <div className="switch-tab" style={{display:(activeStep === 1 ? "block" : "none")}}>
                  <h3 className="title">Selecciona un día y horario</h3>
                  <div className="row mt-4 row-cols-2 gx-4">
                    <div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={2}>
                            <DatePicker
                                label="Día"
                                renderInput={(params) => <TextField {...params} />}
                                value={context.appointment.date || selectedDay}
                                onChange={(date) => {
                                  setSelectedDay(new Date(date));
                                  context.buildAppointment("date", new Date(date));
                                }}
                            />
                        </Stack>
                    </LocalizationProvider>
                    </div>
                    <div>
                      <InnerSelect selectedDay={selectedDay} selectedTimeRange={selectedTimeRange} buildDailySchedule={buildDailySchedule} onChange={handleRangeChange} days={days}></InnerSelect>
                    </div>
                  </div>
                  {
                    filteredEmployees ? 
                    <div className='mt-5'>
                      <h3 className="title">Selecciona al profesional encargado</h3>
                      <ul className="team px-0 mt-3">
                          {
                              filteredEmployees ? 
                              <div>
                                  {
                                      filteredEmployees.map(employee => {
                                          return(
                                            <ListItem key={filteredEmployees.indexOf(employee)} name={employee.firstName} add={() => context.buildAppointment("employee", employee)} remove={() => context.buildAppointment("employee", null)} selected={context.appointment.employee ? context.appointment.employee._id === employee._id : false} lastName={employee.lastName} id={employee._id}></ListItem>
                                          )
                                      })
                                  }
                              </div> : null
                          }
                      </ul>
                    </div> : null
                  }
                </div>
        )
      case 2:
        return(
          <div className="switch-tab" style={{display:(activeStep === 2 ? "block" : "none")}}>
            <h3 className="title">Verifica que todo esté bien</h3>
            <div className="summary py-4">
              <div className="mb-5">
                <table className='table'>
                  <tbody>
                    <tr>
                      <th>Servicio</th>
                      <td>{context.appointment.service.name}</td>
                    </tr>
                    <tr>
                      <th>Día y horario</th>
                      <td>{new Date(context.appointment.date).toLocaleDateString("es-AR", { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute:'numeric' })}</td>
                    </tr>
                    <tr>
                      <th>Duración</th>
                      <td>{context.appointment.service.minutesLength} minutos</td>
                    </tr>
                    <tr></tr>
                    <tr className='table-primary'>
                      <th>Total a pagar:</th>
                      <th>$ {context.appointment.service.price}</th>
                    </tr>
                  </tbody>
                </table>
              </div>
              <h3 className="title">Selecciona cómo vas a pagar</h3>
              <div className="d-flex g-4">
                <div className={"currency h-100 " + "selectedCurrency"} style={{width:"130px"}}><img className='w-100' src={MercadoPago} alt="Pagar con MercadoPago" /></div>
                <div className={"currency h-100 " + "selectedCurrency"} style={{width:"130px"}}><p className='mb-0'>Efectivo</p></div>
              </div>
            </div>
          </div>
        )
    }
  }

  const handleRangeChange = (val) => {
    setSelectedTimeRange(val);
    context.buildAppointment("timeRange", val);
    getFilteredEmployees(val);
  };

  const getFilteredEmployees = (val) => {
    setFilteredEmployees(employees.reduce((r,a) => {
      let weekDay = selectedDay.getDay();
      const employeeSchedule = buildEmployeeDailySchedule(days[weekDay], a);
      if (Object.keys(employeeSchedule).includes(val) || a.services.includes(context.appointment.service._id)) {
        r.push(a);
        return r;
      } else {
        return r;
      }
    },[]))
  }

  return (
    <div className="">
    <Spinner hidden={!loading}></Spinner>
    {
        !loading && store ?
    <div className="p-4 pb-5">
        <div className="position-relative w-100">
        <h3 className="title mb-5">Quiero un turno</h3>
        <Button className='position-absolute top-0 end-0' onClick={handleReset}>Nuevo turno</Button>
        </div>
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Nuevo turno</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
            <div className="switch-container pt-5 pb-3">
                {renderSwith(activeStep)}
            </div>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Atrás
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Saltear
              </Button>
            )}

            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Agendar' : 'Siguiente'}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
    </div> : null
    }
    </div>
  );
}