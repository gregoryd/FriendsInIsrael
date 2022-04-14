import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Family } from "../common/families";
import { remult } from "../common";
import { Match } from "../common/Matches";
import SuccessfulMatch from "./SuccessfulMatch";
import PotentialFamily from "./PotentialFamily";
import DecideFlag from "./DecideFlag";
import GeneralModal from "./GeneralModal";
const familyRepo = remult.repo(Family);

function MatchGeneralScreen() {
  let navigate = useNavigate();

  const [chosenFamilyDetails, setChosenFamilyDetails] = useState<Family>();

  const [chosenModalFamily, setChosenModalFamily] = useState<Family>();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [oldFamilies, setOldFamilies] = useState<Family[]>([]);
  const [newFamily, setNewFamily] = useState<Family>();

  function handleClose() {
    setChosenModalFamily(undefined);
  }

  const load = useCallback(async (excludeIds: string[]) => {
    setLoading(true);
    setNewFamily(undefined);
    setOldFamilies([]);

    try {
      let result = await Family.findNextFamilyToMatch(excludeIds).then(
        async (x) => ({
          newFamily: await familyRepo.fromJson(x?.newFamily),
          oldFamilies: x?.oldFamilies
            ? await Promise.all(
                x?.oldFamilies?.map((x) => familyRepo.fromJson(x))
              )
            : [],
        })
      );
      if (result?.newFamily) {
        let newFamLang = result.newFamily.languages.split(",");
        const rankFamily = (f: Family) => {
          let score = 0;
          if (f.cityInHebrew == result.newFamily?.cityInHebrew) score += 2;
          else if (f.area == result.newFamily?.area) score += 1;

          for (const lang of f.languages.split(",")) {
            if (newFamLang?.includes(lang)) {
              score++;
              break;
            }
          }
          let neededKeys = Object.keys(f).filter((el) =>
            el.startsWith("kids_")
          );
          for (const key of neededKeys) {
            let oldFamilyKidsValue = result.newFamily[key as keyof Family];
            let newFamilyKidsValue = f[key as keyof Family];
            if (
              typeof oldFamilyKidsValue !== "string" ||
              typeof newFamilyKidsValue !== "string"
            ) {
              break;
            }
            if (
              (oldFamilyKidsValue.includes("בן") &&
                newFamilyKidsValue.includes("בן")) ||
              (oldFamilyKidsValue.includes("בת") &&
                newFamilyKidsValue.includes("בת"))
            ) {
              score += 0.5;
            }
          }
          return score;
        };
        result.oldFamilies.sort((a, b) => rankFamily(b) - rankFamily(a));

        console.table([
          {
            city: result.newFamily.cityInHebrew,
            lang: result.newFamily.languages,
          },
        ]);
        console.table(
          result.oldFamilies.map((x) => ({
            name: x.name,
            city: x.cityInHebrew,
            lang: x.languages,
            rank: rankFamily(x),
          }))
        );

        setNewFamily(result.newFamily);
        setOldFamilies(result.oldFamilies);
      }
    } catch (err) {
      console.log("error here is", err);
    }

    setLoading(false);
    setSuccess(false);
    // familyRepo.findId("xsds")
  }, []);

  useEffect(() => {
    load([]);
  }, []);
  const skip = async () => {
    setLoading(true);
    if (newFamily) {
      newFamily
        .assign({ allocatedAssigner: "", lastAssignAttempt: new Date() })
        .save();
    }
    load([newFamily?.id!]);
  };
  const match = (oldFamily: Family) => {
    setChosenModalFamily(oldFamily);
  };

  const goOnWithMatch = async (oldFamily: Family) => {
    handleClose();
    setSuccess(true);
    const m = remult.repo(Match).create();
    m.oldFamily = oldFamily;
    m.newFamily = newFamily!;
    m.save();
    m.oldFamily._.reload();
    m.newFamily._.reload();

    load([m.oldFamily.id, m.newFamily.id]);
  };

  if (success) {
    return <SuccessfulMatch />;
  }

  if (chosenFamilyDetails) {
    return (
      <div>
        <PotentialFamily
          key={chosenFamilyDetails.id}
          chosenFamily={chosenFamilyDetails}
          getBacktoFamiliesListPage={() => setChosenFamilyDetails(undefined)}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#304585",
      }}
    >
      <GeneralModal
        show={!!chosenModalFamily?.name}
        handleClose={handleClose}
        chosenFamily={chosenModalFamily}
        goOnWithMatch={goOnWithMatch}
      />

      <div
        style={{
          textAlign: "center",
          fontWeight: 500,
          color: "white",
          padding: 7,
        }}
        className="d-flex"
      >
        <div className="m-auto">שדכן</div>
        <div>
          <i className="fa-solid fa-gear" onClick={() => navigate(`/`)}></i>
        </div>
      </div>

      <div
        style={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: "white",
          padding: 20,
        }}
      >
        {loading ? (
          <span>מחפש משפחה לשיוך...</span>
        ) : newFamily ? (
          <>
            <div
              className="d-flex justify-content-between"
              style={{
                color: "#8d94ac",
                paddingTop: 20,
                fontSize: 14,
                marginBottom: 20,
                fontWeight: 400,
                marginInlineStart: 10,
              }}
            >
              <div>משפחה לשידוך</div>
              <div style={{ color: "black", fontWeight: 500 }} onClick={skip}>
                דלג
              </div>
            </div>

            <div
              className="suggested-family"
              onClick={() => {
                setChosenFamilyDetails(newFamily);
              }}
            >
              <div className="d-flex">
                <div className="prefix-blue"></div>
                <div className="p-3">
                  <div className="d-flex">
                    <DecideFlag family={newFamily} />
                    <div style={{ fontWeight: 500, marginInlineStart: 10 }}>
                      {" "}
                      {newFamily.name}
                    </div>
                  </div>
                  <div style={{ color: "#525a74" }}>
                    <span>{newFamily.city}</span>
                    <span style={{ margin: 5 }}>•</span>
                    <span>{newFamily.languages}</span>
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                color: "#8d94ac",
                paddingTop: 40,
                fontSize: 14,
                marginBottom: 15,
                fontWeight: 400,
                marginInlineStart: 10,
              }}
            >
              משפחות פוטנציאליות
            </div>

            {oldFamilies.map((el, index) => {
              return (
                <div
                  onClick={() => {
                    setChosenFamilyDetails(el);
                  }}
                  key={index}
                  className="potential-family  p-3 mb-3 d-flex justify-content-between align-items-center"
                >
                  <div>
                    <div className="d-flex">
                      <DecideFlag family={el} />
                      <div style={{ fontWeight: 500, marginInlineStart: 10 }}>
                        {" "}
                        {el.name}
                      </div>
                    </div>
                    <div style={{ color: "#525a74" }}>
                      <span>{el.city}</span>
                      <span style={{ margin: 5 }}>•</span>
                      <span>{el.languages}</span>
                    </div>
                  </div>

                  <div style={{ marginInlineStart: 15 }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        match(el);
                      }}
                      className="matchMeButton"
                    >
                      לשדך
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <span>לא נמצאו משפחות לשיוך</span>
        )}
      </div>
    </div>
  );
}

export default MatchGeneralScreen;
