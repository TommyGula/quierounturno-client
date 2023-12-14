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
import NewAppointment from "../pages/NewAppointment";
import PageContext from "./PageContext";
import { put, remove } from "../utils/axios";

const Agenda = ({agenda, readonly, duration, startDayHour, endDayHour, context, update}) => {
    useEffect(() => {
        console.log(agenda)
    },[])
    const [value, setValue] = useState(1);

    const currentDate = new Date();

    const AppointmentElements = () => {
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

    const Appointment = ({
        children, style, ...restProps
    }) => {
        return(
            <Appointments.Appointment
            {...restProps}
            style={{
                ...style,
            }}
            isShaded={true}
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

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
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
        if (appointmentData) {
            console.log("APPOINTMENT DATA ", appointmentData);
            //context.setAppointmentData(appointmentData);
        }
        return (
            <div className="custom-layout w-100">
                <PageContext containerClass="px-0" private embed><NewAppointment /></PageContext>
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
                        <Tabs value={value} onChange={handleTabChange} aria-label="basic tabs example">
                            <Tab label="Hoy" />
                            <Tab label="Semana" />
                            <Tab label="Mes" />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        <Scheduler
                        data={agenda}
                        style={{backgroundColor:"red"}}
                        >
                            <ViewState
                                defaultCurrentDate={currentDate}
                            />
                            <DayView
                                startDayHour={startDayHour || 0}
                                endDayHour={endDayHour || 24}
                                duration={duration || 30}
                            />
                            <Toolbar style={{paddingLeft:"0 !important"}} />
                            <DateNavigator />
                            <TodayButton />
                            {AppointmentElements()}
                        </Scheduler>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Scheduler data={agenda} >
                            <WeekView startDayHour={9} endDayHour={19} />
                            {AppointmentElements().map(el => el)}
                        </Scheduler>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <Scheduler
                            data={agenda}
                            >
                            <ViewState
                                defaultCurrentDate={currentDate}
                            />
                            <Toolbar />
                            <DateNavigator />
                            <TodayButton />
                            <MonthView />
                            {AppointmentElements()}
                        </Scheduler>
                    </TabPanel>

                </div> : null
            }
        </div>
    )

};

export default Agenda;