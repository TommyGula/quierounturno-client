import React, { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { post } from "../utils/axios";

const PaymentMethodConfirmation = ({handleShow, context}) => {
    const searchParams = new URLSearchParams(document.location.search)
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [response, setResponse] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log(code, state)
        if (!code || !state) {
            setResponse("No code or state was sent");
        } else {
            handleAuthMP();
        };
    },[]);

    const handleAuthMP = () => {
        post("users/auth/mp", context.token, {
            "code":code,
            "state":state
        }, (data) => {
            setResponse(data);
            setLoading(false);
            if (!data.message) {
                setIsConfirmed(true);
            }
        })
    };

    return(
        <div className="payment-method-confirmation">
            <div className="p-4">
                {
                    loading ?
                    <div className="is-loading">
                        <h3 className="title f-500 text-center mb-4">Verificando datos...</h3>
                        <Spinner></Spinner>
                    </div> :
                    <div>
                        {
                            isConfirmed ?
                                <h3 className="title f-500 mb-4">¡Método de pago añadido!</h3>
                             : <h3 className="title f-500 mb-4">Hubo un error verificando tu método de pago</h3>
                        }
                    </div>
                }
                {
                    JSON.stringify(response)
                }
            </div>
        </div>
    )
};

export default PaymentMethodConfirmation;