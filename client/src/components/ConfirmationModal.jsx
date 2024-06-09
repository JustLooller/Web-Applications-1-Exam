import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import API from "../api/API.js";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export default function ConfirmationModal({
  buttonName,
  buttonType,
  page,
  title,
  message,
  redirectTo,
}) {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);

  const handleClose = () => {
    setShow(false);
    setSelectedPage(null);
  };

  const handleShow = () => {
    setShow(true);
    setSelectedPage(page);
  };

  const handleDelete = () => {
    API.deletePage(selectedPage.id)
      .then(() => {
        handleClose();
        navigate(redirectTo);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Button className="me-2" variant={buttonType} onClick={handleShow}>
        {buttonName}
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Back
          </Button>
          <Button variant="outline-danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

ConfirmationModal.propTypes = {
  buttonName: PropTypes.string.isRequired,
  buttonType: PropTypes.string.isRequired,
  page: PropTypes.object,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  redirectTo: PropTypes.string,
};
