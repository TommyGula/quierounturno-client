import React, { useRef, useState } from "react";
import { TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import Appointment from '../assets/appointment.png';
import NotResults from '../assets/not-found.png';
import ItemsListDropdown from "./ItemsListDropdown";
import { Button } from "react-bootstrap";
import Spinner from "./Spinner";
import { get } from "../utils/axios";

const Search = ({context}) => {
    const formRef = useRef();
    const [input, setInput] = useState(null);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setInput(e.target.value)
    };

    const encodeInput = (input) => {
        input = input.replace(/^a-zA-Z0-9 ]/g, '')
        return input.replace(/ /g, "+");
    };

    const handleSearchIcon = (e) => {
        e.preventDefault();
        formRef.current.submit();
    };

    const handleSearch = (e) => {
        e.preventDefault()
        if (input) {
            setResults([]);
            setLoading(true);
            get("businesses?equal=0&paymentMethodActive=true&name=" + encodeInput(input), context.token, (businessResult) => {
                console.log(businessResult)
                get("services?equal=0&paymentMethodActive=true&name=" + encodeInput(input), context.token, (servicesResult) => {
                    var servicesPromise = new Promise((resolve, reject) => {
                        if (servicesResult && servicesResult.length) {
                            resolve(servicesResult.reduce((r,a) => {
                                a["logo"] = a["photos"][0];
                                a["_id"] = a["companyId"] + "?companyAppointment=" + a["companyId"] + "&serviceAppointment=" + a["_id"];
                                return r;
                            }));
                        } else {
                            resolve([]);
                        }
                    });
                    servicesPromise.then((servicesData) => {
                        var finalData = servicesData.concat(businessResult);
                        setResults(finalData);
                        setLoading(false);
                    }).catch(err => {
                        console.log(err);
                        setLoading(false);
                    })
                });
            });
        };
    };

    return(
        <div className="search-container m-auto" style={{maxWidth:"769px"}}>
            <div className="text-center row gx-4 px-4 position-relative">
                <div className="col col-12 position-relative">
                    <form ref={formRef} onSubmit={handleSearch}>
                        <TextField id="searchBox" label="Quiero un turno" placeholder={"Buscar..."} onChange={handleChange} color="primary" className="w-100" focused />
                        <div className="search position-absolute" style={{bottom:"1rem", right:"2.5rem"}}>
                            <SearchIcon type="button" onClick={handleSearchIcon}/>
                        </div>  
                    </form>
                </div>
{/*                 <div className="col col-12 col-md-3">
                <Button variant="primary" className="w-100 h-100 px-3 py-2 mt-0" onClick={handleSearch}>Buscar</Button>
                </div> */}
            </div>
            <div className="results-box">
                {
                    loading ?
                    <Spinner></Spinner>
                    : <div className="mt-5">
                        {
                            !results ?
                            <div className="m-5 text-center">
                                <img src={Appointment} alt="" className="" style={{maxWidth:"130px"}} />
                            </div> : <div>
                                {
                                    !results.length ? 
                                    <div className="mt-5 text-center">
                                        <img src={NotResults} alt="" className="" style={{maxWidth:"130px"}} />
                                        <h6 className="mt-4">No se encontraron resultados para tu búsqueda.</h6>
                                    </div> :
                                    <ItemsListDropdown image={(src) => process.env.REACT_APP_BACKEND_PATH + "uploads/" + src} imageAttr="logo" readonly items={results} name="name" title="Mis Resultados" seemoretarget="searchBox"></ItemsListDropdown>
                                }
                            </div>
                        }
                    </div>
                }
            </div>
        </div>
    )
};

export default Search;