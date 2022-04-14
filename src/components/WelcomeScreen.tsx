import React, { useRef, useState } from "react";
import AbovePicture from "./AbovePicture";
import { auth } from "../common";
import { User } from "../common/Users";

export const WelcomeScreen: React.FC<{ userAuthenticated: VoidFunction }> = ({ userAuthenticated }) => {
  let passwordRef = useRef<HTMLInputElement>(undefined!);
  let userNameRef = useRef<HTMLInputElement>(undefined!);
  const [loading, setLoading] = useState(false);

  async function checkAuthentication() {
    let passwordInput = passwordRef!.current!.value;
    let userInput = userNameRef!.current!.value;
    try {
      setLoading(true);
      auth.setAuthToken(await User.signIn(userInput, passwordInput));
      userAuthenticated();

    }
    catch (err: any) {
      console.log(err);
      alert(err?.message || err);
      setLoading(false);
    }
    finally {
    }

  }

  return (
    <div className="">
      <div style={{ paddingBottom: 40 }}>
        <AbovePicture />
      </div>

      <div className="p-3">
        <div className="main-header">כניסה למערכת</div>
        <form onSubmit={e => {
          e.preventDefault();
          checkAuthentication();
        }}>
          <div className="mb-3">
            <input
              ref={userNameRef}
              type="text"
              className="form-input"
              placeholder="שם משתמש"
            />
          </div>
          <div className="mb-3">
            <input
              ref={passwordRef}
              type="password"
              className="form-input"
              autoComplete="on"
              placeholder="סיסמא"
            />
          </div>

          <button
            disabled={loading}
            onClick={() => checkAuthentication()}
            type="submit"
            className="btn btn-primary go-on-button mt-3"
          >
            התחבר
          </button>
        </form>
      </div>
    </div>
  );
}

export default WelcomeScreen;
