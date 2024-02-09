import React from "react";
import { Modal } from "react-bootstrap";
import { Button } from "@mui/material";

const MyModal = (props) => {
    return(
        <Modal show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.description}
                {
                    props.content && 
                    props.content
                }
            </Modal.Body>
            <Modal.Footer>
                {
                    props.secondary ?
                    <Button variant="contained" color="secondary" onClick={props.handleSecondary}>
                        {props.secondary}
                    </Button> :
                    null
                }
                {
                    props.primary ?
                    <Button variant="contained" color="primary" onClick={props.handlePrimary}>
                        {props.primary}
                    </Button> :
                    null
                }
            </Modal.Footer>
      </Modal>
    );
};

export default MyModal;