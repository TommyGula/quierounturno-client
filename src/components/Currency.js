import React from "react";
import Flag from 'react-world-flags';

const Currency = (props) => {
    return(
        <div className={"currency " + (props.selected ? "selectedCurrency" : "")} style={props.innerStyle || {}} onClick={props.onClick}>
            {
                props.img ? 
                <img src={props.img} alt={props.ticker} /> :
                <Flag code={props.code} width={"4rem"}></Flag>
            }
            <p className="f-400 m-0">{props.ticker}</p>
        </div>
    )
};

export default Currency;