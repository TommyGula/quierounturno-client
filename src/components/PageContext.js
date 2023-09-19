import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MyModal from "../components/MyModal";
import MySnackbar from "../components/MySnackbar";
import ProtectedRoute from "./ProtectedRoute";
import UserContext from "../context/UserContext";
import { useSearchParams } from "react-router-dom";

const PageContext = (props) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const init_message = searchParams.get("init_message");
    const serviceAppointment = searchParams.get("serviceAppointment");
    const companyAppointment = searchParams.get("companyAppointment");
    const navigate = useNavigate();
    const context = useContext(UserContext);
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

    const createDate = (date, time=false, sep=false, format="dd-mm-YYYY HH:MM:SS") => {
        let day = date.getDay();
        let month = date.getMonth();
        let year = date.getYear();
        
        let finalDate = format.replace("YYYY", year).replace("mm", month).replace("dd", day);

        if (sep) {
            finalDate.replace("-", sep);
        }
        if (time) {
            let hour = date.getHours();
            let minutes = addDigit(date.getMinutes(), 2, "0", true);
            let seconds = addDigit(date.getSeconds(), 2, "0", true);

            finalDate = finalDate.replace("HH", hour).replace("MM", minutes).replace("SS", seconds);
        } else {
            finalDate = finalDate.split(" ")[0];
        };
        
        return finalDate;
    };

    const addDigit = (str, n, digit="0", left=false) => {
        str = str.toString();
        if (str.length < n) {
            let newStr = str;
            for (let i = 0; i < n - str.length; i++) {
                if (left) {
                    newStr = digit + newStr;
                } else {
                    newStr = newStr + digit;
                };
            };
            return newStr;
        } else {
            return str;
        }
    }

    return(
        <div className="page-context mb-5">
            <MyModal title={modalTitle} description={modalDescription} show={show} onHide={handleClose} primary={"ACEPTAR"} handlePrimary={handleClose}></MyModal>
            <MySnackbar message={alertMessage} type={alertType} open={alertShow} setAlertShow={setAlertShow} duration={alertDuration}></MySnackbar>
            <div className="mobile-container container py-4">
                <div className="background">
                    {
                        props.private ?
                        <ProtectedRoute>
                            {React.cloneElement(props.children, { context, navigate, show, setShow, redirect, setRedirect, modalTitle, setModalTitle, modalDescription, setModalDescription, handleClose, handleShow, onPageError, handleAlertClose, handleAlertShow, handleSeeMore, seeMore, copyToClipboard, createDate })}
                        </ProtectedRoute> :
                        React.cloneElement(props.children, { context, navigate, show, setShow, redirect, setRedirect, modalTitle, setModalTitle, modalDescription, setModalDescription, handleClose, handleShow, onPageError, handleAlertClose, handleAlertShow, handleSeeMore, seeMore, copyToClipboard, createDate })
                    }
                </div>
            </div>
        </div>
    );
};

export default PageContext;