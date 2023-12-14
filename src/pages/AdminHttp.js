import React, { useState } from 'react';
import { TextField, Button, TextareaAutosize, Container, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { get, post, put, remove } from '../utils/axios';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
  },
  input: {
    marginBottom: theme.spacing(2),
  },
  textarea: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  button: {
    marginRight: theme.spacing(2),
  },
}));

const Admin = ({context}) => {
  const classes = useStyles();

  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [response, setResponse] = useState("");
  const [lastResponses, setLastResponses] = useState([]);
  const [index, setIndex] = useState(0);
  const [body, setBody] = useState('');

  const handleButtonClick = (selectedMethod) => {
    // Logic for making the HTTP request goes here
    console.log(`Sending ${selectedMethod} request to ${url} with body: ${body}`);
    switch(selectedMethod) {
        case "GET": 
            get(url, context.token, (data) => {
                handleResponse(JSON.stringify(data, null, 2));
            })
            break;
        case "PUT":
            put(url, context.token, JSON.parse(body), (data) => {
                handleResponse(JSON.stringify(data, null, 2));
            })
        case "DELETE":
            remove(url, context.token, (data) => {
                handleResponse(JSON.stringify(data, null, 2))
            })
            break;
        default:
            break;
    }
  };

  const handleResponseCarousel = (i) => {
        const actualResponse = lastResponses[lastResponses.length + index + i];
        if (actualResponse) {
            setResponse(actualResponse);
            setIndex(index + i);
        }
    }

    const handleResponse = (res) => {
        setResponse(res);
        setLastResponses(() => [...lastResponses, response]);
    }

  return (
    <div className='p-4'>
        <h3 className="title mb-3">Admin Page</h3>
        <div className="row">
        <div className="col col-6">

            <TextField
                className="textfield-primary w-100 mb-4"
                label="Url"
                variant="standard"
                onChange={(e) => setUrl(e.target.value)}
                width="auto"
                required
                readOnly={false}
                InputProps={{
                    startAdornment: (
                      <React.Fragment>
                        <span style={{ marginRight: '8px' }}>{process.env.REACT_APP_BACKEND_PATH}</span>
                      </React.Fragment>
                    ),
                }}
            />
            <div className='mb-4' >
            <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={() => handleButtonClick('GET')}
            >
                GET
            </Button>
            <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={() => handleButtonClick('POST')}
            >
                POST
            </Button>
            <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={() => handleButtonClick('PUT')}
            >
                PUT
            </Button>
            <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={() => handleButtonClick('DELETE')}
            >
                DELETE
            </Button>
            </div>
            <div className="form-group">
                <textarea className="form-control p-4" value={body} placeholder="" rows="10" onChange={(e) => setBody(e.target.value)}></textarea>
            </div>
        </div>
        <div className="position-relative col col-6">
            <div className="d-flex justify-content-between">
            <Button color='primary' onClick={() => handleResponseCarousel(-1)}>{"< Back"}</Button>
            <Button color='primary' onClick={() => handleResponseCarousel(1)}>{"Next >"}</Button>
            </div>
            <div className="form-group" style={{height:"100%"}}>
                <textarea readOnly className="form-control p-4 mb-5" value={response} style={{height:"inherit"}} onChange={(e) => setBody(e.target.value)}></textarea>
            </div>
        </div>
        </div>
    </div>
  );
};

export default Admin;
