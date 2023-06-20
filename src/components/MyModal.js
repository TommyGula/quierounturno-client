import React from "react";
import { Modal, Button } from "react-bootstrap";

const MyModal = (props) => {
    return(
        <Modal show={props.show} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{props.description}</Modal.Body>
            <Modal.Footer>
                {
                    props.secondary ?
                    <Button variant="secondary" onClick={props.handleSecondary}>
                        {props.secondary}
                    </Button> :
                    null
                }
                {
                    props.primary ?
                    <Button variant="primary" onClick={props.handlePrimary}>
                        {props.primary}
                    </Button> :
                    null
                }
            </Modal.Footer>
      </Modal>
    );
};

export default MyModal;