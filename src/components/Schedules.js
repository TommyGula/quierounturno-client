import React, { useState } from "react";

import { TextField } from "@mui/material";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Stack from '@mui/material/Stack';
import { DashSquareFill, PlusSquareFill } from "react-bootstrap-icons";
import { Button, Dropdown } from "react-bootstrap";


const schedule = [
    {
        name:"Lunes",
        key:"monday",
        addNew:true
    },
    {
        name:"Martes",
        key:"tuesday",
        addNew:true
    },
    {
        name:"Miércoles",
        key:"wednesday",
        addNew:true
    },
    {
        name:"Jueves",
        key:"thursday",
        addNew:true
    },
    {
        name:"Viernes",
        key:"friday",
        addNew:true
    },
    {
        name:"Sábado",
        key:"saturday",
        addNew:true
    },
    {
        name:"Domingo",
        key:"sunday",
        addNew:true
    },
];

export function formatScheduleBody(times) {
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    return days.reduce((r,a) => {
        r[a] = Object.keys(times).reduce((r2,a2) => {
            if (a2.includes(a)) {
                if (a2.includes("from")) {
                    if (a2.includes("_")) {
                        let index = a2.split("_")[1].split("-")[0];
                        if (r2.length > index) {
                            console.log(r2.length, index, r2)
                            r2[parseInt(index)]["from"] = times[a2]
                        } else {
                            r2.push({"from":times[a2]})
                        }
                    } else {
                        if (r2.length) {
                            r2[0]["from"] = times[a2]
                        } else {
                            r2.push({"from":times[a2]})
                        }
                    }
                } else {
                    if (a2.includes("_")) {
                        let index = a2.split("_")[1].split("-")[0];
                        if (r2.length > index) {
                            r2[parseInt(index)]["to"] = times[a2]
                        } else {
                            r2.push({"to":times[a2]})
                        }
                    } else {
                        if (r2.length) {
                            r2[0]["to"] = times[a2]
                        } else {
                            r2.push({"to":times[a2]})
                        }
                    }
                }
            };
            return r2;
        },[]);
        return r;
    },{});
};

const Schedules = (props) => {
    const [dates, setDates] = useState([]);
    const [days, setDays] = useState(schedule);

    const handleSelect = (e) => {
        const checked = e.target.checked;
        const name = e.target.name;
        
        if (checked) {
            setDates(dates => [... dates, name]);
        } else {
            let deleted = dates.filter(date => date !== name);
            setDates(deleted);
            props.setValue({...props.value, [name + "-from"]:null, [name + "-to"]:null});
        }
    };

    const addDay = (day) => {
        let newDay = {};
        let localDays = [...days];
        let matches = days.filter(item => item.key.includes(day.key));
        let existing = matches.length;
        let lastMatchPosition = days.indexOf(matches[matches.length - 1]) + 1;
        newDay['key'] = day.key + "_" + existing;
        newDay['name'] = null;
        newDay['addNew'] = false;
        localDays.splice(lastMatchPosition, 0, newDay);
        setDays(localDays);
    };

    const removeDay = (day) => {
        let localDays = [...days];
        setDays(localDays.filter(item => item.key !== day.key));
    };

    const selectAll = () => {
        if (dates.length !== 7) {
            setDates(schedule.reduce((r,a) => {
                r.push(a.key);
                return r;
            },[]));
        } else {
            setDates([]);
        };
    };

    const copyAll = (key) => {
        const dateCopy = Object.keys(props.value).filter(val => val.includes(key));
        props.setValue(schedule.reduce((r,a) => {
            if (!dates.includes(a.key)) {
                setDates(dates => [... dates, a.key]);
            };
            const newR = iterateRecursive(dateCopy, r, key, a.key, 0);
            return newR;
        },{}))
    };

    const iterateRecursive = (arr, obj, key, actual, i) => {
        const newKey = arr[i].replace(key, actual);
        obj[newKey] = props.value[arr[i]];
        if (i + 1 === arr.length) {
            return obj;
        } else {
            return iterateRecursive(arr, obj, key, actual, i+1);
        };
    };

    return(
        <div className="Schedules">
            {
                props.readonly ? null :
                <div className="d-flex mt-4">
                <Button variant="secondary" className="h-100 me-4" onClick={selectAll}>{dates.length === 7 ? "DESELECCIONAR TODOS" : "SELECCIONAR TODOS"}</Button>
                <Dropdown>
                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                        REPLICAR TODOS
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        {
                            Object.values(props.value).filter(val=>val>0).length ?
                            days.map((day, i) => {
                                //console.log(props.value)
                                if (props.value[day.key + "-from"] && props.value[day.key + "-to"]) {
                                    return(
                                        <Dropdown.Item key={i} onClick={() => copyAll(day.key)}>{day.name}</Dropdown.Item>
                                    )
                                }
                            }) :
                            <Dropdown.Item>No hay días con información para replicar</Dropdown.Item>
                        }
                    </Dropdown.Menu>
                </Dropdown>
                </div>
            }
            {
                days.map((day, i) => {
                    return(
                        <div key={i} className="mt-3 row g-3">
                            {
                                day.name ?
                                <div className="form-check col col-12 col-lg-2 align-self-center mx-2 mx-lg-0">
                                    {
                                        props.readonly ?
                                        null :
                                        <input type="checkbox" className="form-check-input" checked={dates.includes(day.key)} name={day.key} onChange={handleSelect}/>
                                    }
                                    <label className="form-check-label" htmlFor="exampleCheck1">{day.name}</label>
                                </div> : <div className="form-check col col-12 col-lg-2 align-self-center mx-2 mx-lg-0"></div>
                            }
                            <div className="col col-5 col-lg-4-5">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Stack spacing={2}>
                                        <TimePicker
                                            disabled={props.readonly ? false : (dates.includes(day.key.split("_")[0]) ? false : true)}
                                            label="Desde las"
                                            value={props.value[day.key + '-from'] || null}
                                            onChange={(e) => props.handleChange(e, day.key + '-from')}
                                            renderInput={(params) => <TextField {...params} />}
                                            readOnly={props.readonly}
                                        />
                                    </Stack>
                                </LocalizationProvider>
                            </div>
                            <div className="col col-5 col-lg-4-5">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Stack spacing={2}>
                                        <TimePicker
                                            disabled={props.readonly ? false : (dates.includes(day.key.split("_")[0]) ? false : true)}
                                            label="Hasta las"
                                            value={props.value[day.key + '-to'] || null}
                                            onChange={(e) => props.handleChange(e, day.key + '-to')}
                                            renderInput={(params) => <TextField {...params} />}
                                            readOnly={props.readonly}
                                            />
                                    </Stack>
                                </LocalizationProvider>
                            </div>
                            <div className="col col-2 col-lg-1 d-flex justify-content-center align-items-center">
                                {
                                    props.addDay && props.removeDay ?
                                    <div>
                                        {
                                            day.addNew ?
                                            <PlusSquareFill width={"2rem"} height={"2rem"} color={"#00C4B4"} onClick={() => addDay(day)}></PlusSquareFill>
                                            : <DashSquareFill width={"2rem"} height={"2rem"} color={"red"} onClick={() => removeDay(day)}></DashSquareFill>
                                        }
                                    </div> : null
                                }
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
};

export default Schedules;