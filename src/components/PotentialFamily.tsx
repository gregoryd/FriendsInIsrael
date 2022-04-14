import React, { useEffect, useState } from "react";
import { Family } from "../common/families";
import DecideFlag from "./DecideFlag";
import { phoneCalculate } from "../utils/phoneCalculater";
import {
  calculateAdultsString,
  calculateKidsString,
} from "../utils/calculateAgesString";

export const PotentialFamily: React.FC<{
  chosenFamily: Family;
  getBacktoFamiliesListPage: VoidFunction;
}> = ({ chosenFamily, getBacktoFamiliesListPage }) => {
  const [noteAdded, setNoteAdded] = useState(chosenFamily.note);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedFamily, setEditedFamily] = useState<{ [key: string]: any }>(
    chosenFamily
  );

  function decideAdultsString() {
    // need to check if edited version exist. if not, use function to extract string

    // if (chosenFamily.adultsAgesString) {
    //   return chosenFamily.adultsAgesString;
    // }

    return calculateAdultsString(chosenFamily);
  }

  function decideKidsString() {
    // need to check if edited version exist. if not, use function to extract string

    // if (chosenFamily.kidsAgesString) {
    //   return chosenFamily.kidsAgesString;
    // }

    return calculateKidsString(chosenFamily);
  }

  function calculateArrivalDate(date: string) {
    if (date) {
      let splittedDate = date.split("/");

      return `${splittedDate[1]}/${splittedDate[0]}/${splittedDate[2]}`;
    }
    return "";
  }

  useEffect(() => {
    setEditedFamily((prev: Family) => {
      prev["phone"] = phoneCalculate(prev.phone);
      prev["arrivalDateIsrael"] = calculateArrivalDate(prev.arrivalDateIsrael);
      // @ts-ignore
      prev["adultsAgesString"] = decideAdultsString();
      // @ts-ignore
      prev["kidsAgesString"] = decideKidsString();
      return { ...prev };
    });

    setTimeout(() => {
      let textAreaElements = document.getElementsByTagName("textarea");
      Array.from(textAreaElements).forEach(function (element) {
        element.style.height = element.scrollHeight + "px";
      });
    }, 0);
  }, []);

  function changeFamilyDetails(
    event: React.ChangeEvent<HTMLTextAreaElement>,
    keyField: string
  ) {
    if (!editMode) {
      return;
    }
    let value = event.target.value;

    setEditedFamily((prev: any) => {
      prev[keyField] = value;
      return { ...prev };
    });
  }

  const myInputElement = (fieldType: string) => {
    return (
      <textarea
        className={editMode ? "editedInput" : "inputAsDiv"}
        value={editedFamily[fieldType]}
        onChange={(e) => changeFamilyDetails(e, fieldType)}
      ></textarea>
    );
  };

  return (
    <div
      style={{
        backgroundColor: "#304585",
      }}
    >
      {/* <GeneralModal />
       */}
      <div
        style={{
          textAlign: "center",
          fontWeight: 500,
          color: "white",
          padding: 7,
        }}
        className="d-flex"
      >
        <div className="m-auto">משפחה פוטנציאלית</div>
        <div>
          <i
            onClick={() => {
              if (noteAdded != chosenFamily.note) {
                // shall assign editedFamily as well, an object that collected all changes
                chosenFamily.assign({ note: noteAdded }).save();
              }
              getBacktoFamiliesListPage();
            }}
            className="fa-solid fa-xmark"
            style={{ marginInlineEnd: 10 }}
          ></i>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#f6f8fe",
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
          padding: 20,
        }}
      >
        <div
          className="d-flex justify-content-between align-items-center"
          style={{
            backgroundColor: "#f6f8fe",
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 600 }}>
            {chosenFamily.name}
          </div>

          <div className="d-flex align-items-center">
            <div style={{ fontSize: 12, marginInlineEnd: 10 }}>
              {chosenFamily.fromCountry}
            </div>
            <DecideFlag family={chosenFamily} />
          </div>
        </div>
      </div>
      <div style={{ backgroundColor: "white", padding: 15 }}>
        <div className="d-flex justify-content-between  mb-3 mt-1">
          <div
            className="littleHeading"
            style={{ fontWeight: "bold", fontSize: 16 }}
          >
            {chosenFamily.lengthTimeInIsrael.includes("מזמן") ? (
              <span style={{ color: "#304585" }}>משפחה וותיקה</span>
            ) : (
              <span style={{ color: "#f4b556" }}>משפחה חדשה</span>
            )}
          </div>
          {/* <button
            onClick={() => setEditMode((prev) => !prev)}
            style={{ fontSize: 13 }}
            className="matchMeButton"
          >
            ערוך
          </button> */}
        </div>

        <div className="littleHeading">פרטי קשר</div>
        <div className="d-flex justify-content-between mt-2">
          <div style={{ marginInlineEnd: 10 }}>{myInputElement("phone")}</div>
          <div style={{ marginInlineStart: 10 }}>{myInputElement("email")}</div>
        </div>

        <textarea
          style={{
            backgroundColor: "#f6f8fe",
            width: "100%",
            border: "2px solid #d4defe",
            resize: "none",

            height: 100,
            padding: 5,
            fontSize: 13,
          }}
          placeholder="הערה למשפחה"
          value={noteAdded}
          onChange={(e) => setNoteAdded(e.target.value)}
        ></textarea>
      </div>
      <div style={{ backgroundColor: "#f6f8fe", height: 10 }}></div>
      <div
        className="d-flex justify-content-between"
        style={{ backgroundColor: "white", padding: 20 }}
      >
        <div style={{ marginInlineEnd: 15, width: "50%" }}>
          <div>
            <div className="littleHeading mb-1">שפות</div>

            {myInputElement("languages")}
          </div>

          <div>
            <div className="littleHeading mb-1">כמות מבוגרים</div>

            {myInputElement("adultsAgesString")}
          </div>

          <div>
            <div className="littleHeading mb-1">ילדים</div>

            {myInputElement("kidsAgesString")}
          </div>
        </div>

        <div style={{ marginInlineStart: 15 }}>
          <div>
            {/* <div className="mb-3" style={{ fontSize: 14 }}>
              {chosenFamily.lengthTimeInIsrael}
            </div> */}
          </div>

          <div>
            {chosenFamily.lengthTimeInIsrael.includes("new arrival") && (
              <div>
                <div className="littleHeading mb-1">תאריך הגעה לישראל</div>

                {myInputElement("arrivalDateIsrael")}
              </div>
            )}

            <div className="littleHeading mb-1">עיר</div>

            {myInputElement("cityInHebrew")}

            <div className="littleHeading mb-1">כמות מבוגרים מעל 65</div>

            {myInputElement("seniors")}
          </div>
        </div>
      </div>

      {chosenFamily.kids && (
        <div>
          <div style={{ backgroundColor: "#f6f8fe", height: 10 }}></div>

          <div style={{ backgroundColor: "white", padding: 20 }}>
            <div className="mb-1">
              <div className="littleHeading">ילדים עם צרכים מיוחדים</div>
              {myInputElement("hasSpecialNeeds")}
            </div>

            <div className="mb-1">
              <div className="littleHeading">הערות לגבי ילדים</div>
              {myInputElement("kidsNotes")}
            </div>
          </div>
        </div>
      )}

      <div style={{ backgroundColor: "#f6f8fe", height: 10 }}></div>

      <div style={{ backgroundColor: "white", padding: 20 }}>
        <div className="littleHeading mb-1">יחס לדת</div>
        {myInputElement("religiousAffiliation")}

        <div className="littleHeading mb-1">מקצועות</div>
        {myInputElement("professions")}

        <div className="littleHeading  mb-2">הערות</div>
        {myInputElement("comments")}
      </div>
    </div>
  );
};

export default PotentialFamily;
