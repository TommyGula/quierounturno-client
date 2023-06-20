import React from "react";

const Spinner = (props) => {

    return(
        <div className={"MySpinner w-100 text-center p-4 " + (props.hidden ? "d-none" : "")}>
            <div className="lds-roller">
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
};

export default Spinner;