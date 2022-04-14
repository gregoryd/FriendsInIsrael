import React from "react";
import { Modal } from "react-bootstrap";
import { Family } from "../common/families";

interface iProps {
  show: boolean;
  handleClose: () => void;
  chosenFamily: Family | undefined;
  goOnWithMatch: (arg0: Family) => void;
}

const GeneralModal: React.FC<iProps> = ({
  show,
  handleClose,
  chosenFamily,
  goOnWithMatch,
}) => {
  if (!chosenFamily) {
    return <div></div>;
  }

  return (
    <Modal show={show} onHide={handleClose} id="modalPosition">
      <Modal.Body style={{ textAlign: "center" }}>
        <div style={{ fontWeight: "bold" }}>סיימת טיפול</div>
        <div style={{ marginTop: 10, fontSize: 14 }}>
          האם אתה בטוח שהשידוך הסתיים בהצלחה?
        </div>
      </Modal.Body>
      <div className="d-flex ">
        <div
          style={{ borderLeft: " 1px solid  #a9aaae" }}
          className=" yesNoModal"
          onClick={handleClose}
        >
          בטל
        </div>
        <div
          onClick={() => goOnWithMatch(chosenFamily)}
          className=" yesNoModal"
          style={{ color: "#3e7efa" }}
        >
          המשך
        </div>
      </div>
    </Modal>
  );
};

export default GeneralModal;
