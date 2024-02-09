import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import Spinner from "../components/Spinner";
import { get } from "../utils/axios";
import axios from "axios";
import EmployeeSelector from "../components/EmployeeSelector";

const AppointmentDetails = ({pageState, context, appointmentId}) => {
    const navigate = useNavigate();
    const [cancel, setCancel] = useState(false);
    const [loading, setLoading] = useState(true);
    const [appointment, setAppointment] = useState(null);
    const [employees, setEmployees] = useState(null);

    useEffect(() => {
        get("appointments/" + appointmentId, context.token, async (data) => {
            if (data.length) {
                var employeeNames = await data[0].employees.reduce(async (promise,a) => {
                    const acc = await promise;

                    try {
                        const response = await axios.get(process.env.REACT_APP_BACKEND_PATH + "employees/" + a, {
                            headers: { 'Content-Type': 'application/json', "Authorization": 'Bearer ' + context.token }
                        });

                        const user = await axios.get(process.env.REACT_APP_BACKEND_PATH + "users/" + response.data[0].userId, {
                            headers: { 'Content-Type': 'application/json', "Authorization": 'Bearer ' + context.token }
                        });
                        response.data[0].employeeName = user.data[0].firstName + " " + user.data[0].lastName;
                        acc.push(response.data[0]);
                    } catch(err) {
                        console.log("Fucking error ", err);
                    }
                    return acc;
                },[]);
                
                setEmployees(employeeNames);
                setAppointment(data[0]);
                setLoading(false);
            } else {
                console.log(data)
            }
        });
    },[]);

    const handleChange = (e) => {

    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    if (!loading && appointment) {
        return(
            <div className="appointment-details">
                {
                    cancel &&
                    <div className="p-4">
                        <h3 className="title mb-4">Solicitar cancelar un turno</h3>
                        <form action="">
                            <label className="title mb-4">Deja un mensaje para avisar al negocio</label>
                            <div className="form-group">
                                <textarea className="form-control p-4" placeholder="" rows="10" onChange={handleChange}></textarea>
                            </div>
                            <div className="position-relative">
                                <small className="text-danger">*Se enviará al negocio una solicitud para cancelar el turno. Mientras tanto, el mismo sigue vigente</small>
                                <div className="d-flex justify-content-between">
                                    <Button variant="contained" className="text-white" type="submit" onClick={handleSubmit}>{"ENVIAR"}</Button>
                                </div>
                            </div>
                        </form>
                    </div>
                }
                {
                    !cancel &&
                    <div className="p-4">
                        <h3 className="title mb-4">{appointment.name}</h3>
                        <p>Día y horario: {new Date(appointment.from).toLocaleString()}</p>
                        <p className="mb-3">Turno con:</p>
                        {
                            employees.map((employee, i) => <EmployeeSelector key={i} name={employee.employeeName} add={() => null} remove={() => null} selected={true} lastName={""} id={employee._id}></EmployeeSelector>)
                        }
                    </div>
                }
            </div>
        );
    } else {
        return(
            <Spinner></Spinner>
        )
    }
};

export default AppointmentDetails;