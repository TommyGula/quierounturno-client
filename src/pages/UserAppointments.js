import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";
import axios from "axios";
import { get } from "../utils/axios";
import { Button } from "@mui/material";
import ItemsListDropdown from "../components/ItemsListDropdown";

const UserAppointments = ({ context, pageState }) => {
    const [agenda, setAgenda] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAppointments();
    }, []);

    const getAppointments = () => {
        get("appointments/next?takenBy=" + context.user._id, context.token, async (data) => {
            if (data.length) {
                const agendaData = await data.reduce(async (promise, a) => {
                    const acc = await promise;
                
                    if (a.serviceId) {
                      try {
                        const response = await axios.get(process.env.REACT_APP_BACKEND_PATH + "services/" + a.serviceId, {
                          headers: { 'Content-Type': 'application/json', "Authorization": 'Bearer ' + context.token }
                        });
                
                        const t = response.data[0];
                        t["name"] = (a.name || "Servicio") + " - " + a.from.split("T")[1].split(".")[0];
                        t["id"] = a._id;
                
                        var dateKey = new Date(a.from).toUTCString();
                        console.log("Date key ", dateKey)
                        if (Object.keys(acc).includes(dateKey)) {
                            acc[dateKey].push(t);
                        } else {
                            acc[dateKey] = [t]
                        }
                        //acc.push(t);
                      } catch (err) {
                        console.log("Fucking error " + err);
                      }
                    }
                
                    return acc;
                }, {});
                setTimeout(() => {
                    setAgenda(agendaData);
                    pageState.setLoading(false);
                }, 500);
            } else {
                setAgenda([]);
                pageState.setLoading(false);
            }
        });
    };

    if (!pageState.loading && agenda) {
        return (
            <div className="p-4">
                <SectionTitle title={"Mis turnos"}></SectionTitle>
                {
                    Object.keys(agenda).map(date => {
                        return (
                            <div className="mt-4">
                                <ItemsListDropdown
                                    image={(src) =>
                                    process.env.REACT_APP_BACKEND_PATH + "uploads/" + src[0]
                                    }
                                    imageAttr="photos"
                                    readonly
                                    items={agenda[date]}
                                    name="name"
                                    title={new Date(date).toLocaleDateString()}
                                    ctaText={null}
                                    seemoretarget="searchBox"
                                    onChange={() => null}
                                ></ItemsListDropdown>
                            </div>
                        )
                    })
                }
                {
                    !Object.keys(agenda).length &&
                    <>
                        <p>No tienes turnos pendientes</p>
                        <Link className="text-decoration-none" to={"/#buscar"}>
                        <Button className="f-700 mt-lg-2 text-white" variant="contained" color="primary"><strong>QUIERO BUSCAR UN TURNO</strong></Button></Link>
                    </>
                }
            </div>
        )
    }

};

export default UserAppointments;