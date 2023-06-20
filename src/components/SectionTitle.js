import React from "react";
import { Info } from "react-bootstrap-icons";

const SectionTitle = (props) => {
    const boolValue = props.validationFunction && props.requiredtarget ? props.validationFunction(props.requiredtarget) : props.requiredtarget;

    return(
        <div className={"SectionTitle position-relative mb-2 " + (props.centered ? "text-center" : "")}>
            <h3 className="title mb-0">{props.title}<Info className="info-icon"  onClick={props.onClick}></Info></h3>
            {
                props.validationtext && props.submited ?
                <small style={{lineHeight:".5rem"}} className={"error " + (boolValue ? "d-none" : "")}>{props.validationtext}</small> : null
            }
        </div>
    )
};

export default SectionTitle;