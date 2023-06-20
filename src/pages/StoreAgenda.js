import React, { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import SectionTitle from "../components/SectionTitle";
import { get } from "../utils/axios";
import { useParams } from "react-router-dom";
import Agenda from "../components/Agenda";


const StoreAgenda = ({context}) => {
    const [agenda, setAgenda] = useState(null);
    const [loading, setLoading] = useState(true);
    const [services, setServices] = useState(null);
    const { companyId, employeeId } = useParams();

    const schedulerData = [
        { startDate: '2018-11-01T09:45', endDate: '2018-11-01T11:00', title: 'Meeting' },
        { startDate: '2018-11-01T12:00', endDate: '2018-11-01T13:30', title: 'Go to a gym' },
    ];

    useEffect(() => {
        getAgenda();
        getStore();
    },[]);

    const getStore = () => {
        get("services?project=services=1&companyId=" + companyId, context.token, (employees) => {
            if (employees.length) {
                for (let employee of employees) {
                    const employeeServices = employee.services.reduce((r,a) => {
                        get("services/" + a, context.token, (service) => {
                            r.push(service[0]);
                        })
                        setServices(r);
                        return r;
                    },[]);
                    setTimeout(() => {
                        setServices(employeeServices)
                    },1000)
                    setLoading(false);
                }
            }
        })
    };

    const getAgenda = () => {
        get("appointments?companyId=" + companyId, context.token, (data) => {
            setAgenda(data.reduce((r,a) => {
                r.push({
                    "startDate":a.from.split(".")[0],
                    "endDate":a.to.split(".")[0],
                    "title":"Prueba"
                })
                r.push({
                    "startDate":a.from.split(".")[0],
                    "endDate":a.to.split(".")[0],
                    "title":"Prueba"
                })
                return r;
            },[]));
            setLoading(false);
        })
    };

    return(
        <div className="my-agenda">
            <Spinner hidden={!loading}></Spinner>
            {
                !loading ?
                <div className="p-4">
                    <SectionTitle title={"Mi agenda"}></SectionTitle>
                    <Agenda agenda={agenda} readonly></Agenda>

                </div> : null
            }
        </div>
    )

};

export default StoreAgenda;