import FacebookLogin from "react-facebook-login";
import React, { useEffect } from "react";
import axios from "axios";

import "./App.css";
const App = () => {
  const [fbResponse, setFbResponse] = React.useState([]);
  const [imgURL, setImgURL] = React.useState("");

  useEffect(() => {
    // Initialize Facebook SDK here from above
  }, []);

  const responseFacebook = async (response) => {
    let data = {
      accessToken: response.accessToken,
      userId: response.userID,
      name: response.name,
    };
    setImgURL(response.picture.data.url);
    let saveUser = await axios.post("https://meta-login-db8f23744123.herokuapp.com/users", data);
    setFbResponse(saveUser.data);
  };

  return (
    <>
      {fbResponse.length === 0 && <div className="loginBtn">
        <FacebookLogin
          appId={process.env.REACT_APP_FACEBOOK_APP_ID}
          autoLoad={false}
          fields="name,email,picture"
          callback={responseFacebook}
          scope="ads_read,ads_management"
          icon="fa-facebook"
        />
      </div>}
      <div>
        {fbResponse &&
          fbResponse.map((response) => {
            return (
              <div
                key={
                  // @ts-ignore
                  response.userid
                }
              >
                <p style={{ wordWrap: "break-word" }}>
                  Access Token:{" "}
                  {
                    // @ts-ignore
                    response.accesstoken
                  }
                </p>
                <p>
                  User Id:{" "}
                  {
                    // @ts-ignore
                    response.userid
                  }
                </p>
                <p>
                  Profile name:{" "}
                  {
                    // @ts-ignore
                    response.name
                  }
                </p>
                <img src={imgURL} alt="profile" />
              </div>
            );
          })}
      </div>
    </>
  );
};

export default App;
