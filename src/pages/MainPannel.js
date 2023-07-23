import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ItemDropdown from "../components/ItemDropdown";
import { get } from "../utils/axios";
import { Button } from "react-bootstrap";
import Spinner from "../components/Spinner";

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
            {
                !stores ?
                <Spinner></Spinner> :
                <div className="p-4">
                <div className="w-100 text-end">
                    <Link variant="primary" className="btn btn-primary px-3 py-2 my-3 mt-0" to={"/nuevo/negocio"}>Nuevo</Link>
                </div>
                    {
                        stores.length ? 
                        <div>
                            <ItemDropdown opened={"auto"} readonly imageAttr="logo" image={(src) => process.env.REACT_APP_BACKEND_PATH + "uploads/" + src} items={stores} title="Mis Negocios" handleShow={handleShow} url={(key) => "./me/" + key} seemoretarget="mainPannel"></ItemDropdown>
                        </div> : 
                        <div className="text-center">
                            <div className="separator mb-4"></div>
                            <p className="mb-2">Aún no tienes negocios creados</p>
                            <Link to={"/nuevo/negocio"} className="btn btn-primary px-3 py-2 my-3 mt-0">¡Crear un nuevo negocio!</Link>
                        </div>
                    }
                </div>
            }
        </div>
    );
};

export default MainPannel;