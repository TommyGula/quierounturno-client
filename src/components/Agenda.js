import React, { useEffect, useState } from "react";
import Spinner from "./Spinner";
import SectionTitle from "./SectionTitle";
import { Box, Tabs, Tab, Typography, TextField } from "@mui/material";
import { ViewState,EditingState,IntegratedEditing } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  DayView,
  WeekView,
  MonthView,
  Appointments,
  Toolbar,
  TodayButton,
  DateNavigator,
  AppointmentTooltip,
  AppointmentForm,
  ConfirmationDialog,
} from '@devexpress/dx-react-scheduler-material-ui';
import AppointmentDetails from "../pages/AppointmentDetails";
import { put, remove } from "../utils/axios";

const Agenda = ({daily, monthly, weekly, agenda, readonly, duration, context, update, select, selected, handleAgenda}) => {
    useEffect(() => {
        if (agenda.length) {
            const firstHour = new Date(agenda[0].startDate).getHours() - 1;
            const lastHour = new Date(agenda[agenda.length-1].endDate).getHours() + 1;
            setStartDayHour(firstHour);
            setEndDayHour(lastHour);
        } else {
            setStartDayHour(1);
            setEndDayHour(1.5);
        }
    },[agenda])
    const [value, setValue] = useState(0);
    const [selection, setSelection] = useState(selected);
    const [startDayHour, setStartDayHour] = useState(null);
    const [endDayHour, setEndDayHour] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());

    const AppointmentElements = () => {
        if (readonly) {
            return [
                <Appointments
                    appointmentComponent={Appointment}
                /> 
            ]
        } else {
            return [
                <Appointments
                    appointmentComponent={Appointment}
                />,
                <EditingState
                onCommitChanges={commitChanges}
                />,
                <IntegratedEditing />,
                <ConfirmationDialog />,
                <AppointmentTooltip
                    showCloseButton
                    showOpenButton
                    showDeleteButton
                />,
                <AppointmentForm
                    basicLayoutComponent={EditingForm}
                    showDeleteButton={false}
                />
            ]
        }
    }

    const Appointment = ({
        children, style, ...restProps
    }) => {
        const isSelected = selection ? selection.startDate === restProps.data.startDate && selection.endDate === restProps.data.endDate : false;
        return(
            <Appointments.Appointment
            {...restProps}
            style={{
                ...style,
                cursor:restProps.data.taken ? "initial" : "pointer",
                backgroundColor:restProps.data.taken ? "gainsboro" : (isSelected ? "rgb(0, 137, 125)" : "#00C4B4"),
            }}
            isShaded={!isSelected}
            onClick={() => {
                setSelection(restProps.data);
                if (value !== 2) {
                    select(restProps.data);
                } else {
                    handleTabChange(null, 0, new Date(restProps.data.startDate));
                    //console.log("MONTH CLICKED ", restProps)
                }
            }}
            >
            {children}
            </Appointments.Appointment>
        );
    };

    function TabPanel(props) {
        const { children, value, index, ...other } = props;
      
        return (
          <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
          >
            {value === index && (
              <Box sx={{ p: 3 }}>
                <Typography>{children}</Typography>
              </Box>
            )}
          </div>
        );
    };

    const handleTabChange = (event, newValue, date=null) => {
        setValue(newValue);
        handleAgenda((date || currentDate), newValue);
        if (date) {
            setCurrentDate(date);
        }
    };

    const handleDateChange = (date) => {
        handleAgenda(date, value);
        setCurrentDate(date);
    };

    const commitChanges = ({ added, changed, deleted }) => {
        if (added) {
            // Not implemented
            return;
        };
        if (changed) {
            Object.keys(changed).map((id, i) => {
                put("appointments/" + id, context.token, changed[id], () => {
                    if (i === Object.keys(changed).length - 1) {
                        update();
                    };
                })
            })
        };
        if (deleted) {
            remove("appointments/" + deleted, context.token, () => {
                update();
            })
        }
    };

    const EditingForm = ({ children, onFieldChange, appointmentData, ...restProps }) => {
        return (
            <div className="custom-layout w-100">
                <AppointmentDetails appointmentId={appointmentData.id} context={context}></AppointmentDetails>
            </div>
        );
    }

    return(
        <div className="agenda">
            <Spinner hidden={agenda}></Spinner>
            {
                agenda ?
                <div>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleTabChange} aria-label="">
                            {
                                daily &&
                                <Tab label="Día" />
                            }
                            {
                                weekly &&
                                <Tab label="Semana" />
                            }
                            {
                                monthly &&
                                <Tab label="Mes" />
                            }
                        </Tabs>
                    </Box>
                    {
                        daily &&
                    <TabPanel value={value} index={0}>
                        <Scheduler
                        data={agenda}
                        style={{}}
                        >
                            <ViewState
                                defaultCurrentDate={currentDate}
                                onCurrentDateChange={handleDateChange}
                            />
                            <DayView
                                startDayHour={startDayHour || 0}
                                endDayHour={endDayHour || 24}
                                duration={duration || 30}
                            />
                            <Toolbar style={{paddingLeft:"0 !important"}} />
                            <DateNavigator onNavigate={handleDateChange}/>
                            <TodayButton />
                            {
                                AppointmentElements()
                            }
                        </Scheduler>
                    </TabPanel>
                    }
                    {
                        weekly &&
                        <TabPanel value={value} index={daily ? 1 : 0}>
                            <Scheduler data={agenda} firstDayOfWeek={currentDate.getDay()}>
                                <ViewState
                                    defaultCurrentDate={currentDate}
                                    onCurrentDateChange={handleDateChange}
                                />
                                <WeekView startDayHour={startDayHour || 9} endDayHour={endDayHour || 19} />
                                {AppointmentElements().map(el => el)}
                            </Scheduler>
                        </TabPanel>
                    }
                    {
                        monthly &&
                        <TabPanel value={value} index={daily && weekly ? 2 : 0}>
                            <Scheduler
                                data={agenda}
                                >
                                <ViewState
                                    defaultCurrentDate={currentDate}
                                    onCurrentDateChange={handleDateChange}
                                />
                                <Toolbar />
                                <DateNavigator />
                                <TodayButton />
                                <MonthView />
                                {AppointmentElements()}
                            </Scheduler>
                        </TabPanel>
                    }
                </div> : null
            }
        </div>
    )

};

export default Agenda;