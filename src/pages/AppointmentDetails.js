import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import Spinner from "../components/Spinner";
import { get } from "../utils/axios";

const AppointmentDetails = ({pageState, context, appointmentId}) => {
    const navigate = useNavigate();
    const [cancel, setCancel] = useState(false);
    const [loading, setLoading] = useState(true);
    const [appointment, setAppointment] = useState(null);

    useEffect(() => {
        get("appointments/" + appointmentId, context.token, (data) => {
            setAppointment(data[0]);
            setLoading(false);
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
                        <p>Turno con: {appointment.employees.join(", ")}</p>
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