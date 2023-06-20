import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ItemDropdown from "../components/ItemDropdown";
import { get } from "../utils/axios";
import { Button } from "react-bootstrap";

const MainPannel = ({children, handleShow, context}) => {
    const navigate = useNavigate();
    const [stores, setStores] = useState(null);

    useEffect(() => {
        getStores();
    },[]);

    const getStores = () => {
        get("businesses?createdBy=" + context.user._id, context.token, (response) => {
            console.log(response)
            setStores(response);
        });
    };

    const handleStores = () => {

    };

    return(
        <div className="MainPannel">
            <div className="p-4">
            <div className="w-100 text-end">
                <Button variant="primary" className="px-3 py-2 my-3 mt-0" onClick={() => navigate("/nuevo/negocio")}>Nuevo</Button>
            </div>
                {
                    stores ? 
                    <div>
                        <ItemDropdown opened={"auto"} readonly items={stores} title="Mis Negocios" handleShow={handleShow} url={(key) => "./me/" + key} seemoretarget="mainPannel"></ItemDropdown>
                    </div> : null
                }
            </div>
        </div>
    );
};

export default MainPannel;