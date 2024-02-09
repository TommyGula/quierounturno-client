import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MyModal from "./MyModal";
import MySnackbar from "./MySnackbar";
import ProtectedRoute from "./ProtectedRoute";
import UserContext from "../context/UserContext";
import { useSearchParams } from "react-router-dom";
import { Button } from "@mui/material";
import Spinner from "./Spinner";
import zIndex from "@mui/material/styles/zIndex";

const PageContext2 = (props) => {
    // URL declarations
    const [searchParams, setSearchParams] = useSearchParams();
    const init_message = searchParams.get("init_message");
    const navigate = useNavigate();

    // Context
    const context = useContext(UserContext);

    // Page state
    const [loading, setLoading] = useState(props.noLoad ? false : true);

    // Page interactions
    const [show, setShow] = useState(false);
    const [redirect, setRedirect] = useState(null);
    const [modalTitle, setModalTitle] = useState(null);
    const [modalDescription, setModalDescription] = useState(null);
    const [modalContent, setModalContent] = useState(null);
    const [alertShow, setAlertShow] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertType, setAlertType] = useState(null);
    const [alertDuration, setAlertDuration] = useState(null);
    const [seeMore, setSeeMore] = useState(false);

    useEffect(() => {
        if (init_message) {
            handleAlertShow(init_message.replace(/%20/g, " "), "success");
        };
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
    
    const handleShow = (title, description, content=null) => {
        setModalTitle(title);
        setModalDescription(description);
        setModalContent(content);
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

    const methods = { context, navigate, show, setShow, redirect, setRedirect, modalTitle, setModalTitle, modalDescription, setModalDescription, modalContent, setModalContent, handleClose, handleShow, onPageError, handleAlertClose, handleAlertShow, handleSeeMore, seeMore, copyToClipboard, pageState:pageState };

    return(
        <div className="page-context mb-5">
            <MyModal title={modalTitle} description={modalDescription} content={modalContent} show={show} onHide={handleClose} primary={"ACEPTAR"} handlePrimary={handleClose}></MyModal>
            <MySnackbar message={alertMessage} type={alertType} open={alertShow} setAlertShow={setAlertShow} duration={alertDuration}></MySnackbar>
            <div className={"mobile-container container py-4 " + props.containerClass}>
                {
                    !loading ? null
                    : <Spinner></Spinner>
                }
                <div className={"position-relative " + (props.embed ? "" : "background")}>
                    {
                        props.redirect ?
                        <div className="p-4 position-absolute top-0 end-0" style={{zIndex:3}}>
                        <Link to={props.redirect} className="">
                            <Button variant="link" className="">{props.redirectCta || "NAVEGAR"}</Button>
                        </Link>
                        </div> : null
                    }
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