import React, { useEffect } from "react";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const MySnackbar = (props) => {
    useEffect(() => {
        console.log(props)
    });
    const handleClose = (e) => {
        props.setAlertShow(false);
    };
    return(
        <Snackbar open={props.open} autoHideDuration={props.duration | 6000} onClose={handleClose}>
            <MuiAlert onClose={handleClose} variant="filled" severity={props.type} sx={{ width: '100%' }}>
                {props.message}
            </MuiAlert>
        </Snackbar>
    )
};

export default MySnackbar;