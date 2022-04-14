import React from "react";
import Flags from "country-flag-icons/react/3x2";
import { Family } from "../common/families";

interface iProps {
  family: Family;
}

const DecideFlag: React.FC<iProps> = ({ family }) => {
  return (
    <div>
      {family.fromCountry.toLowerCase().includes("україна") && (
        <Flags.UA title="ukraine" height={20} />
      )}
      {family.fromCountry.toLowerCase().includes("Беларусь") && (
        <Flags.BY title="belarus" height={20} />
      )}
      {family.fromCountry.includes("ישראל") && (
        <Flags.IL title="israel" height={20} />
      )}

      {family.fromCountry.toLowerCase().includes("россия") && (
        <Flags.RU title="russian" height={20} />
      )}
    </div>
  );
};

export default DecideFlag;
