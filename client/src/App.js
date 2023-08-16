import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { FaFacebook } from "react-icons/fa";
import React from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [fbResponse, setFbResponse] = React.useState([]);
  const responseFacebook = async (response) => {
    if (response.status === "unknown") {
      // @ts-ignore
      window.location.reload(false);
    }
    let pageTokenRes = await axios.get(
      `https://graph.facebook.com/${response.userID}/accounts?access_token=${response.accessToken}`
    );

    let saveUser = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/users`,
      {
        accessToken: response.accessToken,
        userId: response.userID,
        name: response.name,
        pagestoken: pageTokenRes.data.data[0].access_token,
        profilepictureurl: response.picture.data.url,
      }
    );
    setFbResponse(saveUser.data);
  };

  return (
    <>
      {fbResponse.length === 0 && (
        <div>
          <FacebookLogin
            // @ts-ignore
            appId={process.env.REACT_APP_FACEBOOK_APP_ID}
            autoLoad={false}
            fields="name,picture"
            callback={responseFacebook}
            scope="pages_show_list,pages_messaging"
            render={(renderProps) => (
              <div className="container d-flex justify-content-center align-items-center">
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Login with Facebook</h2>
                  </div>
                  <div className="card-body">
                    <button
                      className="btn btn-facebook"
                      onClick={renderProps.onClick}
                    >
                      <FaFacebook className="mr-2" />
                      <span className="font-weight-bold-i">
                        Continue with Facebook
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          />
        </div>
      )}
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
                <div className="container">
                  <div className="card">
                    <div className="card-header">
                      <h2 className="card-title">User Information</h2>
                    </div>
                    <div className="card-body user-info">
                      <img
                        // @ts-ignore
                        src={response.profilepictureurl}
                        alt="User Profile"
                        className="img-thumbnail rounded-circle"
                      />
                      <p>
                        Name:{" "}
                        {
                          // @ts-ignore
                          response.name
                        }
                      </p>
                      <p>
                        User ID:{" "}
                        {
                          // @ts-ignore
                          response.userid
                        }
                      </p>
                      <div className="d-flex flex-column align-items-center">
                        <p className="w-30">
                          Access Token:{" "}
                          {
                            // @ts-ignore
                            response.accesstoken
                          }
                        </p>
                        <p className="w-30">
                          Pages Token:{" "}
                          {
                            // @ts-ignore
                            response.pagestoken
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default App;
