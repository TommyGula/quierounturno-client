import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MyModal from "./MyModal";
import MySnackbar from "./MySnackbar";
import ProtectedRoute from "./ProtectedRoute";
import UserContext from "../context/UserContext";
import { useSearchParams } from "react-router-dom";
import Spinner from "./Spinner";

const PageContext2 = (props) => {
    // URL declarations
    const [searchParams, setSearchParams] = useSearchParams();
    const init_message = searchParams.get("init_message");
    const serviceAppointment = searchParams.get("serviceAppointment");
    const companyAppointment = searchParams.get("companyAppointment");
    const navigate = useNavigate();

    // Context
    const context = useContext(UserContext);

    // Page state
    const [loading, setLoading] = useState(true);

    // Page interactions
    const [show, setShow] = useState(false);
    const [redirect, setRedirect] = useState(null);
    const [modalTitle, setModalTitle] = useState(null);
    const [modalDescription, setModalDescription] = useState(null);
    const [alertShow, setAlertShow] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertType, setAlertType] = useState(null);
    const [alertDuration, setAlertDuration] = useState(null);
    const [seeMore, setSeeMore] = useState(false);

    useEffect(() => {
        if (init_message) {
            handleAlertShow(init_message.replace(/%20/g, " "), "success");
        };
        if (serviceAppointment && companyAppointment) {
            context.initAppointment(companyAppointment)
            navigate("/agendar/" + companyAppointment + "?service=" + serviceAppointment);
        }
    })

    const handleSeeMore = (e) => {
        let seemoretarget = e.target.getAttribute("seemoretarget");
        let height = document.getElementById("collapseSection" + seemoretarget).offsetHeight;

        if (!seeMore) {
            setSeeMore(height);
            setTimeout(() => {
                setSeeMore("auto");
            },1000);
        } else {
            setSeeMore(false);
        };
    };

    const copyToClipboard = (copy) => {
        navigator.clipboard.writeText(copy);
        handleAlertShow("Copiado al portapapeles", "success");
    };

    const handleClose = () => {
        setShow(false);
        if (redirect) {
            navigate(redirect);
        };
    };
    
    const handleShow = (title, description) => {
        setModalTitle(title);
        setModalDescription(description);
        setShow(true);
    };
    
    const handleAlertShow = (message, type, duration=null) => {
        setAlertMessage(message);
        setAlertType(type);
        setAlertDuration(duration);
        setAlertShow(true);
    };

    const handleAlertClose = () => {
        setAlertShow(false);
    };

    const onPageError = (title, message) => {
        setRedirect("/");
        handleShow(title, message);
    };

    const pageState = { loading, setLoading }

    const methods = { context, navigate, show, setShow, redirect, setRedirect, modalTitle, setModalTitle, modalDescription, setModalDescription, handleClose, handleShow, onPageError, handleAlertClose, handleAlertShow, handleSeeMore, seeMore, copyToClipboard, pageState:pageState };

    return(
        <div className="page-context mb-5">
            <MyModal title={modalTitle} description={modalDescription} show={show} onHide={handleClose} primary={"ACEPTAR"} handlePrimary={handleClose}></MyModal>
            <MySnackbar message={alertMessage} type={alertType} open={alertShow} setAlertShow={setAlertShow} duration={alertDuration}></MySnackbar>
            <div className={"mobile-container container py-4 " + props.containerClass}>
                {
                    !loading ? null
                    : <Spinner></Spinner>
                }
                <div className={props.embed ? "" : "background"}>
                    {
                        props.private ?
                        <ProtectedRoute>
                            {React.cloneElement(props.children, methods)}
                        </ProtectedRoute> :
                        React.cloneElement(props.children, methods)
                    }
                </div>
            </div>
        </div>
    );
};

export default PageContext2;