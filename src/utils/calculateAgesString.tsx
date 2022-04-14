import { Family } from "../common/families";

export const calculateAdultsString = (chosenFamily: Family) => {
  let startString = `${chosenFamily.adults} מבוגרים`;
  let ages = [];

  let neededKeys: string[] = Object.keys(chosenFamily).filter((el) =>
    el.startsWith("adults_")
  );

  for (const key of neededKeys) {
    if (chosenFamily[key as keyof Family]) {
      let splittedKey = key.split("_");

      // @ts-ignore
      const numberOfAdults = +chosenFamily[key as keyof Family][0];

      for (let i = 0; i < numberOfAdults; i++) {
        ages.push(Math.ceil((+splittedKey[2] + +splittedKey[1]) / 2));
      }
    }
  }
  return `${startString} (${ages})`;
};

export const calculateKidsString = (chosenFamily: Family) => {
  let stringKids = [];

  let neededKeys = Object.keys(chosenFamily).filter((el) =>
    el.startsWith("kids_")
  );

  for (const key of neededKeys) {
    //@ts-ignore
    if (chosenFamily[key]) {
      //@ts-ignore
      let fieldValue = chosenFamily[key];
      let splittedKey = key.split("_");
      let gender = "";
      if (fieldValue.includes("בת") && fieldValue.includes("בן")) {
        gender = "בן ובת - ";
      } else if (fieldValue.includes("בת")) {
        gender = "בת - ";
      } else if (fieldValue.includes("בן")) {
        gender = "בן - ";
      }
      let stringOneKid = "";

      stringOneKid = `${stringKids.length === 0 ? "" : " "}${gender}${Math.ceil(
        (+splittedKey[2] + +splittedKey[1]) / 2
      )}`;

      stringKids.push(stringOneKid);
    }
  }
  return stringKids;
};
