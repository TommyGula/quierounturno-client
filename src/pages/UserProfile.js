import React, { useEffect, useState } from "react";
import SectionTitle from "../components/SectionTitle";
import ItemDropdown from "../components/ItemDropdown";
import { Link } from "react-router-dom";
import { handlePromises } from "../utils/helpers";
import { get } from "../utils/axios";

const UserProfile = ({context, pageState, handleShow}) => {
    const [stores, setStores] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        handlePromises([
            get("businesses?createdBy=" + context.user._id, context.token, (response) => {
                setStores(response);
                return response;
            }),
            get("users/" + context.user._id, context.token, (response) => {
                setUserData(response[0]);
                return response;
            }),
            get("appointments/?takenBy=" + context.user._id, context.token, (response) => {
                setAppointments(response);
                return response;
            })
        ]).then((values) => {
            pageState.setLoading(false);
        }).catch((err) => {
            throw new Error(err.message);
        })
    },[]);

    if (!pageState.loading && (userData && appointments && stores)) {
        return (
            <div className="p-4">
                <div className="position-relative">
                    <div className="d-flex justify-content-between">
                        <h3 className="title mb-4">{(userData.firstName || "") + " " + (userData.lastName || "")}</h3>
                        <div className="rounded rounded-lg position-relative d-flex align-items-center justify-content-center overflow-hidden" style={{width:"10rem", height:"10rem", border:"1px solid gray"}}>
                            {
                                userData.image ?
                                <img src={process.env.REACT_APP_BACKEND_PATH + "uploads/" + userData.image.name} alt={"Foto de perfil de " + userData.firstName + " " + userData.lastName} width={"100%"}/> :
                                <p className="m-0">Agregar Logo</p>
                            }
                        </div>
                    </div>
                </div>
                <section>
                    <div>
                    {
                        appointments.length ? 
                        <div>
                            <ItemDropdown opened={"auto"} readonly imageAttr="logo" image={(src) => process.env.REACT_APP_BACKEND_PATH + "uploads/" + src} items={appointments} title="Mis Turnos" handleShow={handleShow} url={(key) => "./me/" + key} seemoretarget="mainPannel"></ItemDropdown>
                        </div> : 
                        <div className="text-center">
                            <div className="separator mb-4"></div>
                            <p className="mb-2">Aún no tienes negocios creados</p>
                            <Link to={"/nuevo/negocio"} className="btn btn-primary px-3 py-2 my-3 mt-0">¡Crea tu primer negocio!</Link>
                        </div>
                    }
                    </div>
                </section>
            </div>
        )
    }
};

export default UserProfile;