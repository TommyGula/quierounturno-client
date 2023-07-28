import React, { useEffect } from "react";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";

const ErrorHandler = ({error, resetErrorBoundary}) => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate("/login");
    },[]);

    return(
        <Spinner></Spinner>
    )
};

export default ErrorHandler;