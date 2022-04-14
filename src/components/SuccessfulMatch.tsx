import React, { useState } from "react";

import SuccessfulPageIcon1 from "./svg/SuccessfulPageIcon1";
import SuccessfulPageIcon2 from "./svg/SuccessfulPageIcon2";
import SuccessfulPageIcon3 from "./svg/SuccessfukPageIcon3";

function SuccessfulMatch() {
  return (
    <div
      style={{
        backgroundImage: "linear-gradient(0deg,  #58f, #58f)",
        height: "100vh",
      }}
      className="d-flex flex-column justify-content-between"
    >
      <div className="d-flex justify-content-start">
        <SuccessfulPageIcon1 />
      </div>
      <div className="d-flex justify-content-center">
        <SuccessfulPageIcon3 />
      </div>
      <div className="d-flex justify-content-end">
        <SuccessfulPageIcon2 />
      </div>
    </div>
  );
}

export default SuccessfulMatch;
