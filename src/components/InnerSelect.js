import React, { useEffect, useState } from "react";
import { MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const InnerSelect = ({selectedDay, buildDailySchedule,selectedTimeRange, onChange, days}) => {
    const [dailySchedule, setDailySchedule] = useState(null);

    useEffect(() => {
        if (selectedDay) {
            let weekDay = selectedDay.getDay();
            let timeList = buildDailySchedule(days[weekDay]);
            setDailySchedule(timeList);
        }
    },[selectedDay]);

    return(
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Horario</InputLabel>
            {
                dailySchedule ?
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Horario"
                defaultValue={0}
                onChange={(e) => {
                    onChange(parseInt(e.target.value));
                }}
                value={selectedTimeRange}
                >
                <MenuItem value={0}>Selecciona un horario</MenuItem>
                {
                    dailySchedule.map((sch) => {
                    return(
                        <MenuItem key={sch.value} value={sch.value + 1}>{sch.range}</MenuItem>
                    )
                    })
                }
                </Select> : 
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Horario"
                defaultValue={0}
                value={0}
                >
                <MenuItem value={0}>Debe seleccionar una fecha</MenuItem>
                </Select>
            }
        </FormControl>
    )
};

export default InnerSelect;
