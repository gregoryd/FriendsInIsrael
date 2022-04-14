import React, { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import WelcomeScreen from "./components/WelcomeScreen";
import ChooseRole from "./components/ChooseRole";
import MatchGeneralScreen from "./components/MatchGeneralScreen";
import Phoner from "./components/Phoner";
import { auth, remult } from "./common";

function App() {
  const [authenticated, setAuthenticated] = useState(remult.authenticated());
  if (!authenticated)
    return <WelcomeScreen userAuthenticated={() => setAuthenticated(true)} />;

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <ChooseRole
              signOut={() => {
                auth.signOut();
                setAuthenticated(false);
              }}
            />
          }
        />
        <Route path="/match-option" element={<MatchGeneralScreen />} />
        <Route path="/phoner" element={<Phoner />} />
      </Routes>
    </div>
  );
}

export default App;
