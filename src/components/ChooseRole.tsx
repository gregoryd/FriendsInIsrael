import React, { useState } from "react";
import AbovePicture from "./AbovePicture";
import { useNavigate } from "react-router-dom";
import { remult } from "../common";
import { Roles } from "../Roles";

export const ChooseRole: React.FC<{ signOut: VoidFunction }> = ({
  signOut,
}) => {
  const [chosenRole, setChosenRole] = useState("");
  let navigate = useNavigate();

  return (
    <div>
      <div style={{ paddingBottom: 40 }}>
        <AbovePicture />
      </div>

      <div className="p-3">
        <div className="main-header">מה התפקיד שלך?</div>

        {remult.isAllowed(Roles.matcher) ? <div
          className="mb-3  text-center p-3"
          id={
            chosenRole === "matcher"
              ? "chosen-role-button"
              : "choose-role-button"
          }
          onClick={() => navigate("/match-option")}
        >
          היכנס כשדכן
        </div> : undefined}
        {remult.isAllowed(Roles.matcher) ? <div
          className="mb-3  text-center p-3"
          id={
            chosenRole === "phoner"
              ? "chosen-role-button"
              : "choose-role-button"
          }
          onClick={() => navigate("/phoner")}
        >
          היכנס כטלפן
        </div> : undefined}


        <div className="d-flex justify-content-end">
          <div
            style={{ fontSize: 13, paddingInlineEnd: 5, marginTop: 16 }}
            onClick={signOut}
          >
            יציאה
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseRole;

/* Rectangle 287 */
