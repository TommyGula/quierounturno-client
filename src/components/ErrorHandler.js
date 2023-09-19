import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

const ErrorHandler = ({error, resetErrorBoundary}) => {
    const navigate = useNavigate();
    useEffect(() => {
        //navigate("/login");
    },[]);

    return(
        <div className="page-context mb-5">
            <div className="mobile-container container py-4">
            <div className="background">
                <div className="p-4">
                    <h3 className="title">Ha ocurrido un error.</h3>
                    <p>Motivo: {error.message} <br /> Intentaremos solucionarlo. Mientras tanto puede: </p>
                    <Button variant="primary" onClick={resetErrorBoundary}>Reintentar</Button>
                </div>
            </div>
            </div>
        </div>
    )
};

export default ErrorHandler;