import React, { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import SectionTitle from "../components/SectionTitle";
import { get } from "../utils/axios";
import { useParams } from "react-router-dom";
import Agenda from "../components/Agenda";


const UserAgenda = ({context}) => {
    const [agenda, setAgenda] = useState(null);
    const [loading, setLoading] = useState(true);

    const schedulerData = [
        { startDate: '2018-11-01T09:45', endDate: '2018-11-01T11:00', title: 'Meeting' },
        { startDate: '2018-11-01T12:00', endDate: '2018-11-01T13:30', title: 'Go to a gym' },
    ];

    useEffect(() => {
        getAgenda();
    },[]);

    const getAgenda = () => {
        get("appointments/?takenBy=" + context.user._id, context.token, (data) => {
            setAgenda(data);
            setLoading(false);
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