import React, { useState } from "react";
import { TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import Appointment from '../assets/appointment.png';
import NotResults from '../assets/not-found.png';
import ItemDropdown from "../components/ItemDropdown";
import { Button } from "react-bootstrap";
import Spinner from "../components/Spinner";
import { get } from "../utils/axios";

const Search = ({context}) => {
    const [input, setInput] = useState(null);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        console.log(e.target.value)
        setInput(e.target.value)
    };

    const encodeInput = (input) => {
        input = input.replace(/^a-zA-Z0-9 ]/g, '')
        return input.replace(/ /g, "+");
    }

    const handleSearch = () => {
        if (input) {
            setResults([]);
            setLoading(true);
            get("businesses?equal=0&name=" + encodeInput(input), context.token, (businessResult) => {
                if (businessResult && businessResult.length) {
                    setResults(results => [...results, businessResult[0]]);
                };
                get("services?equal=0&name=" + encodeInput(input), context.token, (servicesResult) => {
                    if (servicesResult && servicesResult.length) {
                        setResults(results => [...results, servicesResult[0]]);
                        setLoading(false);
                    } else {
                        setLoading(false);
                    };
                });
            });
        };
    };

    return(
        <div className="search-container p-4">
            <h3 className="mb-5 title">Buscar un turno o negocio</h3>
            <div className="text-center row gx-4 px-4 position-relative">
                <div className="col col-12 col-md-9 position-relative">
                <TextField label="Quiero un turno" placeholder={"Buscar..."} onChange={handleChange} color="primary" className="w-100" focused />
                <div className="search position-absolute" style={{bottom:"1rem", right:"2.5rem"}}>
                    <SearchIcon />
                </div>
                </div>
                <div className="col col-12 col-md-3">
                <Button variant="primary" className="w-100 h-100 px-3 py-2 mt-0" onClick={handleSearch}>Buscar</Button>
                </div>
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
                                    <ItemDropdown readonly items={results} name="name" title="Mis Resultados" seemoretarget="searchBox"></ItemDropdown>
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