import React, { useState } from "react";
import {PersonFill, CheckCircleFill, Circle} from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

const ListItem = (props) => {
    const navigate = useNavigate();

    const handleRedirect = () => {
        if (props.url) {
            navigate(props.url);
        };
    };

    return(
        <div onClick={handleRedirect} className="list-item p-4 d-flex justify-content-between rounded align-items-center" style={{borderColor:(props.selected ?"#01A299":"gainsboro"),backgroundColor:(props.selected ? "rgb(182, 247, 241)" : "white"), cursor:(props.url ? "pointer" : "inherit")}}>
            <div className="left d-flex align-items-center">
                <PersonFill width={"1.8rem"} height={"1.8rem"} color={props.selected ? "#01A299" : "gainsboro"}></PersonFill>
                <div className="names">
                    <p className="mb-0 mx-3 title fw-100">{props.name} {props.lastName}</p>
                </div>
            </div>
            {
                props.selected ?
                <CheckCircleFill onClick={props.remove ? () => props.remove(props.id) : () => ""} width={"1.5rem"} height={"1.5rem"} color="#01A299"></CheckCircleFill> :
                <Circle onClick={() => props.add(props.id)} width={"1.5rem"} height={"1.5rem"} color="gainsboro"></Circle>
            }
        </div>
    )
};

export default ListItem;