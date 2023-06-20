import React from "react";
import Flag from 'react-world-flags';

const Currency = (props) => {
    return(
        <div className={"currency " + (props.selected ? "selectedCurrency" : "")} onClick={props.onClick}>
            <Flag code={props.code} width={"4rem"}></Flag>
            <h5 className="f-400 m-0">{props.ticker}</h5>
        </div>
    )
};

export default Currency;