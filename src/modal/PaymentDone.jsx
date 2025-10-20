import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal } from "react-bootstrap";
import "./PaymentDone.css";

const PaymentDoneModal = ({ show, onHide, children, title }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      style={{ display: "block" }}
      dialogClassName="top-centered-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-center align-items-center">
        <div className="text-center w-100">{children}</div>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button variant="success" onClick={() => onHide()}>
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentDoneModal;
