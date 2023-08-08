import FacebookLogin from "react-facebook-login";
import React, { useEffect } from "react";
import axios from "axios";

import "./App.css";
const App = () => {
  const [fbResponse, setFbResponse] = React.useState(null);
  const [imgURL, setImgURL] = React.useState("");

  useEffect(() => {
    // Initialize Facebook SDK here from above
  }, []);

  const responseFacebook = async (response) => {
    console.log(response)
    setImgURL(response.picture.data.url)
    let data = {
      accessToken: response.accessToken,
      userId: response.userID,
      name: response.name,
    };
    let saveUser = await axios.post("http://localhost:3000/users", data);
    console.log(saveUser);
    setFbResponse(saveUser.data.split(":")[1]);
  };

  return (
    <>
      <div className="loginBtn loginBtn--facebook">
        <FacebookLogin
          appId="258809283577008"
          autoLoad={false}
          fields="name,email,picture"
          callback={responseFacebook}
          scope="ads_read,ads_management"
        />
      </div>
      <div>
        {
          fbResponse && (
          <>
            <div style={{margin:"0 auto"}} >
              <div style={{maxWidth:'400px'}}>
                <p style={{maxWidth:'400px'}}>Your Facebook Access Token:{fbResponse}</p>
                <p>Profile Picture:</p>
                <div>
                  <img src={imgURL} alt="profile"/>
                </div>
              </div>
            </div>
          </>)
        }
      </div>
    </>
  );
};

export default App;
