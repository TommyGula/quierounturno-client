import React, { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import SectionTitle from "../components/SectionTitle";
import { get } from "../utils/axios";
import { useParams } from "react-router-dom";
import Agenda from "../components/Agenda";


const UserAgenda = ({context}) => {
    const [agenda, setAgenda] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAgenda();
    },[]);

    const getAgenda = () => {
        get("appointments/?takenBy=" + context.user._id, context.token, (data) => {
            if (data.length) {
                data.reduce((r,a) => {
                    var t = {};
                    //var itemNames = getRelatedServiceAndStore(a.companyId, a.serviceId);
                    t["startDate"] = new Date(a.from);
                    t["endDate"] = new Date(a.to);
                    t["title"] = a.name;
                    t["id"] = a._id;
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
                    <Agenda handleAgenda={() => null} agenda={agenda} daily={true} weekly={true} select={() => null} readonly={false} selected={false} context={context} update={getAgenda}></Agenda>

                </div> : null
            }
        </div>
    )

};

export default UserAgenda;