import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Wallet,initMercadoPago } from "@mercadopago/sdk-react";

const Payment = () => {
  const { id } = useParams();
  const [preferenceId, setPreferenceId] = useState(id);
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initMercadoPago("APP_USR-4e717ea7-1815-42fe-95f9-f116d3426024"); // Cuenta vendedor (ID generado con auth para operar en nombre de un vendedor)
    setLoading(false);
  })

  const handleOnReady = () => {
    setIsReady(true);
  }

  const renderCheckoutButton = (preferenceId) => {
    if (!preferenceId) return null;

    return (
      <Wallet 
        initialization={{ preferenceId: preferenceId }}
        onReady={handleOnReady} />
    )
  }

  if (!loading) {
    return (
      <div className={isReady ? "payment-form dark" : "payment-form--hidden"}>
        <div className="container_payment">
          <div className="block-heading">
            <h2>Checkout Payment</h2>
            <p>This is an example of a Mercado Pago integration</p>
          </div>
          <div className="form-payment">
            <div className="payment-details">
              <div className="form-group col-sm-12" id="wallet_container">
                {renderCheckoutButton(preferenceId)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Payment;