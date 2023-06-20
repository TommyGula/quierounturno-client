import React, { useState, useEffect } from "react";
import Dropdown from "../assets/dropdown.svg";
import itemImg from "../assets/store.png";
import { Info } from "react-bootstrap-icons";
import HiddenSection from "./HiddenSection";
import { Link } from "react-router-dom";

const ItemDropdown = (props) => {
    const items = props.items;
    const [opened, setOpened] = useState(false);

    const collapse = () => {
        let height = document.getElementById("collapseSection" + props.seemoretarget).offsetHeight;
        if (!opened || opened === "auto") {
            if (height) {
                setOpened(height);
            } else {
                setOpened("auto");
                setTimeout(() => {
                    collapse();
                },500)
            }
        } else {
            setOpened(false);
        };
    };

    useEffect(() => {
        collapse();
    },[]);

    return(
        <div className="ItemDropdown">
            <div className="item-dropdown-header justify-content-between d-flex align-items-center">
                {
                    props.title ?
                    <h3 className="title">{props.title} 
                        {
                            props.infoTitle && props.infoDescription ? 
                            <Info className="info-icon"  onClick={() => props.handleShow(props.infoTitle, props.infoDescription)}></Info> : null
                        }
                    </h3> : <div></div>
                }
                {
                    !props.static ?
                    <img src={Dropdown} alt="Collapse" onClick={() => collapse()} className="mb-2 ms-3 pointer"/> : null
                }
            </div>
            <div className="separator"></div>
            <HiddenSection open={opened} index={props.seemoretarget}>
                <div className="item-dropdown-items collapse-item">
                    {
                        items.map((item) => {
                            return(
                                <div className="item-dropdown-item" key={items.indexOf(item)}>
                                    <div className="row g-3 p-3 align-items-center">
                                        <div className="col col-3 text-center">
                                            <img src={props.image ? props.image(item[props.imageAttr || "image"]) : itemImg} alt="" className="w-100" style={{maxWidth:"80px"}}/>
                                        </div>
                                        <div className="col col-6">
                                            <p className="ms-4 ms-md-0 mb-0">{props.itemName ? props.itemName(item.name) : item.name}</p>
                                            <small className="d-none d-md-block">{props.location ? props.location(item.location) : item.location}</small>
                                            <small className="d-none d-md-block">{props.descrition ? props.description(item.description) : item.description}</small>
                                        </div>
                                        <div className="col col-3 text-center">
                                            {
                                                !props.noCta ?
                                                <div className="text-center">
                                                    {
                                                        props.readonly ?
                                                        <Link className="px-4 py-2 my-4 btn btn-primary" to={"/" + (props.url ? props.url(item._id) : item._id)}>{props.ctaText || "Ingresar"}</Link> :
                                                        <input type="checkbox" className="form-check-input" name={item.id} onChange={props.onChange}/>
                                                    }
                                                </div> : null
                                            }
                                        </div>
                                    </div>
                                    <div className="separator"></div>
                                </div>
                            )
                        })
                    }
                </div>
            </HiddenSection>
        </div>
    )
};

export default ItemDropdown;