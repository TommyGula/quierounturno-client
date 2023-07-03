import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { get } from "../utils/axios";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

const FormContext = (props) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const handleSubmit = () => {
        const body = props.body;
        props.setSubmited(true);
        validateForm(body, () => {
            fetch(process.env.REACT_APP_BACKEND_PATH + props.postContext, {
                method:props.method,
                headers:{ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + props.token },
                body:JSON.stringify(body)
            })
            .then(res=>{
                return {
                    json:res.json(),
                    status:res.status
                }
            })
            .then(async (data)=>{
                const json = await data.json;
                if (data.status !== 200) {
                    props.modal("Error "+(data.status || 500), json.message);
                } else {
                    let finalRedirect = props.redirect;
                    if (!props.redirect.includes("www") && props.redirect[0] !== "/") {
                        finalRedirect = "/" + props.redirect;
                    };
                    if (finalRedirect.includes("[")) {
                        let tgt =finalRedirect.split("]")[0];
                        tgt = tgt.split("[")[1];
                        finalRedirect = finalRedirect.replace("[" + tgt + "]", json[tgt]);
                    };
                    if (props.callback) {
                        props.callback(json._id,(response) => {
                            if (response.status > 200) {
                                props.modal("Ha ocurrido un error", response.message);
                            } else {
                                props.setRedirect(finalRedirect);
                                props.modal("Creado con éxito", props.redirectMessage);
                            };
                        });
                    } else {
                        props.setRedirect(finalRedirect);
                        props.modal("Creado con éxito", props.redirectMessage);
                    };
                };
            })
            .catch(err=>{
                props.modal("Error "+(err.status || 500), err.message);
            });
        })
    };

    useEffect(() => {
        if (props.id) {
            checkExists(props.getContext, props.id);
        } else {
            setLoading(false);
        };
    });

    const checkExists = (context, id) => {
        get(context + "/" + id, props.token, (item) => {
            if (item && item.length && !item.message) {
                setLoading(false);
            } else {
                navigate("/?back=" + window.location.pathname);
            }
        });
    };

    const validateForm = (body, cb) => {
        const errors = props.requiredFields.reduce((r,a) => {
            if (!body[a]) {
                r[a] = true;
                return r;
            } else {
                r[a] = false;
                return r
            };
        },{});
        if (Object.values(errors).filter(val=>val > 0).length === 0) {
            cb();
        } else {
            console.log(errors)
            props.modal("Error", "Debes completar todos los campos requeridos.");
        };
    };

    return(
        <div className="FormContext">
            {
                loading ?
                <Spinner></Spinner> : null
            }
            <form id="formContext">
                {props.children}
                {
                    props.cta ?
                    <div className="w-100 text-center">
                        <Button variant="primary" className="px-5 py-3 my-4" onClick={handleSubmit}>CREAR</Button>
                    </div> : null
                }
            </form>
        </div>
    )
};

export default FormContext;