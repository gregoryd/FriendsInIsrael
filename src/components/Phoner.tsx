import React, { useCallback, useEffect, useState } from "react";
import Flags from "country-flag-icons/react/3x2";
import { useNavigate } from "react-router-dom";
import { Family } from "../common/families";
import { remult } from "../common";
import { Match, MatchStatus } from "../common/Matches";
import { EntityFilter, getValueList } from "remult";
import PotentialFamily from "./PotentialFamily";
import { phoneCalculate } from "../utils/phoneCalculater";

const matchRepo = remult.repo(Match);
interface loadFamiliesArgs {
  myFamilies?: boolean,
  availableFamilies?: boolean
}
function Phoner() {
  let navigate = useNavigate();
  const [loadingNext, setLoadingNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [match, setMatch] = useState<Match>();
  const [status, setStatus] = useState<MatchStatus>();

  const [chosenFamilyDetails, setChosenFamilyDetails] = useState<Family>();

  const [showOldFamilyPhone, setShowOldFamilyPhone] = useState(false);
  const [showNewFamilyPhone, setShowNewFamilyPhone] = useState(false);

  const loadCallToMatch = useCallback(async (args: loadFamiliesArgs) => {
    setLoading(true);

    let match: Match | undefined;
    if (args.myFamilies) {
      match = await matchRepo.findFirst(
        {
          status: getValueList(MatchStatus).filter((x) => x.activeForCaller),
          user: [remult.user.id]
        }, {
        orderBy: {
          lastAttempt: "asc"
        }
      }
      );
    }
    if (!match && args.availableFamilies) {
      let thirtyMinutesAgo = new Date();
      thirtyMinutesAgo.setMinutes(thirtyMinutesAgo.getMinutes() - 30);
      match = await matchRepo.findFirst(
        {
          $or: [
            { user: "" },
            {
              user: { "!=": "" },
              lastAttempt: { "<=": thirtyMinutesAgo },
              status: [MatchStatus.callOldFamily, MatchStatus.oldFamilyNotAnswer]
            },

          ]
        }, {
        orderBy: {
          lastAttempt: "asc"
        }
      });
    }
    if (match && !match.user) {
      match.user = remult.user.id;
      match.lastAttempt = new Date();
      await match.save();
    }
    setMatch(match);
    if (match) setStatus(match.status);
    setLoading(false);
  }, []);

  useEffect(() => {
    (async () => {
      loadCallToMatch({
        availableFamilies: true,
        myFamilies: true
      });
      // familyRepo.findId("xsds")
    })();
  }, []);

  // useEffect(() => {
  //   console.log("match is", match.newFamily.id);
  //   console.log("match is", match.oldFamily.id);
  // }, [match]);
  const updateStatus = (statusId: string) => {
    const newStatus = getValueList(MatchStatus).find((s) => s.id === statusId)!;
    setStatus(newStatus);
    if (newStatus.lockVolunteer && newStatus.activeForCaller && !match!.$.status.originalValue.lockVolunteer) {
      alert("היות ויצרת קשר עם אחת המשפחות, הזוג הוצמד אליך עד לסיום הטיפול");
    }
  }
  const update = async (args: loadFamiliesArgs) => {
    setLoadingNext(true);
    if (match) {
      match.status = status!;
      match.lastAttempt = new Date();


      if (!match.status.lockVolunteer)
        match.user = '';


      await match.save().then(() => {
        match.oldFamily._.reload();
        match.newFamily._.reload();
      });
    }
    setLoadingNext(false);
    setShowOldFamilyPhone(false);
    setShowNewFamilyPhone(false);
    loadCallToMatch(args);
  };

  if (chosenFamilyDetails) {
    return (
      <div>
        <PotentialFamily
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
        <div className="m-auto">טלפן</div>
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
          <span>מחפש משפחות לטלפן....</span>
        ) : !match ? (
          <span>לא נמצאו משפחות לטלפן</span>
        ) : (
          <>
            {" "}
            <div
              style={{
                color: "#8d94ac",
                paddingTop: 10,
                fontSize: 14,
                marginBottom: 20,
                fontWeight: 400,
                marginInlineStart: 10,
              }}
            >
              שידוך נוכחי
            </div>
            <div>
              <div style={{ border: "1px solid #e5e5e5", borderRadius: 20 }}>
                <div
                  className="p-3"
                  onClick={() => {
                    setChosenFamilyDetails(match.oldFamily);
                  }}
                >
                  <Flags.IL
                    title="Israel"
                    height={20}
                    style={{ marginInlineEnd: 10 }}
                  />
                  <span style={{ fontSize: 18, fontWeight: 500 }}>
                    {" "}
                    {match.oldFamily.name}
                  </span>

                  <div className="pt-2">{match.oldFamily.languages}</div>
                  <div>
                    <a
                      onClick={(e) => {
                        e.stopPropagation();
                        setChosenFamilyDetails(undefined);
                      }}
                      href={`tel:${match.oldFamily.phone}`}
                    >
                      <button
                        onClick={() => setShowOldFamilyPhone((prev) => !prev)}
                        className="matchMeButton2"
                        style={{ backgroundColor: "#304585" }}
                      >
                        {showOldFamilyPhone ? (
                          <span>{phoneCalculate(match.oldFamily.phone)}</span>
                        ) : (
                          <span>חייג למשפחה מאמצת</span>
                        )}
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="mt-3"
              onClick={() => {
                setChosenFamilyDetails(match.newFamily);
              }}
            >
              <div style={{ border: "1px solid  #e5e5e5", borderRadius: 20 }}>
                <div className="p-3">
                  <Flags.UA
                    title="United States"
                    height={20}
                    style={{ marginInlineEnd: 10 }}
                  />
                  <span style={{ fontSize: 18, fontWeight: 500 }}>
                    {" "}
                    {match.newFamily.name}
                  </span>

                  <div className="pt-2">{match.newFamily.languages}</div>
                  <div>
                    <a
                      onClick={(e) => {
                        e.stopPropagation();
                        setChosenFamilyDetails(undefined);
                      }}
                      href={`tel:${match.newFamily.phone}`}
                    >
                      <button
                        onClick={() => setShowNewFamilyPhone((prev) => !prev)}
                        className="matchMeButton2"
                        style={{ backgroundColor: "#f4b556" }}
                      >
                        {showNewFamilyPhone ? (
                          <span>{phoneCalculate(match.newFamily.phone)}</span>
                        ) : (
                          <span>חייג למשפחה חדשה</span>
                        )}
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 8 }}>
              <select
                className="form-select mt-3"
                value={status!.id}
                onChange={(e) =>
                  updateStatus(e.target.value)
                }
              >
                {getValueList(MatchStatus).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.caption}
                  </option>
                ))}
              </select>
              {status!.tip ? (
                <div className="boxInstructions mt-4 p-2">
                  <div className="littleHeading mb-1">מה עכשיו?</div>
                  <div style={{ fontSize: 15 }}>{status!.tip}</div>
                </div>
              ) : (
                <></>
              )}
              {!loadingNext && (<>
                <button className="matchMeButton3" onClick={() => update({ myFamilies: true })}>
                  {match.status != status ? "עדכן ו" : ""}
                  הצג את הזוג הבא מאלה שהוצמדו אלי
                </button>
                <button className="matchMeButton3" onClick={() => update({ availableFamilies: true })}>
                  {match.status != status ? "עדכן ו" : ""}
                  הצג זוג חדש
                </button></>
              )}
              {loadingNext && (
                <button className="matchMeButton3">טוען...</button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Phoner;
