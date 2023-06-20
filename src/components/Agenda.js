import React, { useEffect, useState } from "react";
import Spinner from "./Spinner";
import SectionTitle from "./SectionTitle";
import { Box, Tabs, Tab, Typography } from "@mui/material";
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

const Appointment = ({
    children, style, ...restProps
  }) => {
    return(
        <Appointments.Appointment
          {...restProps}
          style={{
            ...style,
          }}
        >
          {children}
        </Appointments.Appointment>
    );
};

const Agenda = ({agenda, readonly, duration, startDayHour, endDayHour}) => {
    useEffect(() => {
        console.log(agenda)
    },[])
    const [value, setValue] = useState(0);

    const currentDate = new Date();

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

    const commitChanges = () => {

    };

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
                            <Appointments
                                appointmentComponent={Appointment}
                            />
                            {
                                !readonly ?
                                <div>
                                    <EditingState
                                    onCommitChanges={commitChanges}
                                    />
                                    <IntegratedEditing />
                                    <ConfirmationDialog />
                                    <AppointmentTooltip
                                        showCloseButton
                                        showOpenButton
                                    />
                                    <AppointmentForm
                                    />
                                </div> : null
                            }
                        </Scheduler>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Scheduler data={agenda} >
                            <WeekView startDayHour={9} endDayHour={19} />
                            <Appointments
                                appointmentComponent={Appointment}
                            />
                            {
                                !readonly ?
                                <div>
                                    <EditingState
                                    onCommitChanges={commitChanges}
                                    />
                                    <IntegratedEditing />
                                    <ConfirmationDialog />
                                    <AppointmentTooltip
                                        showCloseButton
                                        showOpenButton
                                    />
                                    <AppointmentForm
                                    />
                                </div> : null
                            }
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
                            <Appointments
                                appointmentComponent={Appointment}
                            />
                            {
                                !readonly ?
                                <div>
                                    <EditingState
                                    onCommitChanges={commitChanges}
                                    />
                                    <IntegratedEditing />
                                    <ConfirmationDialog />
                                    <AppointmentTooltip
                                        showCloseButton
                                        showOpenButton
                                    />
                                    <AppointmentForm
                                    />
                                </div> : null
                            }
                        </Scheduler>
                    </TabPanel>

                </div> : null
            }
        </div>
    )

};

export default Agenda;