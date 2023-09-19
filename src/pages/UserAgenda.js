import React, { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import SectionTitle from "../components/SectionTitle";
import { get } from "../utils/axios";
import { useParams } from "react-router-dom";
import Agenda from "../components/Agenda";


const UserAgenda = ({context}) => {
    const [agenda, setAgenda] = useState([]);
    const [loading, setLoading] = useState(true);

    const schedulerData = [
        { startDate: '2018-11-01T09:45', endDate: '2018-11-01T11:00', title: 'Meeting' },
        { startDate: '2018-11-01T12:00', endDate: '2018-11-01T13:30', title: 'Go to a gym' },
    ];

    useEffect(() => {
        getAgenda();
    },[]);

    const getRelatedServiceAndStore = (companyId, serviceId) => {
        return new Promise((res, rej) => {
            get("businesses/" + companyId + "?project=name=1", context.token, (companyName) => {
                get("services/" + serviceId + "?project=name=1", context.token, (serviceName) => {
                    if (companyName.length && serviceName.length) {
                        res({service:serviceName[0].name, company:companyName[0].name});
                    } else {
                        rej({service:"", company:""})
                    }
                });
            });
        })
    };

    const getAgenda = () => {
        get("appointments/?takenBy=" + context.user._id, context.token, (data) => {
            if (data.length) {
                const myAgenda = data.reduce((r,a) => {
                    var t = {};
                    var itemNames = getRelatedServiceAndStore(a.companyId, a.serviceId);
                    t["startDate"] = a.from.split(".")[0];
                    t["endDate"] = a.to.split(".")[0];
                    t["title"] = a.name;
                    r.push(t);
                    setAgenda([... agenda, t]);
                    return r;
                },[]);

                setTimeout(() => {
                    setLoading(false);
                }, 500)
            } else {
                setAgenda([]);
                setLoading(false);
            }
        });
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

export default UserAgenda;